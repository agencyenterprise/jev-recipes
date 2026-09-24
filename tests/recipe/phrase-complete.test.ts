import { phraseComplete } from '../../recipes/phrase-complete/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  phraseComplete,
  { recentNotes: 'C major. E4 D4 C4 D4 | E4 E4 E4 (half) | D4 D4 E4 D4 | C4 (whole note, held)' },
  ['complete', 'open'],
  'verdict',
  ['meter'],
);
