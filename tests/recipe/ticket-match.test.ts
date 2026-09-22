import { ticketMatch } from '../../recipes/ticket-match/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  ticketMatch,
  {
    firstTicket: 'My workspace export fails with error EXPORT_TIMEOUT.',
    secondTicket: 'Exports also time out with EXPORT_TIMEOUT in another workspace.',
  },
  ['same_issue', 'related', 'different', 'unclear'],
  ['context'],
);
