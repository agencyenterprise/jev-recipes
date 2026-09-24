import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'consent-request',
  title: 'Detect an explicit consent request',
  description:
    'Does text explicitly ask the reader for agreement or permission before something proceeds?',
  category: 'conversation',
  tags: ['consent', 'compliance', 'privacy', 'wording', 'gate'],
  useWhen:
    'You need a yes/no check that a message, prompt, or notice actually asks for consent instead of announcing or assuming it before an action proceeds.',
  related: [
    {
      id: 'confirmation-match',
      reason:
        'Use confirmation-match to check whether a reply actually grants the consent that was requested.',
    },
    {
      id: 'promise-check',
      reason:
        'Use promise-check to detect commitments the text makes to the reader rather than permission it asks of them.',
    },
  ],
  limitations: [
    'Detects that agreement is asked for, not whether the request is clear, specific, or freely given enough to count as valid consent under any law.',
    'Judges the supplied text alone. It does not know whether the action was in fact gated on the answer.',
  ],
} satisfies RecipeMetadata;
