import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'notice-facets',
  title: 'Label what an official notice states',
  description:
    'Which of these does notice state: an action the recipient must take, a deadline, the consequence of inaction, a contact for questions, a right to appeal?',
  category: 'knowledge',
  tags: ['public-sector', 'notices', 'correspondence', 'labels', 'multi-label', 'plain-language'],
  useWhen:
    'You need several independent checks on a government or institutional notice in one call, to catch letters that tell recipients nothing about what to do, by when, or how to contest a decision before they are sent or when they are received.',
  related: [
    {
      id: 'message-facets',
      reason:
        'Use message-facets for the same presence-check pattern over a general message rather than an official notice.',
    },
    {
      id: 'response-needed',
      reason:
        'Use response-needed to decide whether a message requires a reply at all, rather than which elements a notice states.',
    },
  ],
  limitations: [
    'Each label reports whether the notice states the element, not whether the element is correct, lawful, or adequately explained.',
    'Dates and deadlines are not computed or checked against the notice date. Parse them in code.',
    'Labels are independent, so a notice can carry several, all, or none.',
  ],
} satisfies RecipeMetadata;
