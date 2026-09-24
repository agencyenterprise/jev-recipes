import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'repetition-level',
  title: 'Grade how repetitive recent material is',
  description: 'How repetitive is recentMaterial, from varied to stuck on one idea?',
  category: 'workflow',
  tags: ['music', 'generation', 'repetition', 'monitoring', 'score', 'composition'],
  useWhen:
    'A generation loop such as an infinite piano player should notice when it has fallen into a loop or frozen on one figure, so it can inject variation or change direction.',
  related: [
    {
      id: 'repeated-attempt',
      reason:
        'Use repeated-attempt to check whether one proposed attempt repeats a previous approach to a task, rather than grading the repetition across a stretch of music.',
    },
    {
      id: 'progress-stall',
      reason:
        'Use progress-stall to detect an agent circling on a task objective, not a melody circling on one figure.',
    },
  ],
  limitations: [
    'Grades repetition as written in the note names, rhythms, and annotations. It does not detect transpositions, inversions, or rhythmic augmentations exactly; describe them in the text when they matter.',
    'Repetition is not a fault in itself. Ostinatos, riffs, and minimalism repeat by design, so the threshold for intervening belongs in application code.',
    'Only the supplied material is graded; earlier material the caller left out does not count.',
  ],
} satisfies RecipeMetadata;
