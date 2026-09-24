import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'exercise-select',
  title: 'Select the practice exercise that addresses feedback',
  description:
    "Which candidate practice exercise in candidates best addresses the problems raised in feedback, given the player's goal?",
  category: 'workflow',
  tags: ['music', 'practice', 'exercises', 'education', 'selection', 'recommendation'],
  useWhen:
    "You are building a practice app that turns a teacher's or an automated assessor's feedback into a concrete assignment chosen from your own exercise library.",
  related: [
    {
      id: 'choose-action',
      reason:
        'Use choose-action to pick the next step from a list of general actions, rather than a practice exercise from an exercise library.',
    },
    {
      id: 'troubleshooting-fit',
      reason:
        'Use troubleshooting-fit to check whether one supplied procedure addresses a reported problem, rather than to pick the best of several.',
    },
  ],
  limitations: [
    'Chooses among the supplied candidates only; it does not invent exercises or judge whether the library is adequate.',
    "Judges fit to the problems as worded in feedback. It does not know the player's history, schedule, or physical limits.",
    'Supply 1 to 50 candidates, each with a unique non-empty ID and non-empty text.',
  ],
} satisfies RecipeMetadata;
