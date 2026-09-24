import { reportFacets } from '../../recipes/report-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  reportFacets,
  {
    report:
      'Migrated 4 of 6 endpoints; all 38 tests pass. The last two are blocked on the auth rewrite. Next I will stub the middleware.',
  },
  ['statesOutcome', 'providesEvidence', 'statesBlockers', 'statesNextStep', 'raisesQuestions'],
);
