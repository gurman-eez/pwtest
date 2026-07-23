/**
 * Evaluates TestRail test-case quality with a deterministic code grader plus Claude (Haiku)
 * as an LLM judge, combined into a single weighted score (code_score * 0.3 + model_score * 0.7).
 *
 * Talks directly to the Anthropic Messages API (fetch to api.anthropic.com/v1/messages) —
 * no Claude Code SDK/CLI involved. Requires ANTHROPIC_API_KEY in env.
 *
 * Usage:
 *   node --experimental-strip-types scripts/eval-testcases.ts --suite <id>[,<id>...] [--project <id>] [--verbose]
 *   node --experimental-strip-types scripts/eval-testcases.ts --file <path-to-cases.json> [--verbose]
 *   node --experimental-strip-types scripts/eval-testcases.ts --calibrate [--verbose]
 *
 * Suite mode additionally requires TESTRAIL_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY in env,
 * and TESTRAIL_PROJECT_ID unless --project is passed.
 *
 * File mode expects a JSON array of objects shaped like RawFileCase below — useful for
 * evaluating cases that aren't (yet) in TestRail.
 *
 * --calibrate ignores --suite/--file and runs against the fixed calibration dataset at
 * tests/eval/testcase-eval-dataset.json, comparing each case's final_verdict against its
 * known expected_verdict and printing per-case matches plus overall accuracy. Use this to
 * check a rubric-prompt change didn't regress known-good/known-bad judgments before trusting
 * it on real TestRail cases — see .claude/commands/eval-calibrate.md.
 *
 * --verbose prints full strengths/weaknesses/reasoning/scores for every case, not only the
 * ones flagged needs_revision — meant for sanity-checking the rubric itself, not routine use.
 */
import { readFileSync } from 'node:fs';
import { TestRailClient, type TestRailCase } from '../utils/testrail-client.ts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_ATTEMPTS_PER_CASE = 5;

/**
 * Known site/environment limitations. This repo has no CLAUDE.md — these were compiled from
 * documented quirks in tests/*.spec.ts and pages/*.page.ts (see PR description for sources).
 * Kept inline, not in a separate file, so the rubric and the constraint list can't drift apart.
 */
const KNOWN_CONSTRAINTS = [
  'Payment (/payment): the card number field has no format check and no Luhn validation — confirmed live with a real-looking card number and with arbitrary digit strings, both accepted. There is also no sandbox/test-card disclaimer anywhere on the page. A negative test case asserting an invalid/malformed card number is rejected is invalid: it exercises behavior the site will never exhibit (see pages/payment.page.ts).',
  'Login (UI /login and API verifyLogin): a wrong password and a completely unknown email produce an IDENTICAL signal — the UI shows the same "Your email or password is incorrect!" message, and the API returns the same 404 "User not found!" body for both. A case that expects a distinct error message or code depending on which of these two causes triggered it cannot be verified against the real site.',
  'Signup duplicate-email flow: submitting the mini-signup form on /login with an already-used email re-renders the Login/Signup template at the /signup URL (not /login), even though the error appears inline without a visible full-page reload. A case asserting the URL stays on /login after this submission describes behavior the site does not have.',
] as const;

interface EvalStepDetail {
  content: string;
  expected: string;
}

interface EvalCase {
  caseId: string;
  title: string;
  priority: string;
  type: string;
  refs: string;
  preconditions: string;
  steps: EvalStepDetail[];
  flatStepsText?: string;
  flatExpectedText?: string;
  siblingTitles: string[];
  /** Only set in --calibrate mode: the known-correct verdict this case's dataset entry asserts. */
  expectedVerdict?: 'pass' | 'needs_revision';
}

interface Evaluation {
  case_id: string;
  strengths: string[];
  weaknesses: string[];
  reasoning: string;
  scores: {
    traceability: number;
    constraint_awareness: number;
    clarity: number;
    coverage_balance: number;
  };
  verdict: 'pass' | 'needs_revision';
}

interface CodeGrade {
  checks: Array<{ name: string; pass: boolean; detail?: string }>;
  /** (passed checks / total checks) * 5 — same 1-5 scale as the model's rubric dimensions. */
  score: number;
}

