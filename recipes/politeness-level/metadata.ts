import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'politeness-level',
  title: 'Grade expressed politeness',
  description: 'How polite is the wording of message toward its recipient, on a five-level rubric?',
  category: 'conversation',
  tags: ['psychology', 'politeness', 'tone', 'courtesy', 'rubric', 'score'],
  useWhen:
    'You need a graded politeness signal to adapt reply tone, flag hostile messages, or audit outgoing drafts.',
  related: [
    {
      id: 'tone-check',
      reason:
        'Use tone-check to verify a draft matches a specified tone rather than grading politeness.',
    },
    {
      id: 'frustration-signal',
      reason: 'Use frustration-signal for a categorical read on expressed frustration.',
    },
  ],
  limitations: [
    "Grades expressed wording, not the writer's attitude or how the recipient will perceive it.",
    'Politeness norms vary by culture and register. The rubric reflects general written conventions.',
  ],
} satisfies RecipeMetadata;
