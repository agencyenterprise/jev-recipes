import { tripPurposeKind } from '../../recipes/trip-purpose-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  tripPurposeKind,
  {
    message:
      "We are moving to Lisbon for good at the end of October. My partner's job transfers her there permanently and the kids start school in January. I need one-way flights for the four of us and somewhere to stay for the first three weeks until our long-term lease begins on 20 November.",
  },
  ['business', 'leisure', 'family_visit', 'medical', 'relocation', 'event', 'unclear'],
  ['context'],
);
