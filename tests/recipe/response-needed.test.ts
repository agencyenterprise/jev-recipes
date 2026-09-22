import { responseNeeded } from '../../recipes/response-needed/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  responseNeeded,
  {
    message: 'Thanks, that solved it!',
  },
  ['reply_needed', 'no_reply_needed', 'unclear'],
  ['context'],
);
