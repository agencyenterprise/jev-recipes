import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'format-fit',
  title: 'Check requested format compliance',
  description:
    'Does response follow the structure or format request explicitly asks for, such as a list, table, JSON, item count, sections, or language?',
  category: 'answer-quality',
  tags: ['format', 'structure', 'instruction-following', 'output', 'gate', 'evaluation'],
  useWhen:
    'You need a yes/no check that a generated response honored the format the prompt or user explicitly asked for.',
  related: [
    {
      id: 'instruction-fit',
      reason:
        'Use instruction-fit to check the response against all instructions, not only format.',
    },
    {
      id: 'tone-check',
      reason:
        'Use tone-check when the requirement is about voice or register rather than structure.',
    },
  ],
  limitations: [
    'Judges structure semantically. Strict machine formats such as JSON or CSV should also be validated in code.',
    'Checks only format instructions stated in the request. It does not judge content accuracy or implied conventions.',
  ],
} satisfies RecipeMetadata;
