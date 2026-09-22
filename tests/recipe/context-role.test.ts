import { contextRole } from '../../recipes/context-role/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  contextRole,
  {
    question: 'How do I reset my password?',
    passage: 'Passwords help protect access to accounts.',
  },
  ['direct_evidence', 'background', 'unrelated', 'unclear'],
);
