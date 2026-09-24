import { incidentSeverityWording } from '../../recipes/incident-severity-wording/index.js';
import { testScore } from './helpers/score.js';

testScore(
  incidentSeverityWording,
  {
    report:
      'Since 14:05 UTC, about 30% of requests to the search endpoint on the EU shard return 503. Search results fail to load for mobile users in the EU; web checkout, account pages, and all other regions are unaffected. No data loss observed.',
  },
  ['none', 'minor', 'partial', 'major', 'critical'],
  'severity',
);
