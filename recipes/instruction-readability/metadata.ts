import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instruction-readability',
  title: 'Grade how easy patient instructions are to follow',
  description:
    'How easy are instructions to follow for a general reader, from dense jargon to plain and stepwise?',
  category: 'answer-quality',
  tags: ['healthcare', 'patient-instructions', 'readability', 'plain-language', 'rubric', 'score'],
  useWhen:
    'You are generating or reviewing after-visit instructions, discharge notes, or medication directions and need to catch wording a patient cannot act on.',
  related: [
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to judge whether the whole text suits a named audience beyond how easy the steps are to follow.',
    },
    {
      id: 'tone-check',
      reason:
        'Use tone-check to judge the register and tone of the instructions rather than their readability.',
    },
  ],
  limitations: [
    'Grades readability of the wording, not medical accuracy, completeness, or whether the instructions are right for the patient.',
    'Does not compute a formal reading-grade score; use a readability formula in code if you need a metric.',
  ],
} satisfies RecipeMetadata;
