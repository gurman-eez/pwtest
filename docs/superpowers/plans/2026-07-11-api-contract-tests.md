# API Contract Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `tests/api/` suite (account, products, login) that exercises `api/api-client.ts` directly, independent of the existing UI specs.

**Architecture:** Three new spec files under `tests/api/`, each using the existing `apiClient` fixture from `fixtures/base.ts` (an isolated `APIRequestContext`, no browser cookies) and `assertResponseCode()` for every response check. No production code changes — `api/api-client.ts` and `fixtures/base.ts` are used as-is.

**Tech Stack:** Playwright Test (`@playwright/test` ^1.61.1), TypeScript (strict), existing fixtures.

## Global Constraints

- Naming note: the original request refers to "getAccountDetailByEmail", but `api/api-client.ts` exports this call as `getUserDetailByEmail` — there is only one such method on `ApiClient`. All tasks below use the real name, `getUserDetailByEmail`.
- Never assert on HTTP status (`response.status()`); the API always answers HTTP 200 — always assert on the JSON body's `responseCode` via `assertResponseCode()` from `api/api-client.ts`.
- Do not modify `api/api-client.ts`, `fixtures/base.ts`, `utils/test-data.ts`, or any file under `tests/` (existing specs), `pages/` — this plan only adds new files under `tests/api/`.
- Every test must run with only the `apiClient` fixture (and `testAccount` where noted) — never the `page` fixture. No browser cookies.
- Every account a test creates directly (not via the `testAccount` fixture) must be deleted by that spec file's own cleanup — never rely solely on `testAccount`'s teardown for ad-hoc accounts.
- Every non-obvious/undocumented API behavior found during implementation must be recorded as an inline comment at the assertion it backs, in the same style as `tests/login-signup.spec.ts` (`// Quirk verified live: ...`).

### Real API behavior verified live during planning (2026-07-11, against https://automationexercise.com)

These were captured with `curl` and a throwaway Playwright `request` probe before writing any test, so every assertion below is fact, not assumption:

