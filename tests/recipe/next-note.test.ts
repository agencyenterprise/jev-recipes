import { nextNote } from '../../recipes/next-note/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  nextNote,
  {
    recentNotes: 'C4 E4 G4 E4 D4',
    candidates: [
      { id: 'c5', text: 'C5 (octave leap up to the tonic)' },
      { id: 'b3', text: 'B3 (leading tone just below)' },
    ],
  },
  'candidates',
  ['key', 'style'],
);
