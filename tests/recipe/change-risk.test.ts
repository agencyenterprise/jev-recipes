import { changeRisk } from '../../recipes/change-risk/index.js';
import { testScore } from './helpers/score.js';

testScore(
  changeRisk,
  { change: 'Fix a typo in the README installation section.' },
  ['negligible', 'low', 'moderate', 'high', 'critical'],
  'risk',
  ['context'],
);
