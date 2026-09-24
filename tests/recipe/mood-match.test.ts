import { moodMatch } from '../../recipes/mood-match/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  moodMatch,
  {
    requestedMood: 'calm, something to relax to',
    passage:
      'Fast tempo around 160 bpm, driving repeated sixteenth notes in the left hand, diminished and augmented chords with frequent chromatic shifts, sudden accents on off-beats, fortissimo throughout, melody leaping in the high register.',
  },
  ['matches', 'mismatched'],
);
