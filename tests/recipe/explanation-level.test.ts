import { explanationLevel } from '../../recipes/explanation-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  explanationLevel,
  {
    question: 'A train leaves at 9:40 and travels 150 km at 60 km/h. When does it arrive?',
    answer: 'Time is distance over speed: 150 / 60 = 2.5 hours. 9:40 plus 2h30 is 12:10.',
  },
  ['bare', 'asserted', 'partial', 'complete', 'rigorous'],
  'explanation',
);
