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

export const test = base.extend<Fixtures>({
  // automationexercise's Contact Us form calls confirm("Press OK to proceed!") on
  // submit; with no listener, Playwright leaves the dialog open and the action hangs.
  page: async ({ page }, use) => {
    page.on('dialog', (dialog) => dialog.accept());
    await use(page);
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
