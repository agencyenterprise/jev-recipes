import { continuationCompare } from '../../recipes/continuation-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(
  continuationCompare,
  {
    context:
      'G major, 4/4. Opening motif: G4 A4 B4 D5 | B4 A4 G4 (half). A rising line to the fifth answered by a stepwise descent home.',
    firstContinuation:
      'D5 E5 F#5 A5 | F#5 E5 D5 (half). The motif transposed up a fifth, same rhythm, same rise-and-fall contour.',
    secondContinuation:
      'C#4 (eighth) G#5 (eighth) Bb3 (quarter) rest | Eb5 (dotted half). Wide chromatic leaps in a new, jagged rhythm.',
  },
  ['style'],
);
