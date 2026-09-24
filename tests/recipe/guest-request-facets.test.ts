import { guestRequestFacets } from '../../recipes/guest-request-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  guestRequestFacets,
  {
    request:
      "Hello, we are hoping to book two rooms from Friday 14 November to Sunday 16 November for my parents' 40th wedding anniversary. There will be six of us: my parents, my husband and me, and our two teenagers. My father uses a walker, so one of the rooms needs to be step-free with a roll-in shower and close to the elevator. Could you also let us know whether the restaurant can do a small celebration dinner on the Saturday?",
  },
  ['statesDates', 'statesPartySize', 'statesAccessibilityNeeds', 'statesBudget', 'statesOccasion'],
);
