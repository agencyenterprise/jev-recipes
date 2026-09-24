import { financialAdviceSignal } from '../../recipes/financial-advice-signal/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  financialAdviceSignal,
  {
    text: 'Honestly, at your age you should just put the whole $20k into VTI and forget about it. Bonds are a waste right now. Sell the individual tech stocks you mentioned and move that money over too.',
  },
  ['advice', 'informational'],
);
