import { randomUUID } from 'node:crypto';
import { test, expect } from '../../fixtures/base';
import { assertResponseCode } from '../../api/api-client';

/**
 * Contract tests for POST /api/verifyLogin. Pure API — only the `apiClient` fixture (plus
 * `testAccount`, itself apiClient-backed) is used, no browser/cookies.
 */
test.describe('Login API', () => {
  test('verifyLogin with valid credentials of an existing user succeeds', async ({ apiClient, testAccount }) => {
    const response = await apiClient.verifyLogin(testAccount.email, testAccount.password);

    assertResponseCode(response, 200);
    expect(response.message).toBe('User exists!');
  });

  test('verifyLogin with the wrong password for an existing email returns 404', async ({
    apiClient,
    testAccount,
  }) => {
    const response = await apiClient.verifyLogin(testAccount.email, 'WrongPassword123!');

    // Quirk verified live: a wrong password gets the exact same responseCode and message as
    // a completely unknown email (next test) — verifyLogin never distinguishes "wrong
    // password" from "no such user", so callers can't tell the two apart from the response.
    assertResponseCode(response, 404);
    expect(response.message).toBe('User not found!');
  });

  test('verifyLogin with an email that was never registered returns 404', async ({ apiClient }) => {
    const response = await apiClient.verifyLogin(`nonexistent-${randomUUID()}@mailtest.com`, 'SomePassword123!');

    assertResponseCode(response, 404);
    expect(response.message).toBe('User not found!');
  });

  test('verifyLogin with a missing password field returns 400', async ({ apiClient, testAccount }) => {
    // Verified live with a standalone probe: passing `undefined` here makes the `form`
    // option omit the key entirely, reproducing a genuinely missing POST field (identical
    // to curl with no -d for password). A *present but empty* password instead returns 404
    // "User not found!" — same as a wrong password, not a 400 — so this only tests the
    // truly-absent case.
    const response = await apiClient.verifyLogin(testAccount.email, undefined as unknown as string);

    assertResponseCode(response, 400);
    expect(response.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });
});
