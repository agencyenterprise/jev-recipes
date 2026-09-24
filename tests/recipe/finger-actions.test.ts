import { fingerActions } from '../../recipes/finger-actions/index.js';
import { testAssignments } from './helpers/assignments.js';

testAssignments(
  fingerActions,
  {
    music: 'C major, 72 bpm, phrase just ended on the tonic.',
    beat: 'Bar 5, eighth 1',
    fingers: [
      {
        id: 'rh-thumb',
        text: 'Right thumb on C4',
        options: [
          { id: 'c4', text: 'Press C4' },
          { id: 'hold', text: 'Keep C4 sounding' },
        ],
      },
      {
        id: 'rh-index',
        text: 'Right index over D4 and E4',
        options: [
          { id: 'e4', text: 'Press E4' },
          { id: 'd4', text: 'Press D4' },
          { id: 'f4', text: 'Press F4' },
        ],
      },
    ],
  },
  'fingers',
  ['style'],
  'finger',
);
