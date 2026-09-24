import { disputeKind } from '../../recipes/dispute-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  disputeKind,
  {
    message:
      'I cancelled my Pro plan on August 28th and got the confirmation email, but my card was charged $49 again on September 1st. Please reverse it and confirm the account is actually closed this time.',
  },
  [
    'duplicate_charge',
    'wrong_amount',
    'unrecognized_charge',
    'refund_not_received',
    'cancellation_not_honored',
    'other',
    'unclear',
  ],
);
