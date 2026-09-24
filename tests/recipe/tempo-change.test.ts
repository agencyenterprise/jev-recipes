import { tempoChange } from '../../recipes/tempo-change/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  tempoChange,
  {
    context:
      "Three chat messages in the last minute: 'pick it up a little', 'faster!!', and 'this is dragging'. No one asked for it to stay slow. Stream goal: follow chat when requests agree.",
    recentMaterial:
      'Slow ballad in E-flat major at about 60 bpm, half notes and quarter notes in the left hand, sparse melody, moderate dynamics, held for the last two minutes.',
  },
  ['slower', 'same', 'faster', 'unclear'],
);
