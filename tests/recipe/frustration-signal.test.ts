import { frustrationSignal } from '../../recipes/frustration-signal/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  frustrationSignal,
  {
    message: 'This is the third time I have asked. It is frustrating to keep repeating myself.',
  },
  ['expressed', 'not_expressed', 'unclear'],
  ['context'],
);
