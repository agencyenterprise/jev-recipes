import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'intake-question-fit',
  title: 'Check an intake question against its purpose',
  description: 'Does question ask only for what purpose needs, avoiding unrelated personal detail?',
  category: 'workflow',
  tags: ['healthcare', 'intake', 'forms', 'data-minimization', 'privacy', 'gate'],
  useWhen:
    'You are drafting or reviewing intake form questions and want a check that each one collects only what its stated purpose requires.',
  related: [
    {
      id: 'question-relevance',
      reason:
        'Use question-relevance to check whether a question is on topic for a conversation rather than scoped to a data-collection purpose.',
    },
    {
      id: 'instruction-fit',
      reason:
        'Use instruction-fit to check whether a drafted question follows the form-writing instructions you gave.',
    },
  ],
  limitations: [
    'Judges relevance to the stated purpose only, not legal permissibility, consent requirements, or minimum-necessary compliance under any regulation.',
    'Depends on how precisely purpose is described; a vague purpose makes almost any question fit.',
  ],
} satisfies RecipeMetadata;
