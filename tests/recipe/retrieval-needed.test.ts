import { retrievalNeeded } from '../../recipes/retrieval-needed/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  retrievalNeeded,
  {
    request: 'Summarize this policy in one sentence.',
    context: 'Customers may cancel their subscription from Account settings.',
  },
  ['needed', 'unnecessary', 'unclear'],
);
