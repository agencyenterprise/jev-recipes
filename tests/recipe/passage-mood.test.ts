import { passageMood } from '../../recipes/passage-mood/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  passageMood,
  {
    passage:
      'D minor, slow tempo around 52 bpm, melody in the low-middle register moving mostly by step and descending at the end of each phrase, sustained chords in the left hand, dynamics piano throughout, frequent suspensions that resolve downward.',
  },
  ['happy', 'sad', 'calm', 'energetic', 'tense', 'romantic', 'unclear'],
);
