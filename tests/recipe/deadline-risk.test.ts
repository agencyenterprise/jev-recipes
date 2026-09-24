import { deadlineRisk } from '../../recipes/deadline-risk/index.js';
import { testScore } from './helpers/score.js';

testScore(
  deadlineRisk,
  {
    deadline:
      'The migrated customer records must be live in the new CRM by end of day Friday, per the signed contract. It is now Thursday at 6pm.',
    progress:
      'The export from the old system finished Wednesday. The import script rejects about 30% of records with a schema mismatch that nobody has diagnosed yet. The engineer who wrote the field mapping is out until Monday. No fallback or partial go-live has been agreed with the customer.',
  },
  ['none', 'minor', 'moderate', 'high', 'missed'],
  'risk',
);
