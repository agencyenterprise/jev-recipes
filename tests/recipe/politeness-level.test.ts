import { politenessLevel } from '../../recipes/politeness-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  politenessLevel,
  {
    message:
      'Hi Priya, thanks for turning this around so quickly. Could you also attach the invoice?',
  },
  ['hostile', 'curt', 'neutral', 'courteous', 'deferential'],
  'politeness',
  ['context'],
);
