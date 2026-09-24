import { claimFacets } from '../../recipes/claim-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  claimFacets,
  {
    claim:
      'On the night of Sunday 8 March, sometime after we went to bed around 11 pm, a pipe in the upstairs bathroom at our home at 27 Alder Court burst. By the time we woke at 6 am, water had come through the ceiling of the living room directly below. The living room ceiling plaster has collapsed in two places, the hardwood floor is warped across roughly half the room, and the sofa and a wool rug are soaked. We shut off the main and called a plumber, who replaced the split section of pipe that morning.',
  },
  ['statesWhen', 'statesWhere', 'statesCause', 'statesDamages', 'statesEvidence'],
);
