import { dawRequestKind } from '../../recipes/daw-request-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  dawRequestKind,
  {
    request:
      'Quantize the drum track to sixteenth notes from bar 9 to bar 24, but leave the hi-hat lane alone.',
  },
  ['record', 'edit', 'mix', 'effect', 'arrange', 'export', 'unclear'],
);
