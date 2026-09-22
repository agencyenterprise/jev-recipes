import { cacheMatch } from '../../recipes/cache-match/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  cacheMatch,
  {
    question: 'Where can I get my invoices?',
    originalQuestion: 'How do I download invoices?',
    cachedAnswer: 'Open Billing and select Download invoice.',
  },
  ['reusable', 'unsuitable', 'unclear'],
  ['context'],
);
