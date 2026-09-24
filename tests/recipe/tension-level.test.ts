import { tensionLevel } from '../../recipes/tension-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  tensionLevel,
  {
    progression:
      'Am - F - Dm7 - G7 - G7(b9) with the melody suspended on C over the bass, held for two full bars and swelling (current chord)',
  },
  ['resolved', 'low', 'moderate', 'high', 'peak'],
  'tension',
  ['key'],
);
