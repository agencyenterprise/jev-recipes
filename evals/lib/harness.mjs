import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

export { comparableDecision } from '../../dist/evaluation/comparison.js';

export async function listRecipeIds() {
  const entries = await readdir(join(projectRoot, 'recipes'), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function listGoldenRecipeIds() {
  const entries = await readdir(join(projectRoot, 'evals'), { withFileTypes: true });
  const candidates = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const withCases = [];
  for (const id of candidates) {
    const hasCases = await readFile(join(projectRoot, 'evals', id, 'cases.jsonl'), 'utf8')
      .then(() => true)
      .catch(() => false);
    if (hasCases) withCases.push(id);
  }
  return withCases.sort();
}

export async function loadRecipe(id) {
  const module = await import(pathToFileURL(join(projectRoot, 'dist/recipes', id, 'index.js')));
  const exports = Object.entries(module);
  const [, run] = exports.find(([, value]) => typeof value === 'function');
  const [, inputSchema] = exports.find(([name]) => name.endsWith('InputSchema'));
  const fixture = JSON.parse(await readFile(join(projectRoot, 'recipes', id, 'demo.json'), 'utf8'));
  return { id, run, inputSchema, fixture };
}

export async function readGoldenCases(id) {
  const text = await readFile(join(projectRoot, 'evals', id, 'cases.jsonl'), 'utf8');
  return text
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
}

export function fixtureClient(response) {
  return { systemOne: async () => structuredClone(response) };
}

export function hasReviewAnywhere(value) {
  if (Array.isArray(value)) return value.some(hasReviewAnywhere);
  if (value && typeof value === 'object') {
    return Object.entries(value).some(([name, field]) =>
      name === 'status' ? field === 'review' : hasReviewAnywhere(field),
    );
  }
  return false;
}

export function caseConfidence(result, expectedPaths = []) {
  if (typeof result?.confidence === 'number') return result.confidence;
  const scoped = expectedPaths
    .map((path) => confidenceNear(result, path.split('.')))
    .filter((value) => value !== undefined);
  const values = scoped.length ? scoped : collectConfidences(result);
  return values.length ? Math.min(...values) : undefined;
}

function confidenceNear(record, segments) {
  let node = record;
  for (let index = 0; index < segments.length; index += 1) {
    const next = node?.[segments[index]];
    if (next && typeof next === 'object' && typeof next.confidence === 'number') {
      const rest = segments.slice(index + 1);
      if (!rest.length || !rest.some((segment) => segment === 'confidence')) return next.confidence;
    }
    node = next;
  }
  return undefined;
}

function collectConfidences(value) {
  if (Array.isArray(value)) return value.flatMap(collectConfidences);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([name, field]) =>
      name === 'confidence' && typeof field === 'number' ? [field] : collectConfidences(field),
    );
  }
  return [];
}

export function pick(record, names) {
  return Object.fromEntries(names.map((name) => [name, record[name]]));
}

export function valueAtPath(record, path) {
  return path.split('.').reduce((value, segment) => value?.[segment], record);
}

export function pickPaths(record, paths) {
  return Object.fromEntries(paths.map((path) => [path, valueAtPath(record, path)]));
}

export function deepEqual(first, second) {
  if (Object.is(first, second)) return true;
  if (typeof first !== 'object' || typeof second !== 'object' || !first || !second) return false;
  if (Array.isArray(first) !== Array.isArray(second)) return false;
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);
  if (firstKeys.length !== secondKeys.length) return false;
  return firstKeys.every((key) => deepEqual(first[key], second[key]));
}

export async function mapWithConcurrencyLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(lanes);
  return results;
}

export function requireApiKey() {
  if (process.env.TYPESAFE_API_KEY) return;
  console.error('TYPESAFE_API_KEY is not set. Live evals need an API key; see .env.example.');
  process.exit(1);
}

export function roundedTo(places, value) {
  return Number(value.toFixed(places));
}
