import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'grounding-level',
  title: 'Grade draft grounding',
  description:
    'How much of the substantive content in draft is backed by evidence, on a five-level rubric?',
  category: 'answer-quality',
  tags: ['grounding', 'hallucination', 'evidence', 'rag', 'rubric', 'score'],
  useWhen:
    'You need one graded measure of how well a generated answer sticks to its retrieved sources before sending or ranking it.',
  related: [
    {
      id: 'verify',
      reason: 'Use verify for a supported, contradicted, or unsupported verdict on a single claim.',
    },
    {
      id: 'answer-relevance',
      reason:
        'Use answer-relevance to check that the draft addresses the question, not just the sources.',
    },
  ],
  limitations: [
    'Reports how much is grounded, not which statements are unsupported. Use verify per claim to locate them.',
    'Grades support from the supplied evidence only. A true statement from outside knowledge still counts as unsupported.',
  ],
} satisfies RecipeMetadata;
