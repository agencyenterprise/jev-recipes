import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'action-compare',
  title: 'Compare two candidate actions',
  description: 'Which of firstAction and secondAction better advances goal within constraints?',
  category: 'workflow',
  tags: ['agent', 'planning', 'comparison', 'pairwise', 'action', 'decision'],
  useWhen:
    'An agent has narrowed to two next steps and needs a head-to-head preference under the stated goal and constraints.',
  related: [
    {
      id: 'choose-action',
      reason: 'Use choose-action to select one action from a longer list of candidates.',
    },
    {
      id: 'action-scope',
      reason: 'Use action-scope to check whether a single action stays within the requested work.',
    },
  ],
  limitations: [
    'Compares two described actions. It does not execute, simulate, or authorize either one.',
    'Constraints are judged as written; permissions and safety rules belong in application code.',
  ],
} satisfies RecipeMetadata;
