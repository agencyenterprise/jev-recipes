import { answerInvalidation } from '../../recipes/answer-invalidation/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  answerInvalidation,
  {
    claim: 'Guests can export reports.',
    previousEvidence: 'Guests can export reports.',
    updatedEvidence: 'Exporting reports is restricted to workspace owners. Guests cannot export.',
  },
  ['still_supported', 'invalidated', 'unclear'],
);
