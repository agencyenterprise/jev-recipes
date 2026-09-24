import { privacyNoticeFacets } from '../../recipes/privacy-notice-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  privacyNoticeFacets,
  {
    notice:
      'We collect your name and email to provide the service. We share billing details with our payment processor. Contact privacy@example.com with questions.',
  },
  ['statesDataCollected', 'statesPurpose', 'statesRetention', 'statesSharing', 'statesContact'],
);
