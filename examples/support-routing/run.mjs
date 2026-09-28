import { parseArgs } from 'node:util';
import { proposeSupportNextStep } from './conversation.mjs';
import { scenarios, scenarioOptions } from './scenarios.mjs';
import { supportConfig } from './config.mjs';
import { createGatewayClient } from './client.mjs';
import { createGatewayFallback } from './fallback.mjs';

const { values } = parseArgs({
  options: {
    live: { type: 'boolean', default: false },
    request: { type: 'string' },
    answer: { type: 'string', multiple: true },
    'fallback-model': { type: 'string' },
  },
});

if (values.live) {
  if (!values.request) throw new Error('Live mode requires --request <text>.');
  const answers = (values.answer ?? []).map((value) => {
    const separator = value.indexOf('=');
    if (separator < 1) throw new Error('Use --answer requirementId=text.');
    return { requirementId: value.slice(0, separator), text: value.slice(separator + 1) };
  });
  const proposal = await proposeSupportNextStep(
    { request: values.request, answers },
    supportConfig,
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
    const proposal = await proposeSupportNextStep(
      { request: scenario.request },
      supportConfig,
      scenarioOptions(name),
    );
    console.log(JSON.stringify({ mode: 'fixture', scenario: name, proposal }));
    if (proposal.action === 'propose_question' && scenario.reply) {
      const continued = await proposeSupportNextStep(
        {
          request: scenario.request,
          answers: [{ requirementId: proposal.requirementId, text: scenario.reply }],
        },
        supportConfig,
        scenarioOptions(name, true),
      );
      console.log(
        JSON.stringify({
          mode: 'fixture',
          scenario: name,
          reply: scenario.reply,
          proposal: continued,
        }),
      );
    }
  }
}
