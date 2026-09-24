import { forecastConfidenceWording } from '../../recipes/forecast-confidence-wording/index.js';
import { testScore } from './helpers/score.js';

testScore(
  forecastConfidenceWording,
  {
    statement:
      'Revenue will hit $4.2M next quarter and the stock is going to double by year end. This is the bottom, so anyone waiting is leaving money on the table.',
  },
  ['speculative', 'hedged', 'balanced', 'confident', 'asserted'],
  'certainty',
);
