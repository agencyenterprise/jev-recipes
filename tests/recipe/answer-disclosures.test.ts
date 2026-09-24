import { answerDisclosures } from '../../recipes/answer-disclosures/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  answerDisclosures,
  {
    draft:
      'Based on the pricing page, Team includes SSO. I am not certain this applies to older accounts.',
  },
  ['statesUncertainty', 'statesLimitations', 'citesSources', 'statesAssumptions'],
);
