import { handoffCompleteness } from '../../recipes/handoff-completeness/index.js';
import { testScore } from './helpers/score.js';

testScore(
  handoffCompleteness,
  {
    item: 'Add rate limiting to the public /search endpoint using the existing RateLimiter middleware. Done when requests over 60 per minute return 429 and the integration test covers it.',
  },
  ['bare', 'goal', 'inputs', 'defined', 'complete'],
  'completeness',
);
