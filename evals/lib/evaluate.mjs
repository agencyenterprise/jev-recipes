import { createClient } from '../../dist/src/client.js';
import { confidenceThresholds, evaluateCases } from '../../dist/evaluation/engine.js';
import { buildReport } from '../../dist/evaluation/report.js';

export async function evaluateRecipe(
  recipe,
  cases,
  { client = createClient(), concurrency = 4 } = {},
) {
  const thresholds = Object.hasOwn(recipe.inputSchema.shape, 'minConfidence')
    ? confidenceThresholds
    : [];
  const rows = await evaluateCases(
    recipe,
    cases.map((entry) => ({
      ...entry,
      contested: entry.contested === true,
      adversarial: entry.adversarial === true,
    })),
    { client, concurrency, thresholds },
  );
  return buildReport(recipe.id, rows, thresholds);
}
