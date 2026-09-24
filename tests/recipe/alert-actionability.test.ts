import { alertActionability } from '../../recipes/alert-actionability/index.js';
import { testScore } from './helpers/score.js';

testScore(
  alertActionability,
  {
    alert:
      'HIGH: payments-gateway 5xx rate is 6.4% over the last 5 minutes (threshold 2%) in prod-eu-west-1. Upstream dependency stripe-proxy is returning 502s for 40% of calls.',
  },
  ['noise', 'vague', 'symptom', 'located', 'guided'],
  'actionability',
  ['context'],
);
