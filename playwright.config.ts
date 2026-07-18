import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Local runs: fail fast, no flake-masking retries. Bump this in CI config if needed later.
  retries: 0,
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
