import { lengthFit } from '../../recipes/length-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  lengthFit,
  {
    request: 'What is the capital of Australia? One word is fine.',
    response: 'Canberra.',
  },
  ['short', 'fits', 'long', 'unclear'],
);
