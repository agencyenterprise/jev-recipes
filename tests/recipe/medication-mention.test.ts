import { medicationMention } from '../../recipes/medication-mention/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  medicationMention,
  {
    message:
      'I have been taking 20 mg of lisinopril every morning and started a magnesium supplement last week. Since then I feel dizzy when I stand up. Is that normal, or should I stop one of them?',
  },
  ['mentioned', 'absent'],
);
