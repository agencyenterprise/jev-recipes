import { parseArgs } from 'node:util';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { proposeSupportRoute } from '../../examples/support-routing/workflow.mjs';
import { createGatewayFallback } from '../../examples/support-routing/fallback.mjs';
import { supportRoutes } from '../../examples/support-routing/scenarios.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';
import { writeJson } from './archive.mjs';

const { values } = parseArgs({
  options: { live: { type: 'boolean', default: false }, out: { type: 'string' } },
});
if (!values.live || !values.out)
  throw new Error('Use --live --out <new-directory> for the mixed fixture/live transport check.');
const policy = JSON.parse(await readFile(new URL('./policy.json', import.meta.url), 'utf8'));
await mkdir(values.out, { recursive: false, mode: 0o700 });
for (const [id, request] of Object.entries({
  ready: 'Please send a copy of my invoice.',
  review: 'Please correct my invoice and also fix a crash when I export a document.',
})) {
  let exchange;
  const result = await proposeSupportRoute(
    { request, routes: supportRoutes },
    {
      client: { systemOne: fixture({ route: 'billing' }, 0.5) },
      fallback: createGatewayFallback({
        model: policy.fallbackModel,
        onExchange: (value) => {
          exchange = value;
        },
      }),
    },
  );
  await writeJson(join(values.out, `${id}.json`), {
    date: new Date().toISOString(),
    mode: 'fixture-primary/live-fallback',
    purpose:
      'Transport and structured-result check. Forced fixture uncertainty is not evidence of natural fallback frequency or accuracy.',
    input: { request, routes: supportRoutes },
    result,
    exchange,
  });
  console.log(JSON.stringify({ id, reason: result.reason, route: result.route }));
  if (result.reason === 'fallback-failed') process.exitCode = 1;
}
