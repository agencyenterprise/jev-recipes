import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'verify',
  title: 'Verify claims',
  description: 'Check each supplied claim against its paired evidence.',
  category: 'retrieval',
  tags: ['rag', 'grounding', 'claims'],
  useWhen: 'You need to know whether a claim is supported by its supplied evidence.',
  related: [
    {
      id: 'citation-match',
      reason: 'Use citation-match to select which passages support one claim.',
    },
  ],
  limitations: [
    'Checks only supplied claims; does not establish source truth or completeness.',
    'Provide 1 to 100 claims with unique IDs.',
  ],
} satisfies RecipeMetadata;
