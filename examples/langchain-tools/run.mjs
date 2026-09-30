import { tool } from '@langchain/core/tools';
import { completionTool, guardTools, recipeTools } from 'jev-recipes/langchain';
import { fixture } from '../shared/fixtures.mjs';

const live = process.argv.includes('--live');
if (process.argv.slice(2).some((arg) => arg !== '--live'))
  throw new Error('Usage: node examples/langchain-tools/run.mjs [--live]');

const fixtures = {
  route: fixture({ route: 'billing' }),
  allow: fixture({ decision: 'allow', default: 0.02 }),
  deny: fixture({ decision: 'deny', destructive: 0.98, irreversible: 0.98, default: 0.02 }),
  complete: fixture({ decision: 'complete', default: 0.02 }),
};
const jev = live
  ? { model: 'jev-1.13.0' }
  : {
      client: {
        systemOne: async (request) => {
          const { questions, state } = request;
          const pick =
            'route' in questions
              ? fixtures.route
              : 'irreversible' in questions
                ? String(state.toolCall).startsWith('drop_table')
                  ? fixtures.deny
                  : fixtures.allow
                : fixtures.complete;
          return pick(request);
        },
      },
    };

const request = 'Route this ticket and clean up the temporary test table.';
const [route] = recipeTools(['route'], jev);
const [runTests, dropTable] = guardTools(
  [
    tool(async ({ pattern }) => ({ pattern, passed: 12 }), {
      name: 'run_tests',
      description: 'Run the test suite.',
      schema: { type: 'object', properties: { pattern: { type: 'string' } } },
    }),
    tool(async ({ table }) => ({ dropped: table }), {
      name: 'drop_table',
      description: 'Drop a database table.',
      schema: { type: 'object', properties: { table: { type: 'string' } } },
    }),
  ],
  { ...jev, request, policy: 'Never drop tables without a person confirming.' },
);
const report = completionTool({ ...jev, task: request });

const results = {
  route: await route.invoke({
    request: 'I was charged twice for my subscription.',
    routes: { billing: 'Payments and refunds', technical: 'Errors and outages' },
  }),
  run_tests: await runTests.invoke({ pattern: 'account' }),
  drop_table: await dropTable.invoke({ table: 'tmp_test' }),
  report_completion: await report.invoke({
    report: 'Routed the ticket and ran the tests.',
    evidence: 'route: billing. run_tests: 12 passed.',
  }),
};
console.log(
  JSON.stringify(
    {
      mode: live ? 'live-decisions' : 'fixture',
      note: 'Tools are invoked directly here. Fixtures demonstrate control flow, not accuracy.',
      results,
    },
    null,
    2,
  ),
);
