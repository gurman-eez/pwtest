/**
 * Publishes Playwright results to TestRail for whichever tests carry a
 * `{ type: 'testrail', description: 'C<id>' }` annotation (see fixtures/base.ts
 * usage in tests/login-signup.spec.ts, tests/checkout.spec.ts), then — reusing
 * the same already-parsed report, no second read/parse pass — files a Jira bug
 * for every test that failed *persistently* (failed on its initial attempt AND
 * every retry; playwright.config.ts retries once in CI). A test that failed
 * then passed on retry is "flaky" (e.g. the automationexercise.com
 * /api/createAccount redirect-loop seen in CI before) and must NOT get a bug —
 * Playwright's own post-retry `status` field already makes this distinction:
 * 'unexpected' (still failing) vs 'flaky' (passed on retry) vs 'expected'.
 *
 * Usage: node --experimental-strip-types scripts/publish-testrail-results.ts \
 *   <report-json-path> <testrail-suite-id> <run-name> <report-url>
 *
 * Requires TESTRAIL_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID in env.
 * Jira bug filing additionally requires JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, and
 * JIRA_PROJECT_KEY — if JIRA_PROJECT_KEY is unset, that stage is skipped entirely
 * (TestRail publishing above still runs), which is how the api-tests job opts out
 * for now (same TODO as its disabled TestRail step: no annotations there yet).
 *
 * Before each new Jira bug is filed (after the dedup check, so a duplicate never spends the
 * call), scripts/classify-failure.ts classifies the failure from its screenshot — if the
 * Playwright report captured one and ANTHROPIC_API_KEY is set — and the result is appended to
 * the bug's description as an "AI classification" block. It's a pure best-effort enrichment:
 * classifyFailure() never throws, so a classification failure never blocks filing the bug
 * itself. Every classification is also written to CLASSIFICATIONS_OUTPUT_PATH below for
 * .github/actions/report-to-slack to pick up (see e2e.yml step order: this action now runs
 * before report-to-slack specifically so that file exists in time).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { TestRailClient, type TestRailResultStatus } from '../utils/testrail-client.ts';
import { JiraClient } from '../utils/jira-client.ts';
import { classifyFailure } from './classify-failure.ts';

interface PWReportAnnotation {
  type: string;
  description: string;
}

interface PWReportError {
  message?: string;
}

interface PWReportAttachment {
  name: string;
  contentType: string;
  path?: string;
}

interface PWReportResult {
  status: string;
  errors?: PWReportError[];
  attachments?: PWReportAttachment[];
}

interface PWReportTest {
  annotations: PWReportAnnotation[];
  status: string;
  results: PWReportResult[];
}

interface PWReportSpec {
  title: string;
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

/** Strips ANSI color codes Playwright embeds in error messages, not useful in a Jira description. */
function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

function lastErrorMessage(test: PWReportTest): string {
  const lastResult = test.results[test.results.length - 1];
  const message = lastResult?.errors?.[0]?.message;
  if (!message) return '(no error message captured)';
  const cleaned = stripAnsi(message).trim();
  return cleaned.length > 2000 ? `${cleaned.slice(0, 2000)}\n... (truncated)` : cleaned;
}

/** The failure screenshot path (screenshot: 'only-on-failure' in playwright.config.ts), if one was captured. */
function lastScreenshotPath(test: PWReportTest): string | null {
  const lastResult = test.results[test.results.length - 1];
  const screenshot = lastResult?.attachments?.find((a) => a.name === 'screenshot' && a.contentType === 'image/png');
  return screenshot?.path ?? null;
}

function mapTrigger(eventName: string | undefined): string {
  if (eventName === 'schedule') return 'schedule';
  if (eventName === 'pull_request') return 'PR';
  return eventName ?? 'unknown';
}

/** Escapes a string for use inside a double-quoted JQL literal. */
function jqlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** Side-channel output for .github/actions/report-to-slack — see its own comment on why this exists. */
const CLASSIFICATIONS_OUTPUT_PATH = 'test-results/failure-classifications.json';

