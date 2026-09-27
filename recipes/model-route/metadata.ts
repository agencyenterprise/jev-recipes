import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'model-route',
  title: 'Route a request to a model tier',
  description:
    'Which of the described models should serve request, and how much reasoning effort does it need, decided in one call so a cheap model handles easy turns and a capable one handles hard turns?',
  category: 'workflow',
  tags: ['agent', 'model-routing', 'cost', 'effort', 'reasoning', 'tiering', 'harness', 'gateway'],
  useWhen:
    'An agent harness, gateway, or proxy chooses per request which LLM and thinking level to use, and you want that choice made in well under a second.',
  related: [
    {
      id: 'route',
      reason:
        'Use route to send a request to a named handler or team when no effort level is needed.',
    },
    {
      id: 'task-complexity',
      reason: 'Use task-complexity for a five-level complexity grade without picking a model.',
    },
  ],
  limitations: [
    'Chooses among the supplied descriptions only. The quality of the routing depends on how honestly each model entry describes its strengths, weaknesses, and cost.',
    'The effort grade is a judgment about the request text, not a measurement; calibrate its thresholds against your own traffic.',
  ],
} satisfies RecipeMetadata;
