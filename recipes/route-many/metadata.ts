import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'route-many',
  title: 'Route many requests in batches',
  description:
    'Which named route handles each of up to 500 requests, judged in batched Jev requests so a queue of tickets, emails, or events is routed in a handful of calls instead of one per item?',
  category: 'support',
  tags: ['batch', 'routing', 'triage', 'queue', 'bulk', 'tickets', 'email', 'throughput'],
  useWhen:
    'You have a backlog or stream of messages to route to the same set of handlers and want batched throughput with a per-item review outcome.',
  related: [
    {
      id: 'route',
      reason: 'Use route for a single request, or when each request has its own set of routes.',
    },
    {
      id: 'ticket-match',
      reason: 'Use ticket-match to link a new message to an existing ticket rather than a queue.',
    },
  ],
  limitations: [
    'Every request in a batch shares one model call, so accuracy can fall as batches grow; the default batch size of 20 is a starting point to tune against your own labels.',
    'Per-item results are independent judgments. The recipe does not deduplicate or group related requests.',
  ],
} satisfies RecipeMetadata;
