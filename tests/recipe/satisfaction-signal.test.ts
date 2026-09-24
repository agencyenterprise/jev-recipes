import { satisfactionSignal } from '../../recipes/satisfaction-signal/index.js';
import { testScore } from './helpers/score.js';

testScore(
  satisfactionSignal,
  { message: 'That fixed it, thank you so much for staying on this with me.' },
  ['dissatisfied', 'low', 'neutral', 'satisfied', 'delighted'],
  'satisfaction',
  ['context'],
);
