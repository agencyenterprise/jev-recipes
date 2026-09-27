import { paragraphBoundary } from '../../recipes/paragraph-boundary/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  paragraphBoundary,
  {
    left: 'To finish installing the package, run',
    right: 'the command shown in the next example.',
  },
  ['continue', 'separate', 'unclear'],
  ['before', 'after', 'context'],
);
