import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { evaluate, freezePolicy, readEvaluationCases, readRun } from '../dist/evaluation/index.js';
import { createGatewayClient } from '../examples/integrations/clients.mjs';

const { values } = parseArgs({
  options: {
    recipe: { type: 'string' },
    cases: { type: 'string' },
    out: { type: 'string' },
    split: { type: 'string', default: 'development' },
    development: { type: 'string' },
    'min-confidence': { type: 'string', default: '0.8' },
  },
});
if (
  !values.recipe ||
  !values.cases ||
  !values.out ||
  !['development', 'held-out'].includes(values.split)
)
  throw new Error(
    'Usage: node --env-file=.env evals/gateway.mjs --recipe <id> --cases <jsonl> --out <new-directory> [--split held-out --development <archive>]',
  );
if (values.split === 'held-out' && !values.development)
  throw new Error('Held-out evaluation requires --development <archive>.');
const development = values.development ? await readRun(values.development) : null;
const policy = development
  ? freezePolicy(development)
  : { minConfidence: Number(values['min-confidence']) };
const price = JSON.parse(
  await readFile(new URL('./prices/gateway-jev.json', import.meta.url), 'utf8'),
);
const client = createGatewayClient({ retry: { maxRetries: 0 } });
const run = await evaluate(values.recipe, await readEvaluationCases(values.cases), {
  client,
  model: 'typesafe-ai/jev',
  mode: 'live',
  out: values.out,
  split: values.split,
  policy,
  price,
  concurrency: 4,
  maxCases: 1000,
  maxRequests: 1000,
});
console.log(
  JSON.stringify(
    {
      recipe: run.recipe,
      archive: values.out,
      split: run.split,
      model: run.report.model,
      cases: run.report.cases,
      correct: run.report.correct,
      ready: run.report.ready,
      readyAccuracy: run.report.readyAccuracy,
      review: run.report.review,
      failed: run.report.failed,
      usage: run.report.usage,
      cost: run.report.cost,
    },
    null,
    2,
  ),
);
if (run.report.failed > 0) process.exitCode = 1;
if (
  development &&
  JSON.stringify(run.report.models) !== JSON.stringify(development.report.models)
) {
  console.error(
    'The resolved model changed after development; retain this archive but do not promote its policy.',
  );
  process.exitCode = 1;
}
