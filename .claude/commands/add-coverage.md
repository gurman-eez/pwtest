---
description: End-to-end workflow for adding TestRail + Playwright coverage for one page — research first, TestRail case before spec, quality-checked before it's trusted as coverage.
argument-hint: <page-name>
---

> **Reconstruction note:** no version of this file has ever been committed to this repo (`git
> log --all --full-history -- .claude/commands/add-coverage.md` returns nothing, on any
> branch). CLAUDE.md's "Workflow: how coverage gets added" section documents this command's
> existence and the conventions it must honor, but not its own text — that was lost the same
> way CLAUDE.md itself once was. This file is reconstructed from that section; if you change
> the workflow here, update CLAUDE.md's "Workflow" section to match, and vice versa, so they
> can't drift apart again.

Adds TestRail + Playwright coverage for the page named in `$ARGUMENTS`. Branch for this work
follows the convention `add-coverage/<page-name>` (e.g. `add-coverage/contact-us`).

## Этап 1 — Discovery

**Before anything else, including any other action in this stage:** check whether `CLAUDE.md`
exists in the repository's working tree (not just referenced somewhere — the actual file at
the repo root). If it does not exist, **stop the command entirely** — do not proceed to any
later step in this stage or any later stage — and tell the user exactly this:

> CLAUDE.md отсутствует в репозитории — команда остановлена, чтобы не работать без
> задокументированных ограничений и конвенций проекта. Восстанови CLAUDE.md перед повторным
> запуском.

Do not attempt to generate CLAUDE.md automatically as a way to unblock this command — recreating
it is a separate, deliberate task (see CLAUDE.md's own provenance note on how it was
reconstructed once already), not something that should happen as a side effect of running
`/add-coverage`. A CLAUDE.md written in a hurry just to satisfy this check would document
nothing real and would be worse than no file at all.

Once CLAUDE.md is confirmed present, proceed with research: explore the target page live
(Playwright MCP or manual probing) to confirm exact URLs, button/error text, timing, and
locator attributes — before writing a single TestRail case or spec line. Never assert behavior
that hasn't been confirmed this way; never guess an unconfirmed `data-qa` value (see CLAUDE.md
"Locators"). Cite what you confirm the way the rest of this codebase does, e.g. `// источник:
флоу NN исследования — ...` or `// Quirk verified live: ...`, so the next person (or the next
run of this command) can trust it without re-deriving it.

Cross-check anything you find against CLAUDE.md's "Known site/environment constraints" —
don't plan a case that would contradict one of them.

## Этап 2 — TestRail case creation

Create the new cases in TestRail via `utils/testrail-client.ts`, before writing the Playwright
spec. Follow the Preconditions/Steps/Expected Result shape already used in suite 6/7 (see any
existing case there for the pattern) — concrete, checkable expected results, not vague ones.
Give each case a `refs` value following the `<SECTION>-NN-<SLUG>` convention already in use
(e.g. `LOGIN-01-REGISTER-SUCCESS`), and set Priority to one of High/Medium/Low.

## Этап 3 — Spec implementation

Write the Playwright spec for the page, using the locator strategy CLAUDE.md's "Locators"
section prescribes for it (`data-qa` where confirmed, role/text elsewhere, `id` for the
Account Information step). Annotate every test that maps to a TestRail case with `{ type:
'testrail', description: 'C<id>' }` (see `tests/login-signup.spec.ts`, `tests/checkout.spec.ts`)
so CI can publish pass/fail back automatically. If the spec creates any account directly
(not via the `testAccount` fixture), clean it up in that spec file's own `afterEach`.

## Этап 4 — Quality-check

Before trusting the new cases as real coverage, score them with the LLM-judge pipeline:

```
node --experimental-strip-types scripts/eval-testcases.ts --suite <id>[,<id>...] [--verbose]
```

(If `.claude/commands/eval-calibrate.md`'s code-grader/weighted-score iteration has landed,
this also reports a deterministic `final_score` alongside the model's — trust that over the
model's raw `verdict` field.) Address anything flagged `needs_revision` — either fix the case
in TestRail and re-run, or record why the flag is a false positive — before moving on.

## Этап 5 — Wrap-up

Commit the spec, any Page Object changes, and (if touched) CLAUDE.md updates for anything
newly confirmed about the site. Push the `add-coverage/<page-name>` branch and open a PR.