type CaseResult =
  | { evalCase: EvalCase; status: 'ok'; evaluation: Evaluation; codeGrade: CodeGrade; modelScore: number; finalScore: number; finalVerdict: 'pass' | 'needs_revision' }
  | { evalCase: EvalCase; status: 'error'; error: string };

const SUBMIT_EVALUATION_TOOL = {
  name: 'submit_evaluation',
  description: 'Submit the structured quality evaluation for one test case.',
  input_schema: {
    type: 'object',
    properties: {
      case_id: {
        type: 'string',
        description: 'The exact case identifier given in the prompt, e.g. "C46".',
      },
      strengths: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 3,
        description: 'Concrete strengths of this specific case (not generic praise).',
      },
      weaknesses: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 3,
        description:
          'Concrete weaknesses, including an explicit statement of any known-constraint violation if one applies.',
      },
      reasoning: {
        type: 'string',
        description:
          'Short, coherent explanation of how the strengths/weaknesses above lead to the scores and verdict below.',
      },
      scores: {
        type: 'object',
        properties: {
          traceability: { type: 'integer', minimum: 1, maximum: 5 },
          constraint_awareness: { type: 'integer', minimum: 1, maximum: 5 },
          clarity: { type: 'integer', minimum: 1, maximum: 5 },
          coverage_balance: { type: 'integer', minimum: 1, maximum: 5 },
        },
        required: ['traceability', 'constraint_awareness', 'clarity', 'coverage_balance'],
        additionalProperties: false,
      },
      verdict: { type: 'string', enum: ['pass', 'needs_revision'] },
    },
    required: ['case_id', 'strengths', 'weaknesses', 'reasoning', 'scores', 'verdict'],
    additionalProperties: false,
  },
} as const;

function formatStepsText(evalCase: EvalCase): string {
  if (evalCase.steps.length > 0) {
    return evalCase.steps
      .map((s, i) => `  ${i + 1}. ${s.content}\n     Expected: ${s.expected}`)
      .join('\n');
  }
  return (
    `Steps: ${evalCase.flatStepsText || '(none documented)'}\n` +
    `Expected Result: ${evalCase.flatExpectedText || '(none documented)'}`
  );
}

function buildPrompt(evalCase: EvalCase): string {
  const siblingsText =
    evalCase.siblingTitles.length > 0
      ? evalCase.siblingTitles.map((t) => `  - ${t}`).join('\n')
      : '  (no other cases in this suite)';

  return `You are reviewing one QA test case written against automationexercise.com, a demo e-commerce site used for test automation practice.

## Known site/environment constraints
These are the ONLY constraints you should judge constraint_awareness against. Do not invent
additional site limitations beyond this list:
${KNOWN_CONSTRAINTS.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Rubric — what each score means
- traceability (1-5): does this case read like it was derived from a real, observed finding
  about the site (specific URLs, exact button/error text, concrete data), rather than a
  generic, invented scenario? Vague or boilerplate cases score low.
- constraint_awareness (1-5): does the case avoid contradicting the constraints listed above?
  A case that asserts behavior those constraints rule out (e.g. a negative test on something
  documented as unverifiable) scores low regardless of how well-written it otherwise is.
- clarity (1-5): are the steps unambiguous and is the Expected Result concrete and checkable
  (specific text, URL, or state) rather than vague ("works correctly" with no detail given)?
- coverage_balance (1-5): considering the other cases already covering this suite (listed
  below), does this case pull its weight — a meaningful positive, negative, or edge case —
  rather than a near-duplicate of a sibling case?

## Required reasoning order
First think through and write the case's strengths (1-3 concrete points), then its weaknesses
(1-3 concrete points, explicitly naming any constraint violation from the list above if one
applies), then a short reasoning paragraph connecting those strengths/weaknesses to the scores
and verdict you are about to give. Only after that, decide the four numeric scores and the
verdict. Do this in that order — the field order in the tool schema does not by itself
guarantee you reason in this sequence, so follow this instruction explicitly.

## Test case under review (${evalCase.caseId})
Title: ${evalCase.title}
Priority: ${evalCase.priority}
Type: ${evalCase.type}
Preconditions: ${evalCase.preconditions}
${formatStepsText(evalCase)}

## Other cases already in this suite (for coverage_balance context only)
${siblingsText}

Call submit_evaluation now with case_id "${evalCase.caseId}".`;
}

