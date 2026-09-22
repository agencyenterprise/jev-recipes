import { answerCoverage } from '../../recipes/answer-coverage/index.js';
import { testBatch } from './helpers/batch.js';

testBatch(
  answerCoverage,
  {
    draft: 'Select Forgot password on the sign-in page.',
    questions: [
      {
        id: 'reset',
        text: 'How do I reset my password?',
      },
      {
        id: 'expiry',
        text: 'When does the link expire?',
      },
    ],
  },
  'questions',
  ['answered', 'partial', 'missing', 'unclear'],
  'answered',
  'allAnswered',
);
