import { randomUUID } from 'node:crypto';
import { test, expect } from '../../fixtures/base';
import { AccountData, assertResponseCode } from '../../api/api-client';
import { buildRandomAccount } from '../../utils/test-data';

/**
 * Contract tests for the account-lifecycle endpoints (createAccount, getUserDetailByEmail,
 * updateAccount, deleteAccount). Pure API — only the `apiClient` fixture is used, never
 * `page`, so nothing here touches a browser or cookies.
 *
 * IMPORTANT: this API always answers HTTP 200 regardless of outcome — the real result is
 * the JSON body's `responseCode`. Every assertion below (codes, messages, field shapes) was
 * verified live against https://automationexercise.com before being written; see
 * docs/superpowers/plans/2026-07-11-api-contract-tests.md for the raw probe results.
 */
test.describe('Account API', () => {
  // Accounts created directly in a test body (not via the testAccount fixture) are tracked
  // here and swept up afterward — same pattern as tests/login-signup.spec.ts's
  // uiCreatedAccount, generalized to an array since some tests create more than one account.
  let createdAccounts: AccountData[] = [];

  test.afterEach(async ({ apiClient }) => {
    for (const account of createdAccounts) {
      await apiClient.deleteAccount(account.email, account.password);
    }
    createdAccounts = [];
  });

  test('createAccount with valid data returns 201 and the expected response shape', async ({ apiClient }) => {
    const account = buildRandomAccount();

    const response = await apiClient.createAccount(account);
    createdAccounts.push(account);

    assertResponseCode(response, 201);
    expect(response.message).toBe('User created!');
    // Verified live: a successful create's body is exactly {responseCode, message} — no
    // user object or id comes back from this endpoint.
    expect(Object.keys(response).sort()).toEqual(['message', 'responseCode']);
  });

  test('createAccount with an already-used email returns 400', async ({ apiClient }) => {
    const account = buildRandomAccount();
    assertResponseCode(await apiClient.createAccount(account), 201);
    createdAccounts.push(account);

    const duplicate = buildRandomAccount({ email: account.email });
    const response = await apiClient.createAccount(duplicate);

    // Verified live: a duplicate email is 400, not a 409-style conflict code.
    assertResponseCode(response, 400);
    expect(response.message).toBe('Email already exists!');
  });

  test('createAccount with a missing required field returns 400 naming that field', async ({ apiClient }) => {
    const { name, ...accountWithoutName } = buildRandomAccount();

    // Confirmed live during planning: Playwright's `form` option drops keys whose value is
    // undefined instead of sending the literal string "undefined", so this reproduces a
    // genuinely absent POST field — the same request shape curl sends when the key itself
    // is omitted. No account is created, so there's nothing to clean up.
    const response = await apiClient.createAccount(accountWithoutName as AccountData);

    assertResponseCode(response, 400);
    expect(response.message).toBe('Bad request, name parameter is missing in POST request.');
  });

  test('getUserDetailByEmail returns the account for an existing email', async ({ apiClient }) => {
    const account = buildRandomAccount();
    assertResponseCode(await apiClient.createAccount(account), 201);
    createdAccounts.push(account);

    const response = await apiClient.getUserDetailByEmail(account.email);

    assertResponseCode(response, 200);
    const user = response.user as Record<string, unknown>;
    expect(user).toMatchObject({
      name: account.name,
      email: account.email,
      title: account.title,
      birth_day: account.birthDate,
      birth_month: account.birthMonth,
      birth_year: account.birthYear,
      first_name: account.firstName,
      last_name: account.lastName,
      company: account.company,
      address1: account.address1,
      country: account.country,
      state: account.state,
      city: account.city,
      zipcode: account.zipcode,
    });
    // Quirk verified live: mobile_number is accepted and stored by createAccount but never
    // comes back from getUserDetailByEmail — the key is simply absent from `user`.
    expect(user).not.toHaveProperty('mobile_number');
  });

  test('getUserDetailByEmail returns 404 for an email that was never registered', async ({ apiClient }) => {
    const response = await apiClient.getUserDetailByEmail(`nonexistent-${randomUUID()}@mailtest.com`);

    assertResponseCode(response, 404);
    expect(response.message).toBe('Account not found with this email, try another email!');
  });

  test('updateAccount persists changes, verified via a follow-up getUserDetailByEmail', async ({ apiClient }) => {
    const account = buildRandomAccount();
    assertResponseCode(await apiClient.createAccount(account), 201);
    createdAccounts.push(account);

    // Same email/password as the original so cleanup and the follow-up lookup still work;
    // distinct literal overrides for all asserted fields prove the server actually persisted them.
    const updated = buildRandomAccount({
      email: account.email,
      password: account.password,
      firstName: 'UpdatedFirstName',
      address1: '123 New Street',
      city: 'Boston',
      state: 'MA',
      zipcode: '02101',
      country: 'Canada',
    });
    const updateResponse = await apiClient.updateAccount(updated);

    // Verified live: a successful update is 200, not 201 — no new resource is created.
    assertResponseCode(updateResponse, 200);
    expect(updateResponse.message).toBe('User updated!');

    const lookup = await apiClient.getUserDetailByEmail(account.email);
    assertResponseCode(lookup, 200);
    const user = lookup.user as Record<string, unknown>;
    expect(user).toMatchObject({
      name: updated.name,
      first_name: updated.firstName,
      last_name: updated.lastName,
      address1: updated.address1,
      city: updated.city,
      state: updated.state,
      zipcode: updated.zipcode,
      country: updated.country,
    });
  });

  test('deleteAccount removes the account so a later lookup 404s', async ({ apiClient }) => {
    const account = buildRandomAccount();
    assertResponseCode(await apiClient.createAccount(account), 201);
    // Deliberately not pushed to createdAccounts: this test deletes the account itself and
    // asserts the deletion, so the afterEach sweep has nothing left to do for it.

    const deleteResponse = await apiClient.deleteAccount(account.email, account.password);
    assertResponseCode(deleteResponse, 200);
    expect(deleteResponse.message).toBe('Account deleted!');

    const lookup = await apiClient.getUserDetailByEmail(account.email);
    assertResponseCode(lookup, 404);
    expect(lookup.message).toBe('Account not found with this email, try another email!');
  });
});
