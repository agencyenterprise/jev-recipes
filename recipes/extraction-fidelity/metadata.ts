import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'extraction-fidelity',
  title: 'Grade extraction fidelity',
  description:
    'How faithfully does extracted represent the facts in source, without invented, altered, or dropped values, on a five-level rubric?',
  category: 'knowledge',
  tags: ['extraction', 'structured-data', 'fidelity', 'hallucination', 'rubric', 'score'],
  useWhen:
    'You need to grade a structured extraction against its source document before trusting, storing, or acting on the values.',
  related: [
    {
      id: 'field-select',
      reason: 'Use field-select to pick which field a value belongs to before grading the result.',
    },
    {
      id: 'summary-coverage',
      reason:
        'Use summary-coverage when the output is prose that should cover the source, not a set of fields.',
    },
  ],
  limitations: [
    'Grades agreement with source only. It does not check whether source itself is accurate.',
    'Reports a single grade, not which values are wrong or missing. Pair it with per-field checks when you need locations.',
  ],
} satisfies RecipeMetadata;