async function evaluateCase(evalCase: EvalCase, apiKey: string): Promise<Evaluation> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1536,
      tools: [SUBMIT_EVALUATION_TOOL],
      tool_choice: { type: 'tool', name: 'submit_evaluation' },
      messages: [{ role: 'user', content: buildPrompt(evalCase) }],
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Anthropic API ${response.status} ${response.statusText}: ${text}`);
  }

  const body = JSON.parse(text) as { content: Array<{ type: string; name?: string; input?: unknown }> };
  const toolUse = body.content.find((block) => block.type === 'tool_use' && block.name === 'submit_evaluation');
  if (!toolUse) {
    throw new Error(`No submit_evaluation tool_use block in response: ${text.slice(0, 500)}`);
  }

  return validateEvaluation(toolUse.input);
}

const SCORE_KEYS = ['traceability', 'constraint_awareness', 'clarity', 'coverage_balance'] as const;

/**
 * The API's JSON Schema enforcement on tool input is best-effort, not a guarantee — a
 * malformed or incomplete submit_evaluation call must be caught here so it turns into a
 * per-case error (main() logs and moves on) instead of crashing the whole run downstream.
 */
function validateEvaluation(input: unknown): Evaluation {
  if (typeof input !== 'object' || input === null) {
    throw new Error(`submit_evaluation input is not an object: ${JSON.stringify(input)}`);
  }
  const candidate = input as Record<string, unknown>;

  if (typeof candidate.case_id !== 'string') {
    throw new Error(`submit_evaluation.case_id missing or not a string: ${JSON.stringify(candidate.case_id)}`);
  }
  if (!Array.isArray(candidate.strengths) || !candidate.strengths.every((s) => typeof s === 'string')) {
    throw new Error(`submit_evaluation.strengths malformed: ${JSON.stringify(candidate.strengths)}`);
  }
  if (!Array.isArray(candidate.weaknesses) || !candidate.weaknesses.every((w) => typeof w === 'string')) {
    throw new Error(`submit_evaluation.weaknesses malformed: ${JSON.stringify(candidate.weaknesses)}`);
  }
  if (typeof candidate.reasoning !== 'string') {
    throw new Error(`submit_evaluation.reasoning missing or not a string: ${JSON.stringify(candidate.reasoning)}`);
  }
  if (candidate.verdict !== 'pass' && candidate.verdict !== 'needs_revision') {
    throw new Error(`submit_evaluation.verdict invalid: ${JSON.stringify(candidate.verdict)}`);
  }

  const scores = candidate.scores;
  if (typeof scores !== 'object' || scores === null) {
    throw new Error(`submit_evaluation.scores missing or not an object: ${JSON.stringify(scores)}`);
  }
  const scoresRecord = scores as Record<string, unknown>;
  for (const key of SCORE_KEYS) {
    const value = scoresRecord[key];
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`submit_evaluation.scores.${key} invalid: ${JSON.stringify(value)}`);
    }
  }

  return candidate as unknown as Evaluation;
}

/** <SECTION>-NN-<SLUG>, e.g. "LOGIN-01-REGISTER-SUCCESS" or "PAYMENT-01-CHECKOUT-E2E" (see live cases C46-C51). */
const REFS_PATTERN = /^[A-Z]+-\d{2}-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const VALID_PRIORITIES = new Set(['High', 'Medium', 'Low']);
const REQUIRED_STRING_FIELDS: Array<keyof Pick<EvalCase, 'title' | 'priority' | 'type' | 'refs' | 'preconditions'>> =
  ['title', 'priority', 'type', 'refs', 'preconditions'];

const CODE_SCORE_WEIGHT = 0.3;
const MODEL_SCORE_WEIGHT = 0.7;
/** final_score >= this is "pass" — chosen to reproduce the model's own verdicts on the C46-C50
 * baseline (avg rubric score 4.0 was exactly the cut point between its pass and needs_revision
 * calls there); tune this if --calibrate accuracy says otherwise. */
const PASS_THRESHOLD = 4;

/**
 * Deterministic checks that don't need an API call: every required field is present and
 * non-empty, refs matches the section/number/slug convention, priority is one of the three
 * levels this project uses, and there's at least one step. Catches malformed cases the model
 * grader would otherwise have to spend a rubric dimension noticing.
 */
function gradeCaseWithCode(evalCase: EvalCase): CodeGrade {
  const missingFields = REQUIRED_STRING_FIELDS.filter((field) => !evalCase[field]?.trim());
  const checks: CodeGrade['checks'] = [
    {
      name: 'required_fields_present',
      pass: missingFields.length === 0,
      detail: missingFields.length > 0 ? `missing/empty: ${missingFields.join(', ')}` : undefined,
    },
    {
      name: 'refs_pattern',
      pass: REFS_PATTERN.test(evalCase.refs ?? ''),
      detail: `expected <SECTION>-NN-<SLUG>, got "${evalCase.refs}"`,
    },
    {
      name: 'priority_valid',
      pass: VALID_PRIORITIES.has(evalCase.priority),
      detail: `expected one of High/Medium/Low, got "${evalCase.priority}"`,
    },
    {
      name: 'steps_nonempty',
      pass: evalCase.steps.length > 0,
      detail: evalCase.steps.length === 0 ? 'steps array is empty' : undefined,
    },
  ];
  // Passing checks don't need a detail explaining why they failed.
  for (const check of checks) if (check.pass) check.detail = undefined;

  const passedCount = checks.filter((c) => c.pass).length;
  return { checks, score: (passedCount / checks.length) * 5 };
}

function averageModelScore(scores: Evaluation['scores']): number {
  return (scores.traceability + scores.constraint_awareness + scores.clarity + scores.coverage_balance) / 4;
}

function computeFinalScore(codeGrade: CodeGrade, evaluation: Evaluation): number {
  return codeGrade.score * CODE_SCORE_WEIGHT + averageModelScore(evaluation.scores) * MODEL_SCORE_WEIGHT;
}

function caseFromTestRail(
  tc: TestRailCase,
  typesById: Map<number, string>,
  prioritiesById: Map<number, string>,
  siblingTitles: string[]
): EvalCase {
  const stepsSeparated =
    (tc.custom_steps_separated as Array<{ content?: string; expected?: string }> | null | undefined) ?? [];

  return {
    caseId: `C${tc.id}`,
    title: tc.title,
    priority: prioritiesById.get(tc.priority_id as number) ?? String(tc.priority_id),
    type: typesById.get(tc.type_id as number) ?? String(tc.type_id),
    refs: tc.refs ?? '',
    preconditions: (tc.custom_preconds as string | null) || '(none documented)',
    steps: stepsSeparated.map((s) => ({ content: s.content ?? '', expected: s.expected ?? '' })),
    flatStepsText: (tc.custom_steps as string | null) ?? undefined,
    flatExpectedText: (tc.custom_expected as string | null) ?? undefined,
    siblingTitles,
  };
}

async function loadCasesFromTestRail(suiteIds: number[], projectIdArg?: number): Promise<EvalCase[]> {
  const projectId = projectIdArg ?? Number(process.env.TESTRAIL_PROJECT_ID);
  if (!projectId) {
    throw new Error('TESTRAIL_PROJECT_ID is not set and --project was not passed.');
  }

  const client = new TestRailClient();
  const [caseTypes, priorities] = await Promise.all([client.getCaseTypes(), client.getPriorities()]);
  const typesById = new Map((caseTypes ?? []).map((t) => [t.id, t.name]));
  const prioritiesById = new Map((priorities ?? []).map((p) => [p.id, p.name]));

  const evalCases: EvalCase[] = [];
  for (const suiteId of suiteIds) {
    const cases = await client.getCases(projectId, suiteId);
    if (!cases) {
      console.error(`[eval-testcases] Failed to fetch cases for suite ${suiteId} — skipping.`);
      continue;
    }
    for (const tc of cases) {
      const siblingTitles = cases.filter((c) => c.id !== tc.id).map((c) => c.title);
      evalCases.push(caseFromTestRail(tc, typesById, prioritiesById, siblingTitles));
    }
  }
  return evalCases;
}

interface RawFileCase {
  caseId: string;
  title: string;
  priority: string;
  type: string;
  refs?: string;
  preconditions?: string;
  steps?: EvalStepDetail[];
  flatStepsText?: string;
  flatExpectedText?: string;
  siblingTitles?: string[];
}

function fileCaseToEvalCase(c: RawFileCase): EvalCase {
  return {
    caseId: c.caseId,
    title: c.title,
    priority: c.priority,
    type: c.type,
    refs: c.refs ?? '',
    preconditions: c.preconditions ?? '(none documented)',
    steps: c.steps ?? [],
    flatStepsText: c.flatStepsText,
    flatExpectedText: c.flatExpectedText,
    siblingTitles: c.siblingTitles ?? [],
  };
}

function loadCasesFromFile(path: string): EvalCase[] {
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as RawFileCase[];
  return raw.map(fileCaseToEvalCase);
}

const CALIBRATION_DATASET_PATH = 'tests/eval/testcase-eval-dataset.json';

interface CalibrationRawCase extends RawFileCase {
  /** Known-correct verdict for this case, set by hand when the dataset was built — see
   * .claude/commands/eval-calibrate.md for how/when to refresh this file. */
  expected_verdict: 'pass' | 'needs_revision';
}

function loadCalibrationDataset(path: string = CALIBRATION_DATASET_PATH): EvalCase[] {
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as CalibrationRawCase[];
  return raw.map((c) => ({ ...fileCaseToEvalCase(c), expectedVerdict: c.expected_verdict }));
}

interface CliOptions {
  suiteIds?: number[];
  projectId?: number;
  filePath?: string;
  calibrate: boolean;
  verbose: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { calibrate: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--suite') {
      options.suiteIds = (argv[++i] ?? '').split(',').filter(Boolean).map(Number);
    } else if (arg === '--project') {
      options.projectId = Number(argv[++i]);
    } else if (arg === '--file') {
      options.filePath = argv[++i];
    } else if (arg === '--calibrate') {
      options.calibrate = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else {
      throw new Error(`Unrecognized argument: ${arg}`);
    }
  }
  if (!options.suiteIds && !options.filePath && !options.calibrate) {
    throw new Error('Provide one of --suite <id>[,<id>...], --file <path>, or --calibrate.');
  }
  return options;
}

type OkResult = Extract<CaseResult, { status: 'ok' }>;

function printDetail(r: OkResult): void {
  const { evalCase, evaluation, codeGrade, modelScore, finalScore, finalVerdict } = r;
  console.log(`\n${evalCase.caseId} — ${evalCase.title}`);
  console.log(
    `  Final verdict: ${finalVerdict}  (final_score=${finalScore.toFixed(2)} = ` +
      `code_score=${codeGrade.score.toFixed(2)}*0.3 + model_score=${modelScore.toFixed(2)}*0.7; ` +
      `model's own verdict field: ${evaluation.verdict})`
  );
  console.log(
    `  Code grader: ${codeGrade.checks.map((c) => `${c.name}=${c.pass ? 'pass' : `FAIL(${c.detail})`}`).join(', ')}`
  );
  console.log(
    `  Model scores: traceability=${evaluation.scores.traceability} ` +
      `constraint_awareness=${evaluation.scores.constraint_awareness} ` +
      `clarity=${evaluation.scores.clarity} ` +
      `coverage_balance=${evaluation.scores.coverage_balance}`
  );
  console.log('  Strengths:');
  evaluation.strengths.forEach((s) => console.log(`    - ${s}`));
  console.log('  Weaknesses:');
  evaluation.weaknesses.forEach((w) => console.log(`    - ${w}`));
  console.log(`  Reasoning: ${evaluation.reasoning}`);
}

