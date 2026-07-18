import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Local runs: fail fast, no flake-masking retries. CI retries once so
  // scripts/publish-testrail-results.ts can tell a stable failure (failed status
  // "unexpected", still failing after the retry) from a flake ("flaky" status,
  // passed on retry) before filing a Jira bug.
  retries: process.env.CI ? 1 : 0,
  // json feeds scripts/publish-testrail-results.ts (via the publish-to-testrail composite
  // action) with each test's TestRail case-id annotation and pass/fail outcome.
  reporter: [['html', { open: 'never' }], ['list'], ['json', { outputFile: 'test-results/results.json' }]],

  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
