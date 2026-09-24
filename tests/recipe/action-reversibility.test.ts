import { actionReversibility } from '../../recipes/action-reversibility/index.js';
import { testScore } from './helpers/score.js';

testScore(
  actionReversibility,
  { action: 'Delete the production customer table without taking a backup first.' },
  ['trivial', 'effortful', 'partial', 'practical', 'irreversible'],
  'reversibility',
  ['context'],
);
