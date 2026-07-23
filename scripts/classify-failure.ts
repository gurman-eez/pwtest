/**
 * Classifies a stably-failed Playwright test using its failure screenshot as an LLM judge —
 * same shape as scripts/eval-testcases.ts (direct fetch to the Anthropic Messages API, no
 * Claude Code SDK/CLI, forced single tool call, strict runtime validation + bounded retry for
 * malformed tool calls), but multimodal: the request includes the failure screenshot as an
 * image content block, not just text.
 *
 * Exports classifyFailure() for reuse from scripts/publish-testrail-results.ts (called only
 * for stable failures, right before a Jira bug is filed for one). Also runnable standalone —
 * see main() at the bottom — for trying it against a real screenshot without going through CI.
 *
 * Usage (standalone):
 *   node --experimental-strip-types scripts/classify-failure.ts \
 *     --screenshot <path-to-png> --test-name "<title>" [--error-message "<text>" | --error-file <path>]
 *
 * Requires ANTHROPIC_API_KEY in env.
 */
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_ATTEMPTS = 5;

const CLAUDE_MD_PATH = 'CLAUDE.md';

/**
 * Pulls the "Known site/environment constraints" section out of CLAUDE.md verbatim (heading to
 * next `## `), so the classifier has the same "is this actually a known site quirk, not a real
 * bug" context eval-testcases.ts's KNOWN_CONSTRAINTS gives the case-quality judge — without
 * hand-duplicating the list a second time now that CLAUDE.md exists (eval-testcases.ts's copy
 * predates it and hasn't been migrated; not this script's job to fix that here).
 */
function loadKnownConstraintsFromClaudeMd(): string {
  if (!existsSync(CLAUDE_MD_PATH)) {
    console.error(`[classify-failure] ${CLAUDE_MD_PATH} not found — proceeding with no site-constraint context.`);
    return '(CLAUDE.md not found — no known-constraint context available.)';
  }
  const text = readFileSync(CLAUDE_MD_PATH, 'utf-8');
  const heading = '## Known site/environment constraints';
  const start = text.indexOf(heading);
  if (start === -1) {
    console.error(`[classify-failure] "${heading}" section not found in ${CLAUDE_MD_PATH} — proceeding with no site-constraint context.`);
    return '(Section not found in CLAUDE.md — no known-constraint context available.)';
  }
  const rest = text.slice(start + heading.length);
  const nextHeadingIndex = rest.indexOf('\n## ');
  const section = nextHeadingIndex === -1 ? rest : rest.slice(0, nextHeadingIndex);
  return section.trim();
}

interface FailureContext {
  testName: string;
  errorMessage: string;
  screenshotPath: string;
}

type Category = 'visual_regression' | 'unexpected_content' | 'logic_error' | 'infrastructure_issue';
type Confidence = 'high' | 'medium' | 'low';

interface Classification {
  reasoning: string;
  category: Category;
  confidence: Confidence;
  suggested_action: string;
}

const SUBMIT_CLASSIFICATION_TOOL = {
  name: 'submit_classification',
  description: 'Submit the structured classification for one Playwright test failure.',
  input_schema: {
    type: 'object',
    properties: {
      reasoning: {
        type: 'string',
        description:
          'What is visible in the screenshot and in the error context — concrete, specific observations — written BEFORE deciding the category below. Do not state a category or conclusion here, only what you observe.',
      },
      category: {
        type: 'string',
        enum: ['visual_regression', 'unexpected_content', 'logic_error', 'infrastructure_issue'],
        description:
          'visual_regression: page rendered but looks visibly broken/misaligned/styled wrong. ' +
          'unexpected_content: page rendered fine but shows different text/data/state than the test expected (incl. a site quirk already documented as expected). ' +
          'logic_error: the screenshot shows the site behaving normally — the failure looks like a bug in the test\'s own assertion/flow, not the site. ' +
          'infrastructure_issue: error page, blank/broken load, timeout-looking state, network failure — not a real assertion mismatch at all.',
      },
      confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      suggested_action: {
        type: 'string',
        description: 'One concrete next step for whoever triages this bug — short, specific, not generic advice.',
      },
    },
    required: ['reasoning', 'category', 'confidence', 'suggested_action'],
    additionalProperties: false,
  },
} as const;

function guessMediaType(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  throw new Error(`Unsupported screenshot extension "${ext}" (expected .png/.jpg/.jpeg/.webp).`);
}

function buildPrompt(context: FailureContext, knownConstraints: string): string {
  return `You are triaging one failed Playwright test against automationexercise.com, a demo e-commerce site used for test automation practice. You are given the failure screenshot (attached as an image) plus text context. Classify what actually went wrong.

## Known site/environment constraints
These are documented, expected quirks of the real site — NOT bugs. If the screenshot shows one
of these, that's expected behavior; the failure is almost certainly a test that asserts
something the site was never going to do (logic_error or unexpected_content, not a real
regression):
${knownConstraints}

## Categories — what each one means
- visual_regression: the page rendered but looks visibly broken (misaligned, missing styles, overlapping elements, broken layout).
- unexpected_content: the page rendered fine but shows different text/data/state than the test expected — including a known site quirk from the list above being asserted against incorrectly.
- logic_error: the screenshot shows the site behaving normally; the failure looks like it's in the test's own assertion or flow, not the site.
- infrastructure_issue: error page, blank/broken load, timeout-looking state, or anything that looks like a network/environment failure rather than an assertion mismatch.

## Required reasoning order
Write "reasoning" first — concrete, specific observations from the screenshot and the error
message only, no conclusion yet. Only after that, decide category/confidence/suggested_action.
Do this in that order in your own thinking; the schema's field order alone won't make you do
it, so follow this instruction explicitly. (The same discipline eval-testcases.ts's rubric
already uses, for the same reason: skipping straight to a category produces vague, unhelpful
classifications.)

## Failure under review
Test: ${context.testName}
Error message from the Playwright report:
${context.errorMessage}

Call submit_classification now.`;
}

