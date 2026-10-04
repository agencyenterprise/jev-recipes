import { describeRecipe } from '../catalog/index.js';
import { loadRecipe } from '../catalog/runner.js';
import type { RecipeName } from '../catalog/schema.js';
import { completionGate } from '../recipes/completion-gate/index.js';
import type { CompletionGateResult } from '../recipes/completion-gate/index.js';
import { toolCallGate } from '../recipes/tool-call-gate/index.js';
import type { ToolCallGateResult } from '../recipes/tool-call-gate/index.js';
import type { RecipeOptions } from '../src/schema.js';

export type RecipeToolOptions = RecipeOptions & { description?: string };

export type RecipeToolOutput = Record<string, unknown> | null;

export type RecipeToolDefinition = {
  name: RecipeName;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: unknown, signal?: AbortSignal) => Promise<RecipeToolOutput>;
};

export type GuardOptions = RecipeOptions & {
  policy?: string;
  context?: string;
  minConfidence?: number;
  onDecision?: (event: GuardEvent) => void;
};

export type GuardEvent = {
  toolName: string;
  input: unknown;
  decision: ToolCallGateResult;
};

export const BLOCKED_TOOL_OUTPUT_KIND = 'jev-recipes/blocked-tool-output';

export type BlockedToolOutput = {
  kind: typeof BLOCKED_TOOL_OUTPUT_KIND;
  blocked: true;
  action: 'ask' | 'deny';
  verdict: ToolCallGateResult['verdict'];
  status: ToolCallGateResult['status'];
  detected: ToolCallGateResult['detected'];
  confidence: number;
  message: string;
};

export type CompletionOptions = RecipeOptions & {
  task?: string;
  evidence?: string;
  toolName?: string;
  minConfidence?: number;
  onDecision?: (event: CompletionEvent) => void;
};

export type CompletionEvent = {
  report: string;
  evidence: string | undefined;
  decision: CompletionGateResult;
};

export type CompletionToolOutput = {
  accepted: boolean;
  verdict: CompletionGateResult['verdict'];
  status: CompletionGateResult['status'];
  detected: CompletionGateResult['detected'];
  confidence: number;
  message: string;
};

export const DEFAULT_COMPLETION_TOOL_NAME = 'report_completion';

export const COMPLETION_TOOL_DESCRIPTION =
  'Report that the task is complete. State what was done in report, and put the evidence that demonstrates it, such as test output, command results, or observed behavior, in evidence. A claim without evidence is not accepted.';

export const COMPLETION_TOOL_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    report: { type: 'string', description: 'What was done and how the task was completed.' },
    evidence: {
      type: 'string',
      description: 'Concrete evidence that demonstrates completion, such as test output.',
    },
  },
  required: ['report'],
  additionalProperties: false,
} as const;

export function defineRecipeTool(
  name: RecipeName,
  options: RecipeToolOptions = {},
): RecipeToolDefinition {
  const { description, ...recipeOptions } = options;
  const recipe = describeRecipe(name);
  const summary =
    description ??
    (recipe.useWhen ? `${recipe.description} Use when: ${recipe.useWhen}` : recipe.description);
  return {
    name: recipe.id,
    description: summary,
    inputSchema: recipe.inputSchema,
    execute: async (input, signal) => {
      const run = await loadRecipe(name);
      const result = await run(input, withSignal(recipeOptions, signal));
      return result as RecipeToolOutput;
    },
  };
}

export function renderToolCall(toolName: string, input: unknown): string {
  return input === undefined ? `${toolName}()` : `${toolName}(${JSON.stringify(input)})`;
}

export async function reviewToolCall(
  call: { toolName: string; input: unknown; request: string },
  options: GuardOptions,
  signal?: AbortSignal,
): Promise<ToolCallGateResult> {
  const { policy, context, minConfidence, onDecision, ...recipeOptions } = options;
  const decision = await toolCallGate(
    {
      request: call.request,
      toolCall: renderToolCall(call.toolName, call.input),
      ...(context === undefined ? {} : { context }),
      ...(policy === undefined ? {} : { policy }),
      ...(minConfidence === undefined ? {} : { minConfidence }),
    },
    withSignal(recipeOptions, signal),
  );
  onDecision?.({ toolName: call.toolName, input: call.input, decision });
  return decision;
}