| Call | responseCode | message / shape |
|---|---|---|
| `createAccount` valid | 201 | `"User created!"` (body is exactly `{responseCode, message}`, no `user` object) |
| `createAccount` duplicate email | 400 | `"Email already exists!"` |
| `createAccount` missing `name` field | 400 | `"Bad request, name parameter is missing in POST request."` |
| `getUserDetailByEmail` existing | 200 | `user` object with `name, email, title, birth_day, birth_month, birth_year, first_name, last_name, company, address1, address2, country, state, city, zipcode` — **no `mobile_number`**, even though `createAccount` accepted and stored one |
| `getUserDetailByEmail` unknown email | 404 | `"Account not found with this email, try another email!"` |
| `updateAccount` valid | 200 (not 201) | `"User updated!"`; fields are actually persisted (confirmed via follow-up `getUserDetailByEmail`) |
| `deleteAccount` valid | 200 | `"Account deleted!"` |
| `deleteAccount` on already-deleted account | 404 | `"Account not found!"` (different wording than `getUserDetailByEmail`'s 404 message) |
| `getProductsList` | 200 | `products: [{id, name, price: "Rs. N", brand, category: {usertype: {usertype}, category}}, ...]` |
| `searchProduct('top')` | 200 | non-empty `products`, 14 results; matching is name-OR-category, not name-only — e.g. id 18 "Little Girls Mr. Panda Shirt" matches via category "Tops & Shirts", not its name (found by the Task 2 implementer subagent; corrected mid-execution, my original probe's 800-char truncated output masked this) |
| `searchProduct('zzzz...nonexistent')` | 200 | `products: []` — empty, not an error |
| `searchProduct('')` (empty value, key present) | 200 | full, unfiltered product list (same as `getProductsList`) |
| `searchProduct` with `search_product` key fully absent | 400 | `"Bad request, search_product parameter is missing in POST request."` |
| `verifyLogin` valid | 200 | `"User exists!"` |
| `verifyLogin` wrong password | 404 | `"User not found!"` — **identical** to unknown email, API doesn't distinguish |
| `verifyLogin` unknown email | 404 | `"User not found!"` |
| `verifyLogin` with `password` key present but empty | 404 | `"User not found!"` (not a 400) |
| `verifyLogin` with `password` key fully absent | 400 | `"Bad request, email or password parameter is missing in POST request."` |

**Key mechanism fact** (confirmed with a throwaway probe script run via `node` against `@playwright/test`'s `request` module, then deleted): when a `form` object passed to `APIRequestContext.fetch()` has a key with value `undefined`, Playwright omits that key from the request body entirely — it does **not** send the literal string `"undefined"`. This means `apiClient.searchProduct(undefined as unknown as string)` and `apiClient.verifyLogin(email, undefined as unknown as string)` faithfully reproduce a truly-absent POST field (the same request shape as omitting `-d` for that field in curl), which is different from passing `''`. This is what makes the "missing field" tests below possible through the existing typed `ApiClient` methods without modifying `api-client.ts`.

## File Structure

- Create: `tests/api/account.spec.ts` — createAccount, getUserDetailByEmail, updateAccount, deleteAccount
- Create: `tests/api/products.spec.ts` — getProductsList, searchProduct
- Create: `tests/api/login.spec.ts` — verifyLogin

`playwright.config.ts` has `testDir: './tests'` with no glob restriction, so Playwright picks up `tests/api/**/*.spec.ts` automatically — no config change needed (verified as part of Task 1).

---

### Task 1: `tests/api/account.spec.ts`

**Files:**
- Create: `tests/api/account.spec.ts`

**Interfaces:**
- Consumes: `test`, `expect` from `../../fixtures/base`; `AccountData`, `assertResponseCode` from `../../api/api-client`; `buildRandomAccount` from `../../utils/test-data`; `randomUUID` from `node:crypto`.
- Produces: nothing consumed by later tasks (each spec file is independent).

- [ ] **Step 1: Write the spec file**

```typescript
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
    // every other field changes, proving the update actually took effect.
    const updated = buildRandomAccount({ email: account.email, password: account.password });
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
```

- [ ] **Step 2: Run the spec against the live API**

Run: `npx playwright test tests/api/account.spec.ts --reporter=list`
Expected: 7 passed, 0 failed.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tests/api/account.spec.ts
git commit -m "test: add account API contract tests"
```

---

### Task 2: `tests/api/products.spec.ts`

**Files:**
- Create: `tests/api/products.spec.ts`

**Interfaces:**
- Consumes: `test`, `expect` from `../../fixtures/base`; `assertResponseCode` from `../../api/api-client`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the spec file**

```typescript
import { test, expect } from '../../fixtures/base';
import { assertResponseCode } from '../../api/api-client';

/**
 * Contract tests for the read-only product endpoints (productsList, searchProduct). Pure
 * API — only the `apiClient` fixture is used, no browser/cookies.
 */
test.describe('Products API', () => {
  test('getProductsList returns a non-empty list with the expected product shape', async ({ apiClient }) => {
    const response = await apiClient.getProductsList();

    assertResponseCode(response, 200);
    const products = response.products as Array<Record<string, unknown>>;
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const [first] = products;
    expect(first).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.stringMatching(/^Rs\. \d+$/),
      brand: expect.any(String),
      category: {
        usertype: { usertype: expect.any(String) },
        category: expect.any(String),
      },
    });
  });

  test('searchProduct with a valid keyword returns matching products', async ({ apiClient }) => {
    const response = await apiClient.searchProduct('top');

    assertResponseCode(response, 200);
    const products = response.products as Array<{ name: string; category: { category: string } }>;
    expect(products.length).toBeGreaterThan(0);
    // Quirk verified live: the match isn't name-only. E.g. "Little Girls Mr. Panda Shirt"
    // (id 18, category "Tops & Shirts") is returned for the keyword "top" even though "top"
    // never appears in its name — matching also considers the category text. The honest
    // assertion checks name OR category, not name alone.
    for (const product of products) {
      const haystack = `${product.name} ${product.category.category}`.toLowerCase();
      expect(haystack).toContain('top');
    }
  });

  test('searchProduct with a keyword matching no product returns an empty list, not an error', async ({
    apiClient,
  }) => {
    const response = await apiClient.searchProduct('zzzznonexistentproductxyz123');

    // Verified live: a no-match search is still responseCode 200 with products: [] — this
    // endpoint only ever 400s for a malformed request, never for "nothing found".
    assertResponseCode(response, 200);
    expect(response.products).toEqual([]);
  });

  test('searchProduct without the search_product parameter returns 400', async ({ apiClient }) => {
    // Verified live with a standalone probe against Playwright's request context: passing
    // `undefined` here makes the `form` option omit the key entirely (not send the literal
    // string "undefined"), reproducing a genuinely missing POST field. Separately confirmed
    // that a *present but empty* search_product (search_product=) instead returns 200 with
    // the full, unfiltered product list — so "omitted" and "empty" are different, and both
    // are legitimate but distinct behaviors worth knowing apart.
    const response = await apiClient.searchProduct(undefined as unknown as string);

    assertResponseCode(response, 400);
    expect(response.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});
```

- [ ] **Step 2: Run the spec against the live API**

Run: `npx playwright test tests/api/products.spec.ts --reporter=list`
Expected: 4 passed, 0 failed.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tests/api/products.spec.ts
git commit -m "test: add products API contract tests"
```

---

### Task 3: `tests/api/login.spec.ts`

**Files:**
- Create: `tests/api/login.spec.ts`

**Interfaces:**
- Consumes: `test`, `expect` from `../../fixtures/base` (including the `testAccount` fixture); `assertResponseCode` from `../../api/api-client`; `randomUUID` from `node:crypto`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the spec file**

```typescript
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
```

- [ ] **Step 2: Run the spec against the live API**

Run: `npx playwright test tests/api/login.spec.ts --reporter=list`
Expected: 4 passed, 0 failed.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tests/api/login.spec.ts
git commit -m "test: add login API contract tests"
```

---

### Task 4: Full-suite double run against the live API

**Files:** none (verification only).

- [ ] **Step 1: Confirm Playwright picks up the new directory alongside existing specs**

Run: `npx playwright test --list`
Expected: output includes all tests from `tests/checkout.spec.ts`, `tests/login-signup.spec.ts`, `tests/api/account.spec.ts`, `tests/api/products.spec.ts`, `tests/api/login.spec.ts`.

- [ ] **Step 2: First full run**

Run: `npx playwright test tests/api --reporter=list`
Expected: 15 passed, 0 failed (7 account + 4 products + 4 login).
If anything fails: re-verify the live behavior for that case with `curl` (or a throwaway probe script deleted immediately after, as used during planning), fix the assertion or add a new documented quirk comment, do not silently retry.

- [ ] **Step 3: Second full run (independent, to rule out state leakage or flakiness)**

Run: `npx playwright test tests/api --reporter=list`
Expected: 15 passed, 0 failed again. This specifically checks that Task 1's `createdAccounts` cleanup and the dedicated `deleteAccount` test don't leave any account behind that would make a later run's "duplicate email" or "existing email" tests behave differently.

- [ ] **Step 4: Sanity-check the untouched UI suite still passes**

Run: `npx playwright test tests/checkout.spec.ts tests/login-signup.spec.ts --reporter=list`
Expected: same pass/fail state as on `main` before this branch (no regression) — confirms the new `tests/api/` files don't interfere with existing specs.

- [ ] **Step 5: Final commit if Step 2 uncovered any fixes**

```bash
git add tests/api/
git commit -m "test: fix assertions after live re-verification"
```

(Skip this step if both live runs in Steps 2–3 passed clean on the first try with no changes needed.)
