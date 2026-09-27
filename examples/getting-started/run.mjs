import { route } from 'jev-recipes/route';
import { rerank } from 'jev-recipes/rerank';
import { toolCallGate } from 'jev-recipes/tool-call-gate';
import { fixture } from '../shared/fixtures.mjs';

const paths = [
  {
    name: 'route work',
    run: route,
    input: {
      request: 'Please explain my invoice.',
      routes: { billing: 'Invoices', support: 'Product support' },
    },
    ready: { route: 'billing' },
    review: { route: '__review__' },
  },
  {
    name: 'select evidence',
    run: rerank,
    input: {
      query: 'How are invoices delivered?',
      items: [{ id: 'billing-guide', text: 'Invoices are emailed on the first day of the month.' }],
    },
    ready: { item_0: 0.95 },
    review: { item_0: 0.1 },
  },
  {
    name: 'review an action',
    run: toolCallGate,
    input: {
      request: 'Read the local test output.',
      toolCall: 'Read tests/output.txt',
      policy: 'Reading local test output is permitted.',
    },
    ready: { decision: 'allow', default: 0.01 },
    review: { decision: 'unclear', default: 0.01 },
  },
];

for (const path of paths) {
  for (const scenario of ['ready', 'review', 'provider-failure']) {
    const client = {
      systemOne:
        scenario === 'provider-failure'
          ? async () => {
              throw new Error('Offline provider failure');
            }
          : fixture(path[scenario]),
    };
    try {
      const decision = await path.run(path.input, { client });
      console.log(JSON.stringify({ path: path.name, scenario, mode: 'fixture', decision }));
    } catch {
      console.log(
        JSON.stringify({
          path: path.name,
          scenario,
          mode: 'fixture',
          nextStep: 'review',
          reason: 'evaluation-failed',
        }),
      );
    }
  }
}