export function blockedOutput(toolName: string, decision: ToolCallGateResult): BlockedToolOutput {
  const action = decision.action === 'deny' ? 'deny' : 'ask';
  const risks = decision.detected.length ? ` Detected risks: ${decision.detected.join(', ')}.` : '';
  const message =
    action === 'deny'
      ? `The call to ${toolName} was refused by policy and did not run.${risks} Do not retry it. Explain what you intended and continue with permitted work.`
      : `The call to ${toolName} did not run because a person must confirm it first.${risks} Do not retry it unattended. Explain what you intended and continue with other permitted work.`;
  return {
    kind: BLOCKED_TOOL_OUTPUT_KIND,
    blocked: true,
    action,
    verdict: decision.verdict,
    status: decision.status,
    detected: decision.detected,
    confidence: decision.confidence,
    message,
  };
}

export async function reviewCompletion(
  claim: { task: string; report: string; evidence: string | undefined },
  options: CompletionOptions,
  signal?: AbortSignal,
): Promise<CompletionToolOutput> {
  const { evidence: fixedEvidence, minConfidence, onDecision, ...rest } = options;
  const { task: _task, toolName: _toolName, ...recipeOptions } = rest;
  const evidence = [fixedEvidence, claim.evidence]
    .filter((text): text is string => Boolean(text?.trim()))
    .join('\n\n');
  const decision = await completionGate(
    {
      task: claim.task,
      report: claim.report,
      ...(evidence ? { evidence } : {}),
      ...(minConfidence === undefined ? {} : { minConfidence }),
    },
    withSignal(recipeOptions, signal),
  );
  onDecision?.({ report: claim.report, evidence: evidence || undefined, decision });
  const accepted = decision.status === 'ready' && decision.verdict === 'complete';
  const signals = decision.detected.length ? ` Signals: ${decision.detected.join(', ')}.` : '';
  const message = accepted
    ? 'The completion report was accepted.'
    : decision.status === 'review'
      ? `The completion report could not be judged confidently (verdict: ${decision.verdict}).${signals} Supply clearer evidence or continue working.`
      : `The completion report was not accepted (verdict: ${decision.verdict}).${signals} Finish the remaining work or supply evidence that demonstrates completion.`;
  return {
    accepted,
    verdict: decision.verdict,
    status: decision.status,
    detected: decision.detected,
    confidence: decision.confidence,
    message,
  };
}

export function messageText(
  messages: readonly { role: string; content: unknown }[],
  role: 'user' | 'assistant',
  position: 'first' | 'last',
): string | undefined {
  const ordered = position === 'first' ? messages : [...messages].reverse();
  for (const message of ordered) {
    if (message.role !== role) continue;
    const text = contentText(message.content);
    if (text) return text;
  }
  return undefined;
}

function contentText(content: unknown): string {
  if (typeof content === 'string') return content.trim();
  if (!Array.isArray(content)) return '';
  return content
    .map((part: unknown) =>
      typeof part === 'object' && part !== null && 'text' in part && typeof part.text === 'string'
        ? part.text
        : '',
    )
    .filter((text) => text.trim())
    .join('\n')
    .trim();
}

export function requireText(value: string | undefined, description: string): string {
  if (!value) throw new Error(`Cannot derive ${description}; supply it explicitly.`);
  return value;
}

function withSignal(options: RecipeOptions, signal: AbortSignal | undefined): RecipeOptions {
  const { client, model } = options;
  const chosen = options.signal ?? signal;
  return {
    ...(client === undefined ? {} : { client }),
    ...(model === undefined ? {} : { model }),
    ...(chosen === undefined ? {} : { signal: chosen }),
  };
}
