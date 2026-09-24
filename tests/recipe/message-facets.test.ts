import { messageFacets } from '../../recipes/message-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  messageFacets,
  {
    message: 'Following up on ticket 4821: the export still fails. Can you escalate before Friday?',
  },
  ['asksQuestion', 'reportsProblem', 'requestsAction', 'statesDeadline', 'referencesPriorContact'],
  ['context'],
);
