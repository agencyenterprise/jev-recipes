import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'memory-subject',
  title: 'Identify whom a memory describes',
  description:
    'Label whether one candidate memory describes the user, someone else, or a group including the user.',
  category: 'memory',
  tags: [
    'memory',
    'whose memory',
    'someone else',
    'subject attribution',
    'personalization',
    'quoted speaker',
  ],
  useWhen: 'You need to avoid treating a fact about someone else as a fact about the user.',
  related: [
    {
      id: 'memory-scope',
      reason:
        'Use memory-scope to identify where a fact applies after identifying whom it describes.',
    },
    {
      id: 'attribution-match',
      reason:
        'Use attribution-match to check who said or endorsed a statement, rather than whom the statement describes.',
    },
    {
      id: 'preference-kind',
      reason:
        'Use preference-kind to distinguish a lasting preference from a temporary instruction.',
    },
  ],
  limitations: [
    'Requires an identified user and enough speaker context to resolve references; it does not infer a user from an account or session.',
    'Subject attribution does not establish truth, actuality, permanence, consent, or permission to store a memory.',
    'Classifies one atomic statement; it does not extract, split, rewrite, or persist memories.',
  ],
} satisfies RecipeMetadata;
