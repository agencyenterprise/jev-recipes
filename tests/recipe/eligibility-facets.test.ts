import { eligibilityFacets } from '../../recipes/eligibility-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  eligibilityFacets,
  {
    statement:
      "I have lived at 214 Elm Street, Apt 2, Dayton, Ohio for about six years. I work part time as a cashier at Riverside Market and bring home around $1,400 a month; my hours were cut in July. There are four of us in the household: me, my wife Rosa, and our two kids, ages 7 and 10. I have attached copies of my driver's license and my Social Security card. Please let me know if you need anything else.",
  },
  [
    'statesResidency',
    'statesIncome',
    'statesHouseholdSize',
    'statesIdentityDocuments',
    'statesPriorBenefits',
  ],
);
