import { test as base, expect, request as apiRequest } from '@playwright/test';
import { ApiClient, AccountData, assertResponseCode } from '../api/api-client';
import { buildRandomAccount } from '../utils/test-data';

type Fixtures = {
  /** Standalone API context (no browser cookies) for setup/teardown calls. */
  apiClient: ApiClient;
  /**
   * Account created via POST /api/createAccount before the test and removed via
   * DELETE /api/deleteAccount after — use instead of driving the signup UI form
   * when a test's focus isn't registration itself.
   */
  testAccount: AccountData;
};

// Caps mirror lastErrorMessage()'s 2000-char truncation in publish-testrail-results.ts — an
// unbounded console-error flood on a broken page shouldn't blow up results.json or the
// classify-failure.ts prompt it eventually feeds.
const MAX_CAPTURED_ENTRIES = 20;
const MAX_ENTRY_TEXT_LENGTH = 500;

// Confirmed live 2026-07-29: both patterns fire on every automationexercise.com page load, pass
// or fail — neither is a per-test signal, so both are filtered out of consoleErrors capture.
const NOISY_CONSOLE_PATTERNS = [
  /^Mixed Content:/, // the site's own HTML embeds http:// (not https://) Google Fonts links
  /^Failed to load resource:/, // browser's generic resource-load log — duplicates the
  // (already first-party-filtered) requestfailed capture below, with no URL to filter on here
];

export const test = base.extend<Fixtures>({
  // automationexercise's Contact Us form calls confirm("Press OK to proceed!") on
  // submit; with no listener, Playwright leaves the dialog open and the action hangs.
  page: async ({ page }, use, testInfo) => {
    page.on('dialog', (dialog) => dialog.accept());

    const consoleErrors: { type: string; text: string }[] = [];
    const failedRequests: { url: string; method: string; failure: string }[] = [];

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      if (NOISY_CONSOLE_PATTERNS.some((p) => p.test(msg.text()))) return;
      if (consoleErrors.length >= MAX_CAPTURED_ENTRIES) return;
      consoleErrors.push({ type: msg.type(), text: msg.text().slice(0, MAX_ENTRY_TEXT_LENGTH) });
    });

    page.on('requestfailed', (request) => {
      const errorText = request.failure()?.errorText ?? '(unknown failure)';
      // net::ERR_ABORTED fires on ordinary navigation cancelling in-flight requests — noise,
      // not a real infrastructure signal.
      if (errorText === 'net::ERR_ABORTED') return;
      // Quirk verified live 2026-07-29: automationexercise.com embeds a Google AdSense script
      // that fails to resolve on every page load in this test environment, pass or fail — not
      // a per-test signal. Restrict to the site's own origin (same convention as the hardcoded
      // baseURL elsewhere in this file/playwright.config.ts) so third-party ad/font requests
      // never crowd out a real first-party failure.
      let isThirdParty: boolean;
      try {
        isThirdParty = new URL(request.url()).hostname !== 'automationexercise.com';
      } catch {
        isThirdParty = false;
      }
      if (isThirdParty) return;
      if (failedRequests.length >= MAX_CAPTURED_ENTRIES) return;
      failedRequests.push({ url: request.url(), method: request.method(), failure: errorText });
    });

    await use(page);

    // Only attach when something was actually captured — mirrors screenshot: 'only-on-failure'
    // in playwright.config.ts, keeping test-results/results.json unbloated for passing tests.
    if (consoleErrors.length === 0 && failedRequests.length === 0) return;
    await testInfo.attach('console-and-network', {
      body: JSON.stringify({ consoleErrors, failedRequests }),
      contentType: 'application/json',
    });
  },

  apiClient: async ({}, use) => {
    const context = await apiRequest.newContext({ baseURL: 'https://automationexercise.com' });
    await use(new ApiClient(context));
    await context.dispose();
  },

  testAccount: async ({ apiClient }, use) => {
    const account = buildRandomAccount();
    assertResponseCode(await apiClient.createAccount(account), 201);

    await use(account);

    await apiClient.deleteAccount(account.email, account.password);
  },
});

export { expect };