function printReport(results: CaseResult[], verbose: boolean): void {
  console.log('\n=== Test case quality evaluation ===\n');

  for (const r of results) {
    if (r.status === 'error') {
      console.log(`${r.evalCase.caseId}  ERROR (see log above)                — ${r.evalCase.title}`);
      continue;
    }
    console.log(
      `${r.evalCase.caseId}  ${r.finalVerdict.toUpperCase().padEnd(14)} ` +
        `[final ${r.finalScore.toFixed(2)} = code ${r.codeGrade.score.toFixed(1)}*0.3 + model ${r.modelScore.toFixed(1)}*0.7]` +
        `  ${r.evalCase.title}`
    );
  }

  const okResults = results.filter((r): r is OkResult => r.status === 'ok');
  const needsRevision = okResults.filter((r) => r.finalVerdict === 'needs_revision');
  const failed = results.filter((r): r is Extract<CaseResult, { status: 'error' }> => r.status === 'error');

  if (verbose) {
    console.log('\n--- Full detail (all evaluated cases, --verbose) ---');
    for (const r of okResults) printDetail(r);
  }

  if (needsRevision.length > 0) {
    console.log(`\n--- NEEDS REVISION (${needsRevision.length}) ---`);
    for (const r of needsRevision) printDetail(r);
  } else {
    console.log('\nNo cases flagged needs_revision.');
  }

  if (failed.length > 0) {
    console.log(
      `\n${failed.length} case(s) failed to evaluate (see errors above): ${failed
        .map((r) => r.evalCase.caseId)
        .join(', ')}`
    );
  }

  console.log(`\nSummary: ${okResults.length} evaluated, ${needsRevision.length} needs_revision, ${failed.length} failed.`);
}

