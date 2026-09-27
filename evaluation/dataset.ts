import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { describeRecipe } from '../catalog/index.js';
import { recipeNameSchema } from '../catalog/schema.js';
import { isRecord, comparableDecision } from './decisions.js';
import { evaluationCaseSchema } from './schema.js';
import type { EvaluationCase } from './schema.js';
import type { EvaluationRecipe } from './engine.js';

export async function loadEvaluationRecipe(name: string): Promise<EvaluationRecipe> {
  const id = recipeNameSchema.parse(name);
  const module = (await import(
    new URL(`../recipes/${id}/index.js`, import.meta.url).href
  )) as Record<string, unknown>;
  const run = Object.values(module).find((value) => typeof value === 'function');
  const inputSchema = Object.entries(module).find(([key]) => key.endsWith('InputSchema'))?.[1];
  if (typeof run !== 'function' || !(inputSchema instanceof z.ZodObject))
    throw new Error(`Cannot load recipe ${id}.`);
  return { id, run: run as EvaluationRecipe['run'], inputSchema };
}

export async function readEvaluationCases(path: string): Promise<unknown[]> {
  const text = await readFile(path, 'utf8');
  return text.split(/\r?\n/).flatMap((line, index) => {
    if (!line.trim()) return [];
    try {
      return [JSON.parse(line) as unknown];
    } catch {
      throw new Error(`Invalid JSON on line ${index + 1} of ${path}.`);
    }
  });
}

export function validateCases(recipe: EvaluationRecipe, values: unknown[]): EvaluationCase[] {
  if (!values.length) throw new Error('The case file is empty.');
  const resultSchema = describeRecipe(recipeNameSchema.parse(recipe.id)).resultSchema;
  const cases = values.map((value) => evaluationCaseSchema.parse(value));
  const ids = new Set<string>();
  const familySplits = new Map<string, string>();
  for (const entry of cases) {
    if (ids.has(entry.id)) throw new Error(`Duplicate case ID: ${entry.id}`);
    ids.add(entry.id);
    if (entry.family) {
      if (familySplits.has(entry.family) && familySplits.get(entry.family) !== entry.split)
        throw new Error(`Case family ${entry.family} crosses development and held-out splits.`);
      familySplits.set(entry.family, entry.split);
    }
    recipe.inputSchema.parse(entry.input);
    for (const [path, expected] of Object.entries(entry.expected)) {
      if (
        path
          .split('.')
          .some((segment) =>
            [
              'status',
              'confidence',
              'probabilities',
              'probability',
              'model',
              'usage',
              'score',
            ].includes(segment),
          )
      )
        throw new Error(`${entry.id}: expected must name an ungated decision, not ${path}.`);
      const field = schemaAtPath(resultSchema, path.split('.'));
      if (!field) throw new Error(`${entry.id}: unknown result field ${path}.`);
      if (!acceptsValue(field, expected))
        throw new Error(`${entry.id}: expected ${path} does not match the result schema.`);
    }
    if (isEmptyDecision(comparableDecision(entry.expected)))
      throw new Error(`${entry.id}: expected must contain a decision to compare.`);
  }
  return cases;
}

function schemaAtPath(
  schema: Record<string, unknown>,
  segments: string[],
): Record<string, unknown> | undefined {
  if (!segments.length) return schema;
  if (Array.isArray(schema.anyOf)) {
    const candidates = schema.anyOf.flatMap((branch) => {
      const field = isRecord(branch) ? schemaAtPath(branch, segments) : undefined;
      return field ? [field] : [];
    });
    return candidates.length ? { anyOf: candidates } : undefined;
  }
  const [first, ...rest] = segments;
  if (isRecord(schema.properties) && isRecord(schema.properties[first!]))
    return schemaAtPath(schema.properties[first!] as Record<string, unknown>, rest);
  if (schema.type === 'array' && /^(0|[1-9]\d*)$/.test(first!) && isRecord(schema.items))
    return schemaAtPath(schema.items, rest);
  if (isRecord(schema.additionalProperties)) return schemaAtPath(schema.additionalProperties, rest);
  return undefined;
}

function acceptsValue(schema: Record<string, unknown>, value: unknown): boolean {
  if (Array.isArray(schema.anyOf))
    return schema.anyOf.some((candidate) => isRecord(candidate) && acceptsValue(candidate, value));
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) return false;
  if (schema.const !== undefined && schema.const !== value) return false;
  if (Array.isArray(schema.type))
    return schema.type.some((type) => acceptsValue({ ...schema, type }, value));
  if (schema.type === 'null') return value === null;
  if (schema.type === 'array')
    return (
      Array.isArray(value) &&
      (!isRecord(schema.items) ||
        value.every((item) => acceptsValue(schema.items as Record<string, unknown>, item)))
    );
  if (schema.type === 'object') {
    if (!isRecord(value)) return false;
    return Object.entries(value).every(([name, item]) => {
      const field = schemaAtPath(schema, [name]);
      return field ? acceptsValue(field, item) : schema.additionalProperties !== false;
    });
  }
  if (schema.type === 'integer') return typeof value === 'number' && Number.isInteger(value);
  return schema.type === undefined || typeof value === schema.type;
}

function isEmptyDecision(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0 && value.every(isEmptyDecision);
  if (isRecord(value)) return Object.values(value).every(isEmptyDecision);
  return value === undefined;
}

export function fingerprint(value: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(canonicalValue(value)))
    .digest('hex');
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (isRecord(value))
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalValue(value[key])]),
    );
  return value;
}

export function datasetFingerprints(cases: EvaluationCase[]) {
  const ordered = [...cases].sort((a, b) => a.id.localeCompare(b.id));
  return {
    datasetFingerprint: fingerprint(ordered),
    inputFingerprint: fingerprint(ordered.map(({ id, input, split }) => ({ id, input, split }))),
    answerKeyFingerprint: fingerprint(ordered.map(({ id, expected }) => ({ id, expected }))),
  };
}

export async function recipeFingerprint(id: string): Promise<string> {
  recipeNameSchema.parse(id);
  const sources = new Map<string, string>();
  const root = new URL('../', import.meta.url);
  async function visit(url: URL): Promise<void> {
    if (sources.has(url.href)) return;
    const source = await readFile(url, 'utf8');
    sources.set(url.href, source);
    for (const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
      if (match[1]!.startsWith('.')) await visit(new URL(match[1]!, url));
    }
  }
  await visit(new URL(`recipes/${id}/index.js`, root));
  return fingerprint(
    Object.fromEntries([...sources].map(([url, source]) => [url.slice(root.href.length), source])),
  );
}
