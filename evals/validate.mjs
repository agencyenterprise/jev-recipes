import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  comparableDecision,
  listGoldenRecipeIds,
  loadRecipe,
  projectRoot,
  readGoldenCases,
} from './lib/harness.mjs';

const GATED_FIELDS = new Set([
  'status',
  'model',
  'usage',
  'confidence',
  'probability',
  'probabilities',
  'score',
]);

const ids = await listGoldenRecipeIds();
if (!ids.length) {
  console.log('No golden datasets to validate.');
  process.exit(0);
}

const problems = [];
for (const id of ids) problems.push(...(await validateDataset(id)));

if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log(`Validated golden datasets for ${ids.length} recipes.`);

async function validateDataset(id) {
  const found = [];
  const { inputSchema } = await loadRecipe(id);
  const resultFields = await resultFieldsOf(id);
  const seenIds = new Set();
  let cases;
  try {
    cases = await readGoldenCases(id);
  } catch (error) {
    return [`${id}: cases.jsonl is not valid JSONL (${error.message}).`];
  }
  for (const goldenCase of cases) {
    const label = `${id}/${goldenCase.id ?? '<missing id>'}`;
    if (!goldenCase.id) found.push(`${label}: every case needs an id.`);
    else if (seenIds.has(goldenCase.id)) found.push(`${label}: duplicate case id.`);
    seenIds.add(goldenCase.id);
    if (!goldenCase.rationale) found.push(`${label}: every case needs a rationale.`);
    const parsed = inputSchema.safeParse(goldenCase.input);
    if (!parsed.success)
      found.push(`${label}: invalid input (${parsed.error.issues[0]?.message}).`);
    const expectedFields = Object.keys(goldenCase.expected ?? {});
    if (!expectedFields.length)
      found.push(`${label}: expected must name at least one result field.`);
    for (const field of expectedFields) {
      const segments = field.split('.');
      if (segments.some((segment) => GATED_FIELDS.has(segment))) {
        found.push(`${label}: expected must not use the confidence-gated field "${field}".`);
      } else if (!resultFields.has(segments[0])) {
        found.push(`${label}: "${field}" is not a field of the ${id} result.`);
      }
    }
    if (expectedFields.length && isEmptyDeep(comparableDecision(goldenCase.expected))) {
      found.push(`${label}: expected contains only model-emitted numbers or statuses to compare.`);
    }
  }
  return found;
}

function isEmptyDeep(value) {
  if (Array.isArray(value)) return value.every(isEmptyDeep);
  if (value && typeof value === 'object') return Object.values(value).every(isEmptyDeep);
  return value === undefined;
}

async function resultFieldsOf(id) {
  const details = JSON.parse(
    await readFile(join(projectRoot, 'catalog/generated/details', `${id}.json`), 'utf8'),
  );
  return new Set(Object.keys(details.resultSchema.properties ?? {}));
}
