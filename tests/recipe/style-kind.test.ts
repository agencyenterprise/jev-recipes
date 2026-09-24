import { styleKind } from '../../recipes/style-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  styleKind,
  {
    description:
      'Walking bass in the left hand under extended seventh and ninth chords, swung eighth notes, a ii-V-I turnaround every four bars, right hand improvising around the changes with chromatic approach tones.',
  },
  ['classical', 'jazz', 'blues', 'pop', 'electronic', 'folk', 'unclear'],
);
