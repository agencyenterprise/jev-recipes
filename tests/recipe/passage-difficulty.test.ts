import { passageDifficulty } from '../../recipes/passage-difficulty/index.js';
import { testScore } from './helpers/score.js';

testScore(
  passageDifficulty,
  {
    passage:
      'Continuous sixteenth-note arpeggios across all four strings at quarter note = 144, in E-flat major, moving from first position up to seventh position and back every two bars, with string crossings on every beat and a two-octave leap into the final bar.',
  },
  ['beginner', 'easy', 'intermediate', 'advanced', 'virtuoso'],
  'difficulty',
  ['instrument'],
);
