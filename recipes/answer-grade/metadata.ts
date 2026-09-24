import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-grade',
  title: 'Grade an answer against a rubric',
  description:
    'How well does answer meet rubric as a response to question, on a five-level rubric from no credit to full credit?',
  category: 'answer-quality',
  tags: ['education', 'grading', 'rubric', 'assessment', 'score'],
  useWhen:
    'You grade free-text answers against a written rubric and want a graded level with a confidence you can route to a human grader when low.',
  related: [
    {
      id: 'draft-compare',
      reason:
        'Use draft-compare to rank two answers against the same rubric instead of grading one.',
    },
    {
      id: 'grounding-level',
      reason:
        'Use grounding-level when the criterion is fidelity to a source passage rather than a rubric.',
    },
  ],
  limitations: [
    'Grades against the supplied rubric only. A vague rubric yields a vague grade.',
    'Does not check factual accuracy beyond what the rubric states; a confidently wrong answer can meet a weak rubric.',
    'The score is an expected value over levels. Map it to points or letters in application code.',
  ],
} satisfies RecipeMetadata;
