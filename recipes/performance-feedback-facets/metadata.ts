import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'performance-feedback-facets',
  title: 'Label the aspects performance feedback addresses',
  description:
    'Which aspects of a musical performance does feedback address: rhythm, pitch or intonation, dynamics, technique, and expression or phrasing?',
  category: 'answer-quality',
  tags: ['music', 'practice', 'feedback', 'education', 'labels', 'multi-label'],
  useWhen:
    'You are building a practice app or lesson tool and want to know which musical aspects a piece of teacher or automated feedback covers, so you can track what a student hears about over time or flag feedback that neglects an aspect.',
  related: [
    {
      id: 'feedback-actionability',
      reason:
        'Use feedback-actionability to grade whether the feedback tells the student what to do, rather than which aspects it covers.',
    },
    {
      id: 'tone-check',
      reason:
        'Use tone-check to judge whether feedback meets a tone requirement such as encouraging or direct.',
    },
  ],
  limitations: [
    'Labels are independent, so feedback can address several aspects or none.',
    'Detects that an aspect is addressed, not whether the comment is correct, fair, or useful.',
    'Does not measure the performance itself. Deciding which aspects a lesson should cover belongs in application code or with the teacher.',
  ],
} satisfies RecipeMetadata;
