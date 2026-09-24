import { commitmentStrength } from '../../recipes/commitment-strength/index.js';
import { testScore } from './helpers/score.js';

testScore(
  commitmentStrength,
  { statement: 'I will have the revised contract in your inbox by 5pm Thursday.' },
  ['none', 'vague', 'conditional', 'firm', 'binding'],
  'commitment',
  ['context'],
);
