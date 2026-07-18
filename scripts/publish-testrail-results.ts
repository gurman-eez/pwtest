/**
 * Publishes Playwright results to TestRail for whichever tests carry a
 * `{ type: 'testrail', description: 'C<id>' }` annotation (see fixtures/base.ts
 * usage in tests/login-signup.spec.ts, tests/checkout.spec.ts).
 *
 * Reads the Playwright JSON reporter output (playwright.config.ts's `json`
 * reporter), creates a TestRail run scoped to exactly the annotated cases
 * found, and publishes each one's pass/fail result. Tests without a
 * TestRail annotation are ignored — nothing is force-matched by title.
 *
 * Usage: node --experimental-strip-types scripts/publish-testrail-results.ts \
 *   <report-json-path> <testrail-suite-id> <run-name>
 *
 * Requires TESTRAIL_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID in env.
 */
import { readFileSync } from 'node:fs';
import { TestRailClient, type TestRailResultStatus } from '../utils/testrail-client.ts';

interface PWReportAnnotation {
  type: string;
  description: string;
}

interface PWReportTest {
  annotations: PWReportAnnotation[];
  status: string;
}

interface PWReportSpec {
  tests: PWReportTest[];
}

interface PWReportNode {
  specs?: PWReportSpec[];
  suites?: PWReportNode[];
}

function collectSpecs(node: PWReportNode, out: PWReportSpec[]): void {
  if (node.specs) out.push(...node.specs);
  if (node.suites) node.suites.forEach((suite) => collectSpecs(suite, out));
}

function parseCaseId(description: string): number | null {
  const match = /^C(\d+)$/.exec(description.trim());
  return match ? Number(match[1]) : null;
}

async function main(): Promise<void> {
  const [reportJsonPath, suiteIdRaw, runName] = process.argv.slice(2);
  if (!reportJsonPath || !suiteIdRaw || !runName) {
    console.error(
      'Usage: publish-testrail-results.ts <report-json-path> <testrail-suite-id> <run-name>'
    );
    process.exitCode = 1;
    return;
  }

  const projectIdRaw = process.env.TESTRAIL_PROJECT_ID;
  if (!projectIdRaw) {
    console.error('[publish-testrail-results] TESTRAIL_PROJECT_ID is not set — nothing to publish to.');
    process.exitCode = 1;
    return;
  }

  const report: PWReportNode = JSON.parse(readFileSync(reportJsonPath, 'utf-8'));
  const specs: PWReportSpec[] = [];
  collectSpecs(report, specs);

  const results: Array<{ caseId: number; status: TestRailResultStatus }> = [];
  for (const spec of specs) {
    for (const test of spec.tests) {
      const annotation = test.annotations.find((a) => a.type === 'testrail');
      if (!annotation) continue;

      const caseId = parseCaseId(annotation.description);
      if (caseId === null) {
        console.error(`[publish-testrail-results] Unrecognized TestRail annotation "${annotation.description}", skipping.`);
        continue;
      }

      // test.status is Playwright's post-retry outcome: 'expected' means it ended in the
      // status the test declared upfront (normally "passed"); anything else is a failure
      // to report (unexpected, flaky, skipped-when-not-expected, etc.).
      results.push({ caseId, status: test.status === 'expected' ? 'passed' : 'failed' });
    }
  }

  if (results.length === 0) {
    console.log('[publish-testrail-results] No TestRail-annotated tests found in the report — nothing to publish.');
    return;
  }

  const client = new TestRailClient();
  const projectId = Number(projectIdRaw);
  const suiteId = Number(suiteIdRaw);

  const run = await client.addRun(projectId, suiteId, runName, results.map((r) => r.caseId));
  if (!run) {
    console.error('[publish-testrail-results] Failed to create TestRail run — see error above.');
    process.exitCode = 1;
    return;
  }

  const published = await client.addResultsForCases(run.id, results);
  if (!published) {
    console.error('[publish-testrail-results] Failed to publish results — see error above.');
    process.exitCode = 1;
    return;
  }

  console.log(`[publish-testrail-results] Published ${results.length} result(s) to TestRail run #${run.id}.`);
}

main();
