import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { readEvaluationCases } from 'jev-recipes/evaluation';
import { createGatewayClient } from '../../examples/integrations/clients.mjs';
import {
  createGatewayFallback,
  fallbackRequest,
} from '../../examples/support-routing/fallback.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';
import { routeWithRules } from './rules.mjs';
import { benchmarkRouting, replayWorkflow } from './benchmark.mjs';

const { values } = parseArgs({
  options: {
    live: { type: 'boolean', default: false },
    out: { type: 'string' },
    split: { type: 'string', default: 'development' },
    development: { type: 'string' },
    replay: { type: 'string' },
    policy: { type: 'string' },
  },
});

const policy = JSON.parse(
  await readFile(values.policy ?? new URL('./policy.json', import.meta.url), 'utf8'),
);
if (values.replay) {
  if (values.live) throw new Error('Replay cannot make live calls.');
  const run = await replayWorkflow(values.replay, values.policy ? policy : undefined);
  console.log(JSON.stringify(run.report, null, 2));
} else {
  if (!values.out) throw new Error('Supply --out <new-directory>. Add --live to call providers.');
  const cases = await readEvaluationCases(new URL('./workflow-cases.jsonl', import.meta.url));
  const client = values.live
    ? createGatewayClient({ retry: { maxRetries: 0 } })
    : {
        systemOne: async (request) => {
          const input = request.state;
          const selected = routeWithRules(
            { request: input.request, routes: policy.rules },
            policy.rules,
          );
          return fixture({ route: selected.route ?? '__review__' }, 0.6)(request);
        },
      };
  const fallbackFactory = values.live
    ? (onExchange) => createGatewayFallback({ model: policy.fallbackModel, onExchange })
    : (onExchange) => async (input) => {
        const result = routeWithRules(input, policy.rules);
        const response = {
          model: 'routing-fallback-fixture',
          usage: { prompt_tokens: 0, completion_tokens: 0 },
          choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(result) } }],
        };
        await onExchange({
          request: fallbackRequest(input, policy.fallbackModel),
          response: JSON.stringify(response),
          durationMs: 0,
        });
        return { ...result, model: response.model };
      };
  const run = await benchmarkRouting({
    values: cases,
    policy,
    split: values.split,
    mode: values.live ? 'live' : 'fixture',
    client,
    fallbackFactory,
    out: values.out,
    development: values.development,
  });
  console.log(JSON.stringify(run.report, null, 2));
  if (run.report.strategies.cascade.failed) process.exitCode = 1;
}
