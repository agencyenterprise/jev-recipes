import { z } from 'zod';
import { proposeSupportNextStep } from '../conversation.mjs';
import { conversationInputSchema, prepareConversation } from '../conversation-schema.mjs';
import { supportConfig } from '../config.mjs';
import { scenarios, scenarioOptions } from '../scenarios.mjs';
import { createGatewayFallback } from '../fallback.mjs';
import { createGatewayClient } from '../client.mjs';

const requestSchema = z
  .object({
    request: conversationInputSchema.shape.request.optional(),
    answers: conversationInputSchema.shape.answers,
    scenario: z.enum(Object.keys(scenarios)).default('ready'),
  })
  .strict();

export function routingMode() {
  const mode = process.env.SUPPORT_ROUTING_MODE ?? 'fixture';
  if (!['fixture', 'live'].includes(mode)) throw new Error('Invalid SUPPORT_ROUTING_MODE.');
  return mode;
}

export async function handleRoutingRequest(
  request,
  { mode = routingMode(), createOptions = liveOptions } = {},
) {
  try {
    request.signal.throwIfAborted();
    const text = await request.text();
    if (text.length > 16000)
      return Response.json({ error: 'The request is too large.' }, { status: 413 });
    const input = requestSchema.parse(JSON.parse(text));
    if (mode !== 'fixture' && mode !== 'live') throw new Error('Unknown mode.');
    if (mode === 'live' && !input.request)
      return Response.json({ error: 'Enter a support request.' }, { status: 400 });
    const scenario = scenarios[input.scenario];
    if (
      mode === 'fixture' &&
      input.answers.length &&
      (input.answers.length !== 1 ||
        !scenario.reply ||
        input.answers[0].requirementId !== 'issue' ||
        input.answers[0].text !== scenario.reply)
    )
      return Response.json(
        { error: 'Fixture mode accepts only the displayed saved answer.' },
        { status: 400 },
      );
    const conversation = {
      request: mode === 'fixture' ? scenario.request : input.request,
      answers: input.answers,
    };
    prepareConversation(conversation, supportConfig);
    const options =
      mode === 'fixture'
        ? scenarioOptions(input.scenario, input.answers.length > 0)
        : createOptions();
    const proposal = await proposeSupportNextStep(conversation, supportConfig, {
      ...options,
      signal: request.signal,
    });
    return Response.json(
      {
        mode,
        ...proposal,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (request.signal.aborted || error?.name === 'AbortError')
      return Response.json({ error: 'The request was cancelled.' }, { status: 499 });
    if (error instanceof SyntaxError || error instanceof z.ZodError)
      return Response.json(
        {
          error:
            'Use valid answers for configured requirements and a combined conversation of at most 12,000 characters.',
        },
        { status: 400 },
      );
    return Response.json(
      { error: 'Routing is unavailable. Check the server configuration and try again.' },
      { status: 503 },
    );
  }
}

function liveOptions() {
  return {
    client: createGatewayClient({ retry: { maxRetries: 0 } }),
    ...(process.env.SUPPORT_FALLBACK_MODEL
      ? { fallback: createGatewayFallback({ model: process.env.SUPPORT_FALLBACK_MODEL }) }
      : {}),
  };
}
