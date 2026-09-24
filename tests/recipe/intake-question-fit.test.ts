import { intakeQuestionFit } from '../../recipes/intake-question-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  intakeQuestionFit,
  {
    question:
      'To schedule your flu shot, please tell us your date of birth, your insurance provider and member ID, and whether you have ever been treated for depression or anxiety.',
    purpose: 'Schedule a routine flu shot appointment and verify insurance coverage for the visit.',
  },
  ['fits', 'overreaches'],
);
