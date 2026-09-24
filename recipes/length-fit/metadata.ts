import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'length-fit',
  title: 'Check response length fit',
  description: 'Is the length and detail of response proportionate to what request asks for?',
  category: 'answer-quality',
  tags: ['length', 'verbosity', 'concision', 'response-quality', 'evaluation'],
  useWhen:
    'You need to catch answers that are padded or truncated relative to the question before sending or scoring them.',
  related: [
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to check that the response matches who is asking, not how much they asked for.',
    },
    {
      id: 'answer-relevance',
      reason: 'Use answer-relevance to check that the response addresses the question at all.',
    },
  ],
  limitations: [
    'Judges proportion only. It does not check whether the response is correct, complete on substance, or well written.',
    'Style guides and hard word limits remain application rules; encode them in code and use this recipe for the judgment call.',
  ],
} satisfies RecipeMetadata;
