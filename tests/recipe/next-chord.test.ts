import { nextChord } from '../../recipes/next-chord/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  nextChord,
  {
    progression: 'C - Am - F - G',
    candidates: [
      { id: 'c', text: 'C (return to the tonic)' },
      { id: 'am', text: 'Am (deceptive move to the submediant)' },
    ],
  },
  'candidates',
  ['key', 'style'],
);
