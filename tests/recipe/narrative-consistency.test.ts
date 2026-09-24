import { narrativeConsistency } from '../../recipes/narrative-consistency/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  narrativeConsistency,
  {
    narrative:
      'I was at the office all afternoon on Thursday and got home around 7 pm to find the kitchen flooded. The dishwasher supply hose had split. I heard the hose burst at about 2 pm and shut off the water right away, so the water only ran for a few minutes. Even so, the water reached the hallway and the two bedrooms, and the flooring in all three rooms will need replacing. Nothing outside the kitchen was affected.',
  },
  ['consistent', 'contradictory'],
);
