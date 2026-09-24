import { dynamicChange } from '../../recipes/dynamic-change/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  dynamicChange,
  {
    context:
      "Two chat messages: 'I'm studying, could you keep it quieter?' and 'seconded, the big chords are a lot'. No requests for more volume in the last five minutes. Stream goal: follow chat when requests agree.",
    recentMaterial:
      'Forte chords in both hands, octaves in the bass, accented downbeats, marked fortissimo for the last eight bars, sustain pedal held through each bar.',
  },
  ['softer', 'same', 'louder', 'unclear'],
);
