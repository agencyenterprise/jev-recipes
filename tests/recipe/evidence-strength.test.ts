import { evidenceStrength } from '../../recipes/evidence-strength/index.js';
import { testScore } from './helpers/score.js';

testScore(
  evidenceStrength,
  {
    claim: 'Guests can export reports as CSV.',
    evidence: 'Guest accounts may export any report they can view as CSV or PDF.',
  },
  ['none', 'weak', 'moderate', 'strong', 'conclusive'],
  'strength',
);
