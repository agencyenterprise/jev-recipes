import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'persuasion-technique',
  title: 'Identify a persuasion technique',
  description: 'Which persuasion technique, if any, does the wording of message primarily use?',
  category: 'conversation',
  tags: ['psychology', 'persuasion', 'influence', 'rhetoric', 'marketing', 'annotation'],
  useWhen:
    'You need to annotate or flag how a message tries to persuade, for moderation, research, or review of outgoing drafts.',
  related: [
    {
      id: 'motivation-source',
      reason:
        'Use motivation-source to classify a stated reason for acting rather than a technique aimed at a reader.',
    },
    {
      id: 'question-leading',
      reason: 'Use question-leading to detect a question that steers toward a particular answer.',
    },
  ],
  limitations: [
    "Labels expressed wording, not the writer's intent, honesty, or the effect on readers.",
    'Returns the single dominant technique. Messages that combine several collapse to one or to unclear.',
  ],
} satisfies RecipeMetadata;
