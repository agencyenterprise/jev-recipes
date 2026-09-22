import { promiseCheck } from '../../recipes/promise-check/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  promiseCheck,
  {
    reply: 'Your refund is guaranteed.',
    allowedCommitments: 'We may promise to review a refund request. We cannot promise approval.',
  },
  ['within_commitments', 'unsupported', 'unclear'],
);
