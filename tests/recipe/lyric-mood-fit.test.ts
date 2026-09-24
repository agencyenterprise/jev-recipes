import { lyricMoodFit } from '../../recipes/lyric-mood-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  lyricMoodFit,
  {
    lyrics:
      "Hands up, we don't stop till the sun comes up\nBass in the trunk and the whole crew showed up\nNo sleep tonight, turn the lights down low\nOne more round and then we go, go, go",
    music:
      'Slow, sparse piano ballad in D minor at 62 bpm with long sustained chords and a single cello line, written to underscore a grieving scene in a short film.',
  },
  ['fits', 'clashes'],
);
