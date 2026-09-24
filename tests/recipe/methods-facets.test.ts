import { methodsFacets } from '../../recipes/methods-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  methodsFacets,
  {
    methods:
      'We recruited 312 undergraduates (mean age 19.4, 58% women) from the university psychology participant pool between March and May 2023. Each participant completed the task in a single 40-minute lab session. Responses were analyzed with mixed-effects logistic regression in R using lme4, with participant as a random intercept and condition as a fixed effect. The hypotheses, design, and analysis plan were preregistered on OSF before data collection began.',
  },
  [
    'statesSampleSize',
    'statesDataSource',
    'statesAnalysisMethod',
    'statesLimitations',
    'statesPreregistration',
  ],
);
