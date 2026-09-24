import { exerciseSelect } from '../../recipes/exercise-select/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  exerciseSelect,
  {
    feedback:
      'You are rushing the sixteenth-note runs in the development section, and the left hand loses its evenness whenever the right hand takes the melody in bars 41 to 56.',
    candidates: [
      {
        id: 'dev-section-metronome',
        text: 'Development section (bars 41 to 56) hands separately with the metronome clicking sixteenths at half tempo, then hands together, raising the tempo 4 bpm after each clean pass.',
      },
      {
        id: 'scales-in-thirds',
        text: 'Major scales in thirds, both hands, four octaves, all keys, at a steady moderate tempo.',
      },
    ],
  },
  'candidates',
  ['goal'],
);
