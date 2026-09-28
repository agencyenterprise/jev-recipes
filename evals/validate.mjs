import { listGoldenRecipeIds, readGoldenCases } from './lib/harness.mjs';
import { loadEvaluationRecipe, validateCases } from '../dist/evaluation/dataset.js';

const ids = await listGoldenRecipeIds();
const problems = [];
for (const id of ids) {
  try {
    validateCases(await loadEvaluationRecipe(id), await readGoldenCases(id));
  } catch (error) {
    problems.push(`${id}: ${error.message}`);
  }
}
if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exitCode = 1;
} else {
  console.log(`Validated golden datasets for ${ids.length} recipes.`);
}
