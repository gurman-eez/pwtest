# CLAUDE.md

Playwright + TypeScript end-to-end suite for **automationexercise.com** (a public demo
e-commerce site used for test-automation practice), plus the TestRail/Jira/Slack reporting
pipeline built around it.

> **Provenance note:** this file did not exist before 2026-07-22 — `git log --all
> --full-history -- CLAUDE.md` returns nothing on any branch, ever. It was reconstructed from
> quirk comments in `pages/payment.page.ts` and `tests/*.spec.ts`,
> `docs/superpowers/plans/2026-07-11-api-contract-tests.md`, and PR #1–#9 descriptions
> (`gh pr view`). The underlying site-research findings ("флоу NN исследования" in comments —
> see below) were never captured in one canonical document either; they lived only in past
> session transcripts. **This file is now that durable record — update it when you confirm
> something new about the site or change an architectural decision, rather than letting it
> evaporate again.**

## Workflow: how coverage gets added

1. **Research before writing anything.** A feature is explored live (Playwright MCP or manual
   probing) to confirm exact URLs, button/error text, timing, and locator attributes —
   *before* a TestRail case or spec is written. Test comments cite this, e.g. `// источник:
   флоу 06 исследования — модалка #cartModal с текстом ...` or the English equivalent `//
   Quirk verified live: ...`. Never assert behavior that hasn't been confirmed this way.
2. **TestRail first.** New cases are created in TestRail (via `utils/testrail-client.ts`)
   before the Playwright spec. Cases follow the shape in "Locators" and "Known site
   constraints" below — see any case in suite 6/7 for the Preconditions/Steps/Expected Result
   structure.
3. **Spec annotated with the TestRail case id.** Every test that maps to a TestRail case
   carries `{ type: 'testrail', description: 'C<id>' }` (see `tests/login-signup.spec.ts`,
   `tests/checkout.spec.ts`) so CI can publish pass/fail back automatically (see CI/CD below).
