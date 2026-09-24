import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'reconciliation-match',
  title: 'Match a ledger record to a statement line',
  description:
    'Do record and statementLine describe the same transaction, judging payee, purpose, and timing wording?',
  category: 'knowledge',
  tags: ['reconciliation', 'accounting', 'bookkeeping', 'matching', 'finance', 'gate'],
  useWhen:
    'You need a yes/no judgment on whether a bookkeeping entry and a bank or card statement line refer to the same transaction, after exact amount and date checks in code have narrowed the candidates.',
  related: [
    {
      id: 'entity-match',
      reason:
        'Use entity-match to decide whether two descriptions name the same organization or person, rather than whether two records describe the same transaction.',
    },
    {
      id: 'ticket-match',
      reason:
        'Use ticket-match to decide whether two support tickets report the same issue, rather than whether a ledger entry matches a statement line.',
    },
  ],
  limitations: [
    'Judges payee, purpose, and timing as worded. Amounts and dates must be compared exactly in code; the recipe does not do arithmetic or calendar math.',
    'Statement descriptors are often abbreviated or use a processor name instead of the merchant, so a different verdict means the wording does not support a match, not that the transactions are proven distinct.',
    'Not a substitute for a completed reconciliation or an audit conclusion.',
  ],
} satisfies RecipeMetadata;
