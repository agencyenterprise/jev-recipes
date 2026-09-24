import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'privacy-notice-facets',
  title: 'Label the statements in a privacy notice',
  description:
    'Which of these does notice state: what data is collected, why it is used, how long it is kept, who it is shared with, how to contact the controller?',
  category: 'knowledge',
  tags: ['privacy', 'compliance', 'notice', 'labels', 'multi-label'],
  useWhen:
    'You need several independent yes/no checks on a privacy notice in one call, to spot missing statements before a review or publication.',
  related: [
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether a request about the notice is too ambiguous to answer, rather than what the notice states.',
    },
    {
      id: 'pii-presence',
      reason:
        'Use pii-presence to detect personal data in a text rather than statements about how personal data is handled.',
    },
  ],
  limitations: [
    'Each label reports the presence of a statement, not its legal adequacy, accuracy, or compliance with any regulation.',
    'Labels are independent, so a notice can carry several or none.',
  ],
} satisfies RecipeMetadata;