4. **Quality-check the case before trusting it as coverage.** `scripts/eval-testcases.ts`
   (added in PR #9) uses Claude Haiku as an LLM judge to score a TestRail case on
   traceability / constraint_awareness / clarity / coverage_balance and flag `needs_revision`
   cases. Not wired into any automated workflow yet — run manually:
   ```
   node --experimental-strip-types scripts/eval-testcases.ts --suite <id>[,<id>...] [--verbose]
   ```
5. **Project slash command `/add-coverage <page>`** is the established name for this
   end-to-end workflow, and branches follow the convention `add-coverage/<page-name>` (e.g.
   `add-coverage/contact-us`). **Known gap:** the command's own definition file is not
   currently committed under `.claude/commands/` — recreate it there if you need its exact
   step-by-step text; this file only documents the constraints and conventions any such
   command should honor.

## Known site/environment constraints

These are hard facts about automationexercise.com's actual (not ideal) behavior. A test case
or assertion that contradicts one of these is invalid — it exercises behavior the site will
never show, or asserts a distinction the site can't make.

1. **Payment (`/payment`) accepts any card.** The card number field has no format check and no
   Luhn validation — confirmed live with a real-looking card number and with arbitrary digit
   strings, both accepted. There's no sandbox/test-card disclaimer anywhere on the page. **Do
   not write a "system rejects invalid card number" case** — it will never fail
   (`pages/payment.page.ts`).
2. **Wrong password and unknown email are indistinguishable**, at both the UI and API layer:
   - UI `/login`: both show the identical message `Your email or password is incorrect!`.
   - API `verifyLogin`: both return `404` with the identical body `"User not found!"`.
   A case that expects a different signal depending on which of these two caused the failure
   cannot be verified against the real site.
3. **Signup duplicate-email flow lands on `/signup`, not `/login`.** Submitting the mini-signup
   form on `/login` with an already-used email re-renders the Login/Signup template at the
   `/signup` URL, even though the error (`Email Address already exist!`) appears inline without
   a visible full-page reload. A case asserting the URL stays on `/login` here is wrong.
4. **The account API has several silent inconsistencies** (all confirmed live, see
   `docs/superpowers/plans/2026-07-11-api-contract-tests.md`):
   - `createAccount` on a duplicate email is `400` (not `409`).
   - `updateAccount` success is `200` (not `201`), but the update *is* persisted.
   - `getUserDetailByEmail` never returns `mobile_number`, even though `createAccount` accepts
     and stores one.
   - `deleteAccount` on an already-deleted account is `404` with `"Account not found!"` —
     different wording from `getUserDetailByEmail`'s 404 (`"Account not found with this email,
     try another email!"`). Don't assume the two 404 messages are interchangeable.
   - `searchProduct` matches on **category text as well as product name** — e.g. searching
     `"top"` returns items whose *category* is "Tops & Shirts" even if the name doesn't contain
     "top". Don't assume it's a name-only search.
   - A truly **absent** POST field behaves differently from a **present-but-empty** one (e.g.
     `verifyLogin` with `password` key absent → `400` "missing in POST request"; with `password`
     present but `''` → `404` "User not found!"). In Playwright, `form: { password: undefined }`
     drops the key entirely (matches "absent"); `form: { password: '' }` sends it (matches
     "empty"). Pick deliberately.
5. **The API always answers HTTP `200`.** The real outcome is in the JSON body's
   `responseCode` (200/201 success, 400 missing param, 404 not found). Never branch on
   `response.status()` — always use `assertResponseCode()` from `api/api-client.ts`.

## Architecture

- **`fixtures/base.ts`** — custom Playwright fixtures:
  - `apiClient`: isolated `APIRequestContext` (no browser cookies) wrapping `ApiClient`.
  - `testAccount`: an account created via `POST /api/createAccount` before the test and deleted
    via `DELETE /api/deleteAccount` after — use this instead of driving the UI signup form when
    a test's focus isn't registration itself.
  - `page` auto-accepts native dialogs (`dialog.accept()`) — the Contact Us form's Submit
    button calls `confirm("Press OK to proceed!")`; without this listener Playwright leaves the
    dialog open and the action hangs forever.
- **`api/api-client.ts`** — thin wrapper around the 14 documented endpoints at
  `/api_list`. Constructs form bodies, never inspects HTTP status (see constraint #5 above).
- **`utils/test-data.ts`** — `buildRandomAccount()` generates a unique throwaway account
  (UUID-suffixed name/email/password) for setup via `ApiClient.createAccount`.
- **`pages/*.page.ts`** — Page Objects exist only for **Login/Signup** and **Payment** so far
  (see "Locators" below for why). Cart/Checkout/Product pages are driven directly with
  role/text locators in the spec (`tests/checkout.spec.ts`) — no Page Object yet, planned as a
  separate pass once their locators are confirmed live.
- **`utils/testrail-client.ts`** / **`utils/jira-client.ts`** — thin REST wrappers (TestRail v2
  API, Jira Cloud v3 API). Every method **logs and swallows failures, returning `null`** rather
  than throwing, so a broken TestRail/Jira call can never crash a test run or reporting script.
  `JiraClient.textToAdf()` renders bug descriptions as real ADF (bare URLs become link marks,
  ` ``` `-fenced text becomes a monospaced `codeBlock`).
- **`scripts/`** — `publish-testrail-results.ts` (CI reporting, see below),
  `verify-integrations.ts` (connectivity smoke check), `eval-testcases.ts` (LLM-judge case
  quality, PR #9).

## Locators

- **`data-qa` attributes are the primary, most stable strategy** — but only *confirmed*
  present on three forms: the Login form, the "New User Signup!" mini-form (both on
  `/login`), and the Payment form (`/payment`). Use them directly there
  (`pages/login-signup.page.ts`, `pages/payment.page.ts`).
- **Account Information step (`/signup`)** only has confirmed `id` attributes — `data-qa` is
  present on some fields (e.g. `first_name`) but wasn't exhaustively verified live, so `id`
  locators are used there instead.
- **Everywhere else** (confirmation headings, Continue/Logout/Delete Account links, the entire
  Cart/Checkout/Product flow) has no confirmed stable attribute — use role/text locators
  (`page.getByRole(...)`, `page.getByText(...)`). **Don't guess an unconfirmed `data-qa`
  value** — an unverified guess is worse than an honest role/text locator.
- Example of a locator trap already hit: `Proceed To Checkout` renders as `<a class="btn
  btn-default check_out">` with **no `href`**, so it never gets an accessible "link" role — a
  text locator is required there, `getByRole('link', ...)` will not find it.

## Test rules

- **Cite the source of every non-obvious assertion.** Inline comment at the exact assertion,
  either `// Quirk verified live: ...` or `// источник: <flow/section> исследования — ...`
  (both conventions are in active use) — state *where* the fact was confirmed, not just what
  the code does.
- **Never assert on API HTTP status** — always `assertResponseCode()` against the body's
  `responseCode` (constraint #5).
- **Clean up what you create.** Any account created directly (not through the `testAccount`
  fixture) must be deleted by that spec file's own `afterEach` — never rely on `testAccount`'s
  teardown for ad-hoc accounts (see `tests/login-signup.spec.ts`'s `uiCreatedAccount` pattern).
- **Retries are what make Jira filing safe.** `playwright.config.ts` sets `retries:
  process.env.CI ? 1 : 0` — local runs fail fast with no retry; CI retries once so
  `scripts/publish-testrail-results.ts` can tell a **stable failure** (`'unexpected'`: failed
  initial attempt *and* the retry) from a **flake** (`'flaky'`: passed on retry). Only a stable
  failure gets a Jira bug filed; a flaky one counts as a pass for TestRail purposes.
- **No Page Object for a screen until its locators are confirmed live** — see "Locators".
- **Don't write a case that violates a known constraint above** — `scripts/eval-testcases.ts`
  now scores exactly this as `constraint_awareness`.

## CI/CD (`.github/workflows/e2e.yml`)

- **Triggers**: `pull_request` into `main`, daily `schedule` (`06:00 UTC`, a smoke test against
  the live site), and manual `workflow_dispatch`.
- **Three jobs**: `api-tests` (no `needs`, runs first, skips `playwright install` entirely —
  pure HTTP contract tests, never launches a browser) and `login-signup` / `checkout` (both
  `needs: api-tests`, so they only start after it succeeds — added in PR #6 specifically so a
  broken API layer blocks UI runs that would fail for the same underlying reason anyway).
- **`set -o pipefail` is mandatory** before every `npx playwright test ... | tee
  playwright-output.log` step. GitHub Actions' default shell here is `bash -e` with **no**
  `pipefail` — without it, a pipeline's exit code is `tee`'s (always `0`, since it can always
  write the log), so a real test failure would be silently masked as job success. This was a
  real, previously-shipped bug (PR #4) — confirmed via a CI run where 21/21 tests failed in the
  logs but the job still reported green.
- **Three shared composite actions** (`.github/actions/`), each job calls all three with
  job-specific inputs:
  - **`publish-html-report`** — pushes the HTML report to the `gh-pages` branch under
    `runs/<job-name>/<run-id>/` via plain `git clone`/commit/push (not `upload-pages-artifact`,
    which models one whole-site deploy — wrong for 3 independent jobs each adding their own
    subdirectory). Prunes to the newest 20 run-dirs per job; retries with a fresh clone on push
    races between concurrently-publishing jobs. Reports are live at
    `https://gurman-eez.github.io/pwtest/runs/<job-name>/<run-id>/`.
  - **`report-to-slack`** — parses the captured `list`-reporter stdout for pass/fail counts and
    failed test titles, posts one Slack message per job (distinct `label` per job so they're
    distinguishable in the same channel), links the HTML report URL above. Runs with
    `continue-on-error: true` so a webhook hiccup never fails the job.
  - **`publish-to-testrail`** — parses the `json` reporter's TestRail case-id annotations,
    creates a TestRail run scoped to exactly those cases, publishes pass/fail
    (`scripts/publish-testrail-results.ts`), then — reusing the same parsed report, no second
    read — files a Jira bug for every **stably**-failing test (see "Test rules" above).
    Dedup: searches Jira (`/rest/api/3/search/jql` — the older `/rest/api/3/search` is retired,
    410 Gone) for an existing open issue with the same TestRail-`refs` label (or summary text
    if no label) created in the last 7 days before filing a new one.
  - `api-tests`' TestRail/Jira step exists in the workflow but is `if: false`
    (`TODO(testrail-api-coverage)`) — `tests/api/*.spec.ts` don't carry TestRail annotations
    yet, so enabling it now would just create empty TestRail runs.
- **Jira issue type is project-specific, not a fixed enum** — this project's "Bug" type is
  literally named `"Баг"` (`JiraIssueType = string`, verify via `GET
  /rest/api/3/issue/createmeta` rather than assuming `"Bug"` works).
- **Required secrets**: `TESTRAIL_URL`, `TESTRAIL_EMAIL`, `TESTRAIL_API_KEY`, `JIRA_URL`,
  `JIRA_EMAIL`, `JIRA_API_TOKEN`, `SLACK_WEBHOOK_URL`.
  **Required vars**: `TESTRAIL_PROJECT_ID`, `TESTRAIL_SUITE_LOGIN_ID`,
  `TESTRAIL_SUITE_PAYMENT_ID`, `JIRA_PROJECT_KEY`, `JIRA_BUG_TYPE` (plus the still-unset
  `TESTRAIL_SUITE_API_ID` referenced by the disabled `api-tests` reporting step).
- **`slackapi/slack-github-action` is pinned to an exact commit SHA**, not the mutable `@v3`
  tag — per an automated security review flag (PR #1).

## Known issues / gotchas

- **`tsc --noEmit` is currently broken on `main`** (as of 2026-07-22): TypeScript 7 removed
  `moduleResolution: "node10"` and `baseUrl`, both still present in `tsconfig.json`. A fix
  exists on the local branch `add-coverage/contact-us` (commit `5ae62ed`) but as of this
  writing that branch has not been pushed or opened as a PR — check whether it's landed before
  assuming `tsc --noEmit` works cleanly on `main`. In the meantime, typecheck a specific file
  standalone: `tsc --noEmit --ignoreConfig <compiler flags matching tsconfig's intent>
  path/to/file.ts` (bypasses the broken `tsconfig.json` instead of fixing it out of scope).
- **Scripts run via `node --experimental-strip-types scripts/*.ts`** directly — no build step,
  no `ts-node`/`tsx` dependency. This prints a Node `ExperimentalWarning` and a
  `MODULE_TYPELESS_PACKAGE_JSON` warning on every invocation (package.json has no `"type"`
  field) — harmless noise, not a bug; don't "fix" it by adding `"type": "module"` without
  checking it doesn't break the `commonjs`-targeted `tsconfig.json`.
- **automationexercise.com itself is occasionally flaky in CI** — a redirect-loop on
  `/api/createAccount`, and a full-site "Max redirect count exceeded" outage that cleared
  within minutes (both observed and documented while verifying PR #8). Trust a failure that's
  stable across the initial attempt *and* the CI retry; a single-attempt failure that clears on
  the next run often isn't a real regression.
