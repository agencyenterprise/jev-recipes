import { instructionClarity } from '../../recipes/instruction-clarity/index.js';
import { testScore } from './helpers/score.js';

testScore(
  instructionClarity,
  { instruction: 'Clean up the flaky tests in the payments module and make sure CI is green.' },
  ['unusable', 'ambiguous', 'gappy', 'clear', 'precise'],
  'clarity',
  ['context'],
);
