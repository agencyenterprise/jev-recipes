import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'evidence-novelty',
  title: 'Check new evidence',
  description:
    'Does passage add material information relevant to question beyond existingEvidence?',
  category: 'retrieval',
  tags: ['retrieval', 'evidence', 'novelty', 'rag'],
  useWhen: 'You need to decide whether a new passage adds useful information to existing evidence.',
  related: [
    {
      id: 'passage-duplicate',
      reason: 'Use passage-duplicate to compare overlap between two passages.',
    },
  ],
  limitations: [
    'Assesses novelty within the supplied set. It does not establish correctness or decide when retrieval must stop.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
