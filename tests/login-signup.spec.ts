import { test, expect } from '../fixtures/base';
import { LoginSignupPage } from '../pages/login-signup.page';
import { buildRandomAccount } from '../utils/test-data';
import { AccountData } from '../api/api-client';

test.describe('Login & Signup', () => {
  // Only set when a test registers a brand-new account through the UI (not via
  // testAccount) — cleaned up here so ad-hoc accounts never linger on the site.
  let uiCreatedAccount: AccountData | undefined;

  test.afterEach(async ({ apiClient }) => {
    if (uiCreatedAccount) {
      await apiClient.deleteAccount(uiCreatedAccount.email, uiCreatedAccount.password);
      uiCreatedAccount = undefined;
    }
  });

  test('successful registration of a new user', {
    annotation: { type: 'testrail', description: 'C46' },
  }, async ({ page }) => {
    const account = buildRandomAccount();
    uiCreatedAccount = account;
    const loginSignupPage = new LoginSignupPage(page);

    await loginSignupPage.goto();
    await loginSignupPage.startSignup(account.name, account.email);
    await loginSignupPage.fillAccountInformation(account);
    await loginSignupPage.submitAccountCreation();

    await expect(loginSignupPage.accountCreatedHeading).toHaveText('Account Created!');

    await loginSignupPage.continueButton.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(loginSignupPage.loggedInAsText).toContainText(account.name);
  });
  // источник: флоу 02 исследования — "Account Created!" ведёт на / с автоматическим логином
  // ("Logged in as {Name}" в навбаре), без отдельного шага входа.

  test('registration with an already used email shows the existing-account error', {
    annotation: { type: 'testrail', description: 'C47' },
  }, async ({
    page,
    testAccount,
  }) => {
    const loginSignupPage = new LoginSignupPage(page);

    await loginSignupPage.goto();
    await loginSignupPage.startSignup('Someone Else', testAccount.email);

    await expect(loginSignupPage.signupErrorMessage).toHaveText('Email Address already exist!');
    // Quirk verified live: the URL actually becomes /signup, not /login — the mini-signup
    // form's action target re-renders the same Login/Signup template at that URL instead of
    // staying on /login, even though the error is shown inline without a full page reload feel.
    await expect(page).toHaveURL(/\/signup$/);
  });
  // источник: раздел "Валидация форм" исследования (текст ошибки) + верификация вживую через
  // Playwright MCP при отладке этого теста (URL-поведение).

  test('login with an account created via the API (no UI signup)', {
    annotation: { type: 'testrail', description: 'C48' },
  }, async ({
    page,
    testAccount,
  }) => {
    const loginSignupPage = new LoginSignupPage(page);

    await loginSignupPage.goto();
    await loginSignupPage.login(testAccount.email, testAccount.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginSignupPage.loggedInAsText).toContainText(testAccount.name);
  });
  // источник: карта API — POST /api/createAccount заменяет прохождение формы регистрации
  // для тестов, чьим фокусом является не сама регистрация, а последующий флоу.

  test('login with an existing email but wrong password shows an error', {
    annotation: { type: 'testrail', description: 'C49' },
  }, async ({
    page,
    testAccount,
  }) => {
    const loginSignupPage = new LoginSignupPage(page);

    await loginSignupPage.goto();
    await loginSignupPage.login(testAccount.email, 'WrongPassword123!');

    await expect(loginSignupPage.loginErrorMessage).toHaveText('DELIBERATE BREAK FOR PR #8 CI VERIFICATION');
    await expect(page).toHaveURL(/\/login$/);
  });
  // источник: флоу 03 исследования — сообщение подтверждено живым прохождением дословно.

  test('logout returns the navbar to guest state', {
    annotation: { type: 'testrail', description: 'C50' },
  }, async ({ page, testAccount }) => {
    const loginSignupPage = new LoginSignupPage(page);

    await loginSignupPage.goto();
    await loginSignupPage.login(testAccount.email, testAccount.password);
    await expect(loginSignupPage.loggedInAsText).toBeVisible();

    await loginSignupPage.logout();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginSignupPage.loginButton).toBeVisible();
    await expect(loginSignupPage.loggedInAsText).toHaveCount(0);
  });
  // источник: флоу 03 исследования — Logout ведёт на /logout и редиректит на /login,
  // навбар возвращается к состоянию гостя.
});
