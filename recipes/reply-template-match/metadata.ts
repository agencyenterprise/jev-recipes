import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'reply-template-match',
  title: 'Select a reply template',
  description: 'Which supplied approved template applies to request and context?',
  category: 'support',
  tags: ['support', 'reply', 'template', 'match'],
  useWhen: 'You want to select a supplied approved reply template for a request.',
  related: [
    { id: 'route', reason: 'Use route to select a handler rather than a response template.' },
  ],
  limitations: [
    'Selects a supplied template. It does not fill placeholders, approve its content, personalize it, or send a response.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
