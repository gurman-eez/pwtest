---
description: Build/refresh the code-grader + weighted-score iteration of the TestRail case-quality eval pipeline, then run calibration against the known-verdict dataset.
argument-hint: "[anything — presence alone means 'skip setup, just run calibration']"
---

Second iteration of the LLM-judge case-quality pipeline (`scripts/eval-testcases.ts`,
`.claude/commands/eval-calibrate.md`), which so far only asks Claude Haiku to score a case —
no deterministic checks, and no way to know whether the rubric itself is any good. This
command adds a cheap, deterministic **code grader** alongside the model grader, combines them
into one weighted score, and gives you a fixed **calibration dataset** with known-correct
verdicts so a rubric-prompt change can be checked for regressions before trusting it on real
TestRail cases.

## Argument handling

`$ARGUMENTS` is checked for presence only, not parsed for a specific value.

- **Argument present (any value)** — skip straight to "Step 5: run calibration" below. Do not
  touch the code grader, the weighting, or `tests/eval/testcase-eval-dataset.json`. This is
  for the common case: you already ran the full setup once, tweaked the rubric prompt in
  `scripts/eval-testcases.ts`, and just want to see whether calibration accuracy moved.
- **No argument** — run the full cycle, Steps 1-5 below, in order.

## Step 1 — Code grader (skip if already present)

Check `scripts/eval-testcases.ts` for a `gradeCaseWithCode` function (or equivalent). If
missing, add a deterministic grader that runs with no API call and checks, per case:

1. Every required field (`title`, `priority`, `type`, `refs`, `preconditions`) is present and
   non-empty.
2. `refs` matches `<SECTION>-NN-<SLUG>` (e.g. `LOGIN-01-REGISTER-SUCCESS`) —
   `/^[A-Z]+-\d{2}-[A-Z0-9]+(?:-[A-Z0-9]+)*$/`.
3. `priority` is one of `High` / `Medium` / `Low`.
4. `steps` is a non-empty array.

Score it `(passed checks / total checks) * 5` — same 1-5 scale the model rubric already uses,
so the two combine cleanly in Step 2.

## Step 2 — Weighted final score (skip if already present)

Check for a combined score in the case result. If missing, add one:

```
model_score = average(traceability, constraint_awareness, clarity, coverage_balance)
final_score = code_score * 0.3 + model_score * 0.7
final_verdict = final_score >= 4 ? 'pass' : 'needs_revision'
```

`final_verdict` — not the model's own self-reported `verdict` field — is what should count as
the case's real outcome from here on: the `needs_revision` list in the normal report, and the
`expected_verdict` comparison in calibration mode (Step 5), both key off it. Keep the model's
raw `verdict` field visible in verbose/detail output for comparison, but don't let it drive any
decision.

## Step 3 — Calibration dataset (skip if already present, i.e. `tests/eval/testcase-eval-dataset.json` exists with ≥8 cases)

Build (or verify) `tests/eval/testcase-eval-dataset.json`: an array of 8-10 cases, each with an
added `expected_verdict: "pass" | "needs_revision"` field on top of the normal case shape
(`caseId`, `title`, `priority`, `type`, `refs`, `preconditions`, `steps`, `siblingTitles`).

- **3-4 real good cases**, sourced verbatim from TestRail (pull via `TestRailClient.getCases`
  from suites 6/7, or reuse ones already known-good from a prior real run) — `expected_verdict:
  "pass"`.
- **3-4 intentionally bad cases** — synthetic, not from TestRail — covering distinct failure
  modes so the dataset actually exercises both graders:
  - a case that violates a documented site constraint (see CLAUDE.md's "Known
    site/environment constraints", or the `KNOWN_CONSTRAINTS` list inline in
    `scripts/eval-testcases.ts` if CLAUDE.md is absent — see the guard added to
    `/add-coverage` for why that matters) — this should score low on `constraint_awareness`
    from the model, not from the code grader.
  - a case with a vague, non-checkable Expected Result (e.g. "works correctly") — should score
    low on `clarity` from the model despite passing every code-grader check.
  - a case with missing Preconditions and/or a malformed `refs` (not matching
    `<SECTION>-NN-<SLUG>`) — should fail the code grader directly, independent of what the
    model thinks of it.
  All `expected_verdict: "needs_revision"`.

Do not invent an `expected_verdict` you haven't reasoned through — each one should be
justifiable by a human reading the case against the rubric, independent of what the current
model happens to output. That independence is the entire point of a calibration set.

## Step 4 — `--calibrate` flag (skip if already present)

Check `scripts/eval-testcases.ts`'s CLI parsing for a `--calibrate` flag. If missing, add one
that:
- Ignores `--suite` / `--file` and loads `tests/eval/testcase-eval-dataset.json` instead.
- Runs both graders exactly as normal mode does.
- Prints, per case: `caseId`, `MATCH`/`MISMATCH`, `expected_verdict`, actual `final_verdict`,
  and the numeric `final_score`.
- Prints an overall accuracy line: `correct / total (X%)`.

## Step 5 — Run calibration and report

Run:
```
node --experimental-strip-types scripts/eval-testcases.ts --calibrate --verbose
```
(Requires `ANTHROPIC_API_KEY`, and TestRail env vars are not needed for `--calibrate` since it
reads the dataset file, not TestRail.)

Report to the user:
- The accuracy line, verbatim.
- Every `MISMATCH` case: its id, title, expected vs actual verdict, and — pulled from the
  `--verbose` detail output — which rubric dimension(s) or code-grader check drove the wrong
  call.

**If accuracy is low, do not edit the dataset to make the numbers look better.** The dataset's
`expected_verdict` values are the ground truth being calibrated against, not a free variable —
changing them to match whatever the model currently outputs defeats the entire purpose of
having a calibration set. Instead:
1. Look at the mismatched cases' reasoning/weaknesses in the `--verbose` output to find the
   specific rubric-prompt wording that's misleading the model (e.g. a constraint description
   that's ambiguous, a rubric dimension whose scoring guidance doesn't match how the model is
   actually interpreting it).
2. Propose a specific, minimal edit to the rubric prompt in `scripts/eval-testcases.ts`
   (`KNOWN_CONSTRAINTS` or the rubric section of `buildPrompt`) that should fix the mismatch.
3. Explicitly suggest re-running `/eval-calibrate <anything>` after the prompt edit, to compare
   the new accuracy against this run — the "Change Prompt & Repeat" cycle. Do not apply the
   prompt edit yourself without the user's go-ahead; propose it and wait.