async function fileJiraBugsForStableFailures(
  specs: PWReportSpec[],
  jobName: string,
  runUrl: string,
  reportUrl: string,
  triggerType: string
): Promise<void> {
  const projectKey = process.env.JIRA_PROJECT_KEY;
  if (!projectKey) {
    console.log('[publish-testrail-results] JIRA_PROJECT_KEY is not set — skipping Jira bug filing.');
    return;
  }

  const bugType = process.env.JIRA_BUG_TYPE || 'Bug';
  const dedupDays = Number(process.env.JIRA_DEDUP_DAYS || '7');
  const jira = new JiraClient();

  const testrailUrl = process.env.TESTRAIL_URL;
  const testrailEmail = process.env.TESTRAIL_EMAIL;
  const testrailApiKey = process.env.TESTRAIL_API_KEY;
  const testrail =
    testrailUrl && testrailEmail && testrailApiKey
      ? new TestRailClient({ baseUrl: testrailUrl, email: testrailEmail, apiKey: testrailApiKey })
      : null;

  const classifications: Record<string, { category: string; confidence: string }> = {};

  for (const spec of specs) {
    for (const test of spec.tests) {
      if (test.status !== 'unexpected') continue; // flaky/expected/skipped — not a stable failure

      const annotation = test.annotations.find((a) => a.type === 'testrail');
      const caseId = annotation ? parseCaseId(annotation.description) : null;

      let label: string | undefined;
      if (caseId !== null) {
        const testrailCase = testrail ? await testrail.getCase(caseId) : null;
        label = testrailCase?.refs ? testrailCase.refs : `testrail-C${caseId}`;
      }

      const summary = `[${jobName}] ${spec.title} — failing`;

      // Dedup check first — no point spending an image-classification call on a failure that's
      // already got an open Jira issue from an earlier run.
      const dedupJql = label
        ? `project = ${jqlQuote(projectKey)} AND labels = ${jqlQuote(label)} AND created >= -${dedupDays}d AND statusCategory != Done`
        : `project = ${jqlQuote(projectKey)} AND summary ~ ${jqlQuote(summary)} AND created >= -${dedupDays}d AND statusCategory != Done`;

      const existing = await jira.searchIssues(dedupJql);
      if (existing === null) {
        console.error(`[publish-testrail-results] Jira dedup search failed for "${summary}" — skipping to avoid spamming duplicates.`);
        continue;
      }
      if (existing.length > 0) {
        console.log(
          `[publish-testrail-results] Duplicate skipped: "${summary}" already open as ${existing.map((i) => i.key).join(', ')}.`
        );
        continue;
      }

      const screenshotPath = lastScreenshotPath(test);
      const classification = screenshotPath
        ? await classifyFailure({ testName: spec.title, errorMessage: lastErrorMessage(test), screenshotPath })
        : null;
      if (!screenshotPath) {
        console.log(`[publish-testrail-results] No failure screenshot for "${spec.title}" — filing without AI classification.`);
      }
      if (classification) {
        classifications[spec.title] = { category: classification.category, confidence: classification.confidence };
      }

      const description = [
        `Trigger: ${triggerType}`,
        `CI run: ${runUrl}`,
        `HTML report: ${reportUrl}`,
        caseId !== null ? `TestRail case: C${caseId}${label ? ` (${label})` : ''}` : null,
        '',
        'Last error:',
        '```',
        lastErrorMessage(test),
        '```',
        classification
          ? [
              '',
              'AI classification:',
              `- Category: ${classification.category}`,
              `- Confidence: ${classification.confidence}`,
              `- Suggested action: ${classification.suggested_action}`,
              `- Reasoning: ${classification.reasoning}`,
            ].join('\n')
          : null,
      ]
        .filter((line) => line !== null)
        .join('\n');

      const issue = await jira.createIssue({
        projectKey,
        type: bugType,
        summary,
        description,
        labels: label ? [label] : [],
      });

      if (issue) {
        console.log(`[publish-testrail-results] Filed Jira bug ${issue.key} for "${summary}".`);
      } else {
        console.error(`[publish-testrail-results] Failed to file Jira bug for "${summary}" — see error above.`);
      }
    }
  }

  // Read by .github/actions/report-to-slack's parsing step (if present) to append a short
  // "🔍 likely: <category>" badge next to each failed test title — written even when empty so
  // that step can tell "no classifications" from "this step never ran" via file presence alone.
  try {
    writeFileSync(CLASSIFICATIONS_OUTPUT_PATH, JSON.stringify(classifications, null, 2));
    console.log(`[publish-testrail-results] Wrote ${Object.keys(classifications).length} classification(s) to ${CLASSIFICATIONS_OUTPUT_PATH}.`);
  } catch (error) {
    console.error(`[publish-testrail-results] Failed to write ${CLASSIFICATIONS_OUTPUT_PATH}:`, error instanceof Error ? error.message : error);
  }
}

async function main(): Promise<void> {
  const [reportJsonPath, suiteIdRaw, runName, reportUrl] = process.argv.slice(2);
  if (!reportJsonPath || !suiteIdRaw || !runName || !reportUrl) {
    console.error(
      'Usage: publish-testrail-results.ts <report-json-path> <testrail-suite-id> <run-name> <report-url>'
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

      // 'flaky' (failed, then passed on retry) counts as a pass here: the suite ended up
      // green, and Jira bug filing below is what's responsible for flagging stable failures.
      results.push({ caseId, status: test.status !== 'unexpected' ? 'passed' : 'failed' });
    }
  }

  if (results.length === 0) {
    console.log('[publish-testrail-results] No TestRail-annotated tests found in the report — nothing to publish.');
  } else {
    const client = new TestRailClient();
    const projectId = Number(projectIdRaw);
    const suiteId = Number(suiteIdRaw);

    const run = await client.addRun(projectId, suiteId, runName, results.map((r) => r.caseId));
    if (!run) {
      console.error('[publish-testrail-results] Failed to create TestRail run — see error above.');
      process.exitCode = 1;
    } else {
      const published = await client.addResultsForCases(run.id, results);
      if (!published) {
        console.error('[publish-testrail-results] Failed to publish results — see error above.');
        process.exitCode = 1;
      } else {
        console.log(`[publish-testrail-results] Published ${results.length} result(s) to TestRail run #${run.id}.`);
      }
    }
  }

  try {
    const jobName = process.env.GITHUB_JOB || 'unknown-job';
    const triggerType = mapTrigger(process.env.GITHUB_EVENT_NAME);
    const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    await fileJiraBugsForStableFailures(specs, jobName, runUrl, reportUrl, triggerType);
  } catch (error) {
    // Jira bug filing is best-effort on top of the TestRail publish above; a bug here
    // shouldn't overwrite whatever exit code that already set.
    console.error('[publish-testrail-results] Jira bug filing threw unexpectedly:', error instanceof Error ? error.message : error);
  }
}

main();
