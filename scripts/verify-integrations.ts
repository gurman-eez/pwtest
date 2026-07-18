/**
 * Read-only connectivity check for TestRail and Jira credentials.
 * Creates nothing — run this after wiring up env vars to confirm both
 * integrations authenticate before using TestRailClient/JiraClient for real.
 *
 * Usage: node --experimental-strip-types scripts/verify-integrations.ts
 */
import { TestRailClient } from '../utils/testrail-client.ts';
import { JiraClient } from '../utils/jira-client.ts';

async function verifyTestRail(): Promise<boolean> {
  console.log('--- TestRail ---');
  const testrail = new TestRailClient();
  const projects = await testrail.getProjects();

  if (!projects) {
    console.log('FAILED — could not fetch projects (see error above).');
    return false;
  }

  console.log(`OK — ${projects.length} project(s) visible:`);
  for (const project of projects) {
    console.log(`  [${project.id}] ${project.name}`);
  }
  return true;
}

async function verifyJira(): Promise<boolean> {
  console.log('\n--- Jira ---');
  const jira = new JiraClient();
  const me = await jira.getCurrentUser();

  if (!me) {
    console.log('FAILED — could not fetch current user (see error above).');
    return false;
  }

  console.log(`OK — authenticated as "${me.displayName}" (${me.emailAddress ?? me.accountId})`);
  return true;
}

async function main(): Promise<void> {
  const results = await Promise.all([verifyTestRail(), verifyJira()]);
  const allOk = results.every(Boolean);

  console.log(`\n${allOk ? 'All integrations OK.' : 'One or more integrations FAILED.'}`);
  process.exitCode = allOk ? 0 : 1;
}

main();
