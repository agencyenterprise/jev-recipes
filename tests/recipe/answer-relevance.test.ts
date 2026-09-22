import { answerRelevance } from '../../recipes/answer-relevance/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  answerRelevance,
  {
    request: 'How do I reset my password?',
    draft: 'You can download invoices from the Billing page.',
  },
  ['relevant', 'partly_relevant', 'off_topic', 'unclear'],
);
