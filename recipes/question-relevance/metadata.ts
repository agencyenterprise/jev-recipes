import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'question-relevance',
  title: 'Check interview question relevance',
  description:
    'Does question ask only about matters relevant to the requirements of role, rather than personal circumstances unrelated to the work?',
  category: 'workflow',
  tags: ['recruiting', 'interview', 'screening', 'fairness', 'questions'],
  useWhen:
    'You generate or review screening and interview questions and want to flag ones that stray from the job into personal territory before they reach a candidate.',
  related: [
    {
      id: 'question-leading',
      reason:
        'Use question-leading to check whether a question steers the candidate toward an answer.',
    },
    {
      id: 'instruction-fit',
      reason:
        'Use instruction-fit to check whether a written policy or rubric covers a given task.',
    },
  ],
  limitations: [
    'Not legal advice. Which topics are prohibited varies by jurisdiction and belongs in application policy.',
    'Judges relevance to the stated role only; a relevant question can still be poorly worded or leading.',
    'Cannot see how the interviewer will use the answer, only what the question asks.',
  ],
} satisfies RecipeMetadata;
