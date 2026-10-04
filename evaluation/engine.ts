import { isDeepStrictEqual } from 'node:util';
import type { SystemOneRequest } from '@typesafe-ai/sdk';
import type { z } from 'zod';
import { createClient } from '../src/client.js';
import type { DecisionClient, RecipeOptions } from '../src/schema.js';
import { caseConfidence, mapWithConcurrencyLimit, pickPaths } from './decisions.js';
import { isReady, matchesExpected } from './comparison.js';
import type { EvaluationCase } from './schema.js';

export interface EvaluationRecipe {
  id: string;
  run: (input: unknown, options?: RecipeOptions) => Promise<unknown>;
  inputSchema: z.ZodObject;
}

export interface Exchange {
  request: SystemOneRequest;
  response?: unknown;
  error?: string;
  durationMs: number;
}

export interface EvaluationRow {
  id: string;
  expected: Record<string, unknown>;
  contested: boolean;
  adversarial: boolean;
  actual?: Record<string, unknown>;
  result?: unknown;
  error?: string;
  confidence?: number | undefined;
  model?: string | undefined;
  correct: boolean;
  ready: boolean;
  durationMs: number;
  exchanges: Exchange[];
  decisions: { minConfidence: number; ready: boolean; correct: boolean }[];
}

export interface EngineOptions extends RecipeOptions {
  concurrency?: number;
  maxRequests?: number;
  thresholds?: number[];
  recorded?: EvaluationRow[];
  onCase?: (row: EvaluationRow, index: number) => Promise<void>;
}

export const confidenceThresholds = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];

export async function evaluateCases(
  recipe: EvaluationRecipe,
  cases: EvaluationCase[],
  options: EngineOptions = {},
): Promise<EvaluationRow[]> {
  let requests = 0;
  let client = options.client;
  const limitedClient: DecisionClient = {
    async systemOne(request, requestOptions) {
      if (requests >= (options.maxRequests ?? 1000))
        throw new Error('Evaluation request limit reached.');
      requests++;
      client ??= createClient();
      return client.systemOne(request, requestOptions);
    },
  };
  return mapWithConcurrencyLimit(cases, options.concurrency ?? 4, async (goldenCase, index) => {
    const recorded = options.recorded?.find((row) => row.id === goldenCase.id);
    if (options.recorded && !recorded) throw new Error(`Missing archived case: ${goldenCase.id}`);
    const playback = recorded ? replayResponses(recorded.exchanges) : undefined;
    const row = await evaluateCase(recipe, goldenCase, playback?.client ?? limitedClient, options);
    playback?.assertComplete();
    if (recorded) {
      row.durationMs = recorded.durationMs;
      row.exchanges = recorded.exchanges;
    }
    await options.onCase?.(row, index);
    return row;
  });
}

async function evaluateCase(
  recipe: EvaluationRecipe,
  goldenCase: EvaluationCase,
  client: DecisionClient,
  options: EngineOptions,
): Promise<EvaluationRow> {
  const row: EvaluationRow = {
    id: goldenCase.id,
    expected: goldenCase.expected,
    contested: goldenCase.contested,
    adversarial: goldenCase.adversarial,
    correct: false,
    ready: false,
    durationMs: 0,
    exchanges: [],
    decisions: [],
  };
  const started = performance.now();
  const recipeOptions: RecipeOptions = { client: recordResponses(client, row.exchanges) };
  if (options.model !== undefined) recipeOptions.model = options.model;
  if (options.signal !== undefined) recipeOptions.signal = options.signal;
  try {
    row.result = await recipe.run(goldenCase.input, recipeOptions);
    row.actual = pickPaths(row.result, Object.keys(goldenCase.expected));
    row.correct = matchesExpected(row.actual, row.expected, recipe.id);
    row.ready = isReady(row.result, recipe.id);
    row.confidence = caseConfidence(row.result, Object.keys(goldenCase.expected));
    const model = pickPaths(row.result, ['model']).model;
    if (typeof model === 'string') row.model = model;
  } catch (error) {
    if (error instanceof ReplayMismatch) throw error;
    row.error = safeError(error);
  }
  row.durationMs = Math.round((performance.now() - started) * 100) / 100;
  if (row.error !== undefined) return row;
  for (const minConfidence of options.thresholds ?? []) {
    const playback = replayResponses(row.exchanges);
    const result = await recipe.run(
      { ...goldenCase.input, minConfidence },
      { ...recipeOptions, client: playback.client },
    );
    playback.assertComplete();
    row.decisions.push({
      minConfidence,
      ready: isReady(result, recipe.id),
      correct: matchesExpected(
        pickPaths(result, Object.keys(row.expected)),
        row.expected,
        recipe.id,
      ),
    });
  }
  return row;
}

function recordResponses(client: DecisionClient, exchanges: Exchange[]): DecisionClient {
  return {
    async systemOne(request, options) {
      const exchange: Exchange = { request: asArchivedRequest(request), durationMs: 0 };
      exchanges.push(exchange);
      const started = performance.now();
      try {
        const response = await client.systemOne(request, options);
        exchange.response = structuredClone(response);
        return response;
      } catch (error) {
        exchange.error = safeError(error);
        throw error;
      } finally {
        exchange.durationMs = Math.round((performance.now() - started) * 100) / 100;
      }
    },
  };
}

class ReplayMismatch extends Error {}

export function replayResponses(exchanges: Exchange[]) {
  const remaining = [...exchanges];
  return {
    client: {
      async systemOne(request: SystemOneRequest) {
        const archived = asArchivedRequest(request);
        const index = remaining.findIndex((exchange) =>
          isDeepStrictEqual(exchange.request, archived),
        );
        if (index === -1)
          throw new ReplayMismatch(
            'Replay requested an unrecorded model response. The prompt or model has changed.',
          );
        const [exchange] = remaining.splice(index, 1);
        if (exchange!.error !== undefined) throw new Error(exchange!.error);
        return structuredClone(exchange!.response);
      },
    },
    assertComplete() {
      if (remaining.length)
        throw new ReplayMismatch(
          'Replay did not consume every recorded request. The recipe has changed.',
        );
    },
  };
}

function asArchivedRequest(request: SystemOneRequest): SystemOneRequest {
  return JSON.parse(JSON.stringify(request)) as SystemOneRequest;
}

function safeError(error: unknown): string {
  let message = error instanceof Error ? error.message : String(error);
  for (const [name, value] of Object.entries(process.env)) {
    if (/KEY|TOKEN|SECRET|PASSWORD/i.test(name) && value && value.length >= 6)
      message = message.replaceAll(value, '[redacted]');
  }
  return message.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
}
