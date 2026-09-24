import { lossCauseKind } from '../../recipes/loss-cause-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  lossCauseKind,
  {
    narrative:
      "We returned from a long weekend on Monday evening and found the back door forced open, with the frame splintered around the deadbolt. Two laptops, my wife's jewelry box, a camera bag, and the cash we kept in the desk drawer were gone. Drawers were pulled out in every bedroom. We called the police that night and have a report number; the neighbor's doorbell camera shows two people in the yard at around 3 am on Sunday.",
  },
  [
    'weather',
    'fire',
    'water',
    'theft',
    'collision',
    'wear_and_tear',
    'vandalism',
    'other',
    'unclear',
  ],
);
