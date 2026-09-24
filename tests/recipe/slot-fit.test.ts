import { slotFit } from '../../recipes/slot-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  slotFit,
  {
    proposal: 'How about Friday at 3 PM for the kickoff call?',
    constraints: 'Weekday afternoons from 1 PM to 5 PM, except Fridays.',
  },
  ['fits', 'violates'],
  'verdict',
);
