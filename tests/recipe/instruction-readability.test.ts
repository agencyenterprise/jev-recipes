import { instructionReadability } from '../../recipes/instruction-readability/index.js';
import { testScore } from './helpers/score.js';

testScore(
  instructionReadability,
  {
    instructions:
      'Administer 500 mg PO BID with food x 10 days. Do not discontinue prematurely. If a dose is missed, take it as soon as possible unless the next dose is imminent. Contact the clinic for any rash or swelling.',
  },
  ['dense', 'heavy', 'mixed', 'plain', 'clear'],
  'readability',
  ['audience'],
);
