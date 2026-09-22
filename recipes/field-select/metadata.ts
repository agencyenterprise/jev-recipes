import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'field-select',
  title: 'Select a field value',
  description: 'Which supplied candidate is the value of field in document?',
  category: 'knowledge',
  tags: ['knowledge', 'field', 'select'],
  useWhen: 'You need to select which supplied candidate expresses a field value in a document.',
  related: [
    {
      id: 'reference-resolve',
      reason: 'Use reference-resolve to identify what a conversational reference points to.',
    },
  ],
  limitations: [
    'Chooses among caller-supplied candidates. Extract candidates with a parser or generator first; validate exact formats and identifiers in code.',
    'Supply 1 to 50 items per list, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
