import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'objection-kind',
  title: 'Classify sales objection kind',
  description: 'What primary sales objection does message raise?',
  category: 'conversation',
  tags: ['sales', 'crm', 'objection', 'classification', 'deal', 'triage'],
  useWhen:
    'You need to tag prospect replies by objection so reps get the right playbook and pipeline reports show why deals stall.',
  related: [
    {
      id: 'feedback-kind',
      reason:
        'Use feedback-kind to classify general product or service feedback from existing users.',
    },
    {
      id: 'constraint-strength',
      reason: 'Use constraint-strength to grade how binding a stated requirement or limit is.',
    },
  ],
  limitations: [
    'Classifies the primary objection the message states. A reply that mixes several objections is graded by the one it leads with, and stated reasons may not be the real ones.',
  ],
} satisfies RecipeMetadata;