function validateClassification(input: unknown): Classification {
  if (typeof input !== 'object' || input === null) {
    throw new Error(`submit_classification input is not an object: ${JSON.stringify(input)}`);
  }
  const c = input as Record<string, unknown>;

  if (typeof c.reasoning !== 'string' || !c.reasoning.trim()) {
    throw new Error(`submit_classification.reasoning missing or empty: ${JSON.stringify(c.reasoning)}`);
  }
  const validCategories: Category[] = ['visual_regression', 'unexpected_content', 'logic_error', 'infrastructure_issue'];
  if (typeof c.category !== 'string' || !validCategories.includes(c.category as Category)) {
    throw new Error(`submit_classification.category invalid: ${JSON.stringify(c.category)}`);
  }
  const validConfidence: Confidence[] = ['high', 'medium', 'low'];
  if (typeof c.confidence !== 'string' || !validConfidence.includes(c.confidence as Confidence)) {
    throw new Error(`submit_classification.confidence invalid: ${JSON.stringify(c.confidence)}`);
  }
  if (typeof c.suggested_action !== 'string' || !c.suggested_action.trim()) {
    throw new Error(`submit_classification.suggested_action missing or empty: ${JSON.stringify(c.suggested_action)}`);
  }

  return c as unknown as Classification;
}

async function callAnthropic(context: FailureContext, apiKey: string): Promise<Classification> {
  if (!existsSync(context.screenshotPath)) {
    throw new Error(`Screenshot not found at ${context.screenshotPath}`);
  }
  const mediaType = guessMediaType(context.screenshotPath);
  const imageBase64 = readFileSync(context.screenshotPath).toString('base64');
  const knownConstraints = loadKnownConstraintsFromClaudeMd();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      tools: [SUBMIT_CLASSIFICATION_TOOL],
      tool_choice: { type: 'tool', name: 'submit_classification' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: buildPrompt(context, knownConstraints) },
          ],
        },
      ],
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Anthropic API ${response.status} ${response.statusText}: ${text}`);
  }

  const body = JSON.parse(text) as { content: Array<{ type: string; name?: string; input?: unknown }> };
  const toolUse = body.content.find((block) => block.type === 'tool_use' && block.name === 'submit_classification');
  if (!toolUse) {
    throw new Error(`No submit_classification tool_use block in response: ${text.slice(0, 500)}`);
  }

  return validateClassification(toolUse.input);
}

/**
 * Classifies one stable failure. Never throws — returns null on any failure (missing API key,
 * missing screenshot, network error, exhausted retries) so a caller filing a Jira bug can treat
 * classification as a pure best-effort enrichment, same spirit as JiraClient/TestRailClient
 * swallowing their own failures.
 */
export async function classifyFailure(context: FailureContext): Promise<Classification | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[classify-failure] ANTHROPIC_API_KEY is not set — skipping classification.');
    return null;
  }

  let lastMessage = '';
  // Same glitch eval-testcases.ts hits on Haiku with a long, structured prompt: it occasionally
  // echoes XML-tool-call-looking markup into a string field instead of returning clean JSON.
  // Not a real API failure, worth a few retries before giving up on this one classification.
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await callAnthropic(context, apiKey);
    } catch (error) {
      lastMessage = error instanceof Error ? error.message : String(error);
      console.error(`[classify-failure] Attempt ${attempt}/${MAX_ATTEMPTS} failed for "${context.testName}": ${lastMessage}`);
    }
  }

  console.error(`[classify-failure] Giving up on "${context.testName}" after ${MAX_ATTEMPTS} attempts.`);
  return null;
}

interface CliOptions {
  screenshot: string;
  testName: string;
  errorMessage: string;
}

function parseArgs(argv: string[]): CliOptions {
  let screenshot: string | undefined;
  let testName: string | undefined;
  let errorMessage: string | undefined;
  let errorFile: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--screenshot') screenshot = argv[++i];
    else if (arg === '--test-name') testName = argv[++i];
    else if (arg === '--error-message') errorMessage = argv[++i];
    else if (arg === '--error-file') errorFile = argv[++i];
    else throw new Error(`Unrecognized argument: ${arg}`);
  }

  if (!screenshot) throw new Error('--screenshot <path> is required.');
  if (!testName) throw new Error('--test-name "<title>" is required.');
  if (errorFile) errorMessage = readFileSync(errorFile, 'utf-8');
  if (!errorMessage) throw new Error('Provide --error-message "<text>" or --error-file <path>.');

  return { screenshot, testName, errorMessage };
}

function printClassification(context: FailureContext, result: Classification): void {
  console.log(`\nTest: ${context.testName}`);
  console.log(`Screenshot: ${context.screenshotPath}`);
  console.log(`\nReasoning:\n${result.reasoning}`);
  console.log(`\nCategory: ${result.category}`);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`Suggested action: ${result.suggested_action}`);
}

async function main(): Promise<void> {
  let options: CliOptions;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error('[classify-failure]', error instanceof Error ? error.message : error);
    console.error(
      'Usage: classify-failure.ts --screenshot <path> --test-name "<title>" (--error-message "<text>" | --error-file <path>)'
    );
    process.exitCode = 1;
    return;
  }

  const context: FailureContext = {
    testName: options.testName,
    errorMessage: options.errorMessage,
    screenshotPath: options.screenshot,
  };

  const result = await classifyFailure(context);
  if (!result) {
    console.error('[classify-failure] Classification failed — see errors above.');
    process.exitCode = 1;
    return;
  }

  printClassification(context, result);
}

const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
