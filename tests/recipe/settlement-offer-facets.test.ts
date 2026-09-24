import { settlementOfferFacets } from '../../recipes/settlement-offer-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  settlementOfferFacets,
  {
    offer:
      "Re: Claim 44-01927, water damage at 27 Alder Court. Dear Ms. Okafor, we have completed our review and are pleased to offer $18,640.00 in full settlement of this claim. This figure reflects the contractor's repair estimate of $21,140.00, less your $2,500.00 policy deductible. Please sign and return the enclosed acceptance form within 30 days of the date of this letter. By accepting this payment you agree that it constitutes full and final settlement of all claims arising from the 8 March incident and release Northbridge Mutual from any further liability in connection with it. Payment will be issued within 10 business days of receiving your signed form.",
  },
  ['statesAmount', 'statesBasis', 'statesDeadline', 'statesReleaseTerms', 'statesDisputePath'],
);
