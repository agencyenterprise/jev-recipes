import { buyingIntent } from '../../recipes/buying-intent/index.js';
import { testScore } from './helpers/score.js';

testScore(
  buyingIntent,
  {
    message:
      'We have narrowed it down to you and one other vendor. Does the Team plan include SSO, and what is the annual price for 40 seats?',
  },
  ['none', 'curious', 'evaluating', 'ready', 'committed'],
  'intent',
  ['context'],
);
