import { ageAppropriateness } from '../../recipes/age-appropriateness/index.js';
import { testScore } from './helpers/score.js';

testScore(
  ageAppropriateness,
  {
    content: 'The two friends raced their bikes down the hill, laughing as the wind whipped past.',
  },
  ['everyone', 'children', 'teens', 'mature', 'adults'],
  'rating',
  ['context'],
);
