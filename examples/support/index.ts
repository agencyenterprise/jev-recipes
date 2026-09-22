import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { createClient } from '../../src/client.js';
import type { DecisionClient } from '../../src/schema.js';
import { answerSupportRequest } from './workflow.js';
import { supportFixtureSchema } from './schema.js';

async function main(): Promise<void> {
  const args = z.union([z.tuple([]), z.tuple([z.literal('--live')])]).parse(process.argv.slice(2));
  const fixtureJson = await readFile(
    new URL('../../../examples/support/demo.json', import.meta.url),
    'utf8',
  );
  const fixture = supportFixtureSchema.parse(JSON.parse(fixtureJson));
  const live = args[0] === '--live';
  const client = live
    ? createClient({ timeout: 20_000, retry: { maxRetries: 0 } })
    : createFixtureClient(fixture.responses);
  const result = await answerSupportRequest(fixture.input, async () => fixture.draft, { client });

  process.stdout.write(
    `${JSON.stringify(
      {
        mode: live ? 'live' : 'demo',
        note: live
          ? 'Live Jev decisions with a saved draft answer. No generative model was called.'
          : 'Hand-authored decision fixtures and a saved draft. No model was called; this does not measure accuracy.',
        result,
      },
      null,
      2,
    )}\n`,
  );
}

function createFixtureClient(
  responses: z.infer<typeof supportFixtureSchema>['responses'],
): DecisionClient {
  return {
    systemOne: async (request) => {
      const key = Object.keys(request.questions).join(',');
      const response = responses[key];
      if (response === undefined) throw new Error(`No offline response for questions: ${key}`);
      return response;
    },
  };
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