function printCalibrationReport(results: CaseResult[]): void {
  console.log('\n=== Calibration run: final_verdict vs expected_verdict ===\n');

  const okResults = results.filter((r): r is OkResult => r.status === 'ok');
  let correct = 0;

  for (const r of results) {
    if (r.status === 'error') {
      console.log(`${r.evalCase.caseId}  ERROR — could not evaluate (see log above) — ${r.evalCase.title}`);
      continue;
    }
    const expected = r.evalCase.expectedVerdict ?? '(no expected_verdict in dataset)';
    const match = r.finalVerdict === r.evalCase.expectedVerdict;
    if (match) correct++;
    console.log(
      `${r.evalCase.caseId}  ${match ? 'MATCH   ' : 'MISMATCH'}  expected=${expected}  actual=${r.finalVerdict}` +
        `  (final_score=${r.finalScore.toFixed(2)})  — ${r.evalCase.title}`
    );
  }

  const total = okResults.length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  console.log(`\nAccuracy: ${correct}/${total} (${accuracy.toFixed(1)}%)`);
  if (results.length !== total) {
    console.log(`${results.length - total} case(s) failed to evaluate and were excluded from accuracy.`);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[eval-testcases] ANTHROPIC_API_KEY is not set.');
    process.exitCode = 1;
    return;
  }

  let cases: EvalCase[];
  try {
    cases = options.calibrate
      ? loadCalibrationDataset()
      : options.filePath
        ? loadCasesFromFile(options.filePath)
        : await loadCasesFromTestRail(options.suiteIds!, options.projectId);
  } catch (error) {
    console.error('[eval-testcases] Failed to load cases:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  if (cases.length === 0) {
    console.log('[eval-testcases] No cases to evaluate.');
    return;
  }

  const results: CaseResult[] = [];
  for (const evalCase of cases) {
    let lastMessage = '';
    let evaluated = false;

    // Haiku occasionally emits a malformed submit_evaluation call (validateEvaluation catches
    // it) even though tool_choice forces the call — a transient generation glitch, not a real
    // API failure, so it's worth a couple of retries before giving up on the case.
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_CASE && !evaluated; attempt++) {
      try {
        const evaluation = await evaluateCase(evalCase, apiKey);
        const codeGrade = gradeCaseWithCode(evalCase);
        const modelScore = averageModelScore(evaluation.scores);
        const finalScore = computeFinalScore(codeGrade, evaluation);
        const finalVerdict: 'pass' | 'needs_revision' = finalScore >= PASS_THRESHOLD ? 'pass' : 'needs_revision';
        results.push({ evalCase, status: 'ok', evaluation, codeGrade, modelScore, finalScore, finalVerdict });
        console.log(`[eval-testcases] Evaluated ${evalCase.caseId} — final verdict: ${finalVerdict} (score ${finalScore.toFixed(2)})`);
        evaluated = true;
      } catch (error) {
        lastMessage = error instanceof Error ? error.message : String(error);
        console.error(
          `[eval-testcases] Attempt ${attempt}/${MAX_ATTEMPTS_PER_CASE} failed for ${evalCase.caseId}: ${lastMessage}`
        );
      }
    }

    if (!evaluated) {
      console.error(`[eval-testcases] Giving up on ${evalCase.caseId} after ${MAX_ATTEMPTS_PER_CASE} attempts.`);
      results.push({ evalCase, status: 'error', error: lastMessage });
    }
  }

  printReport(results, options.verbose);
  if (options.calibrate) {
    printCalibrationReport(results);
  }

  if (results.every((r) => r.status === 'error')) {
    process.exitCode = 1;
  }
}

main();
