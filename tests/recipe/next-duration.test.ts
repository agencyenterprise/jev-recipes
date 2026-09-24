import { nextDuration } from '../../recipes/next-duration/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  nextDuration,
  {
    meter: '3/4',
    recentRhythm: 'quarter quarter quarter | quarter quarter',
    candidates: [
      { id: 'quarter', text: 'quarter note (keeps the one-two-three)' },
      { id: 'half', text: 'half note (held across the bar line)' },
    ],
  },
  'candidates',
  ['style'],
);
