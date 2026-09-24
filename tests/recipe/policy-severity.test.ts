import { policySeverity } from '../../recipes/policy-severity/index.js';
import { testScore } from './helpers/score.js';

testScore(
  policySeverity,
  {
    content: 'This seller shipped late twice. Avoid them.',
    policy: 'Posts may criticize sellers but must not insult members or share personal details.',
  },
  ['none', 'minor', 'moderate', 'serious', 'severe'],
  'severity',
);
