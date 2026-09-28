import { parseArgs } from 'node:util';
import { proposeSupportRoute } from './workflow.mjs';
import { scenarios, scenarioOptions, supportRoutes } from './scenarios.mjs';
import { createGatewayClient } from '../integrations/clients.mjs';
import { createGatewayFallback } from './fallback.mjs';

const { values } = parseArgs({
  options: {
    live: { type: 'boolean', default: false },
    request: { type: 'string' },
    'fallback-model': { type: 'string' },
  },
});

if (values.live) {
  if (!values.request) throw new Error('Live mode requires --request <text>.');
  const proposal = await proposeSupportRoute(
    { request: values.request, routes: supportRoutes },
    {
      client: createGatewayClient({ retry: { maxRetries: 0 } }),
      ...(values['fallback-model']
        ? { fallback: createGatewayFallback({ model: values['fallback-model'] }) }
        : {}),
    },
  );
  console.log(JSON.stringify({ mode: 'live', proposal }, null, 2));
} else {
  for (const [name, scenario] of Object.entries(scenarios)) {
    const proposal = await proposeSupportRoute(
      { request: scenario.request, routes: supportRoutes },
      scenarioOptions(name),
    );
    console.log(JSON.stringify({ mode: 'fixture', scenario: name, proposal }));
  }
}
