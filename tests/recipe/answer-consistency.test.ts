import { answerConsistency } from '../../recipes/answer-consistency/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  answerConsistency,
  {
    firstStatement: 'Guests can export reports.',
    secondStatement: 'Guests cannot export reports.',
  },
  ['consistent', 'conflicting', 'unrelated', 'unclear'],
  ['context'],
);
