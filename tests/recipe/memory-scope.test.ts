import { memoryScope } from '../../recipes/memory-scope/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  memoryScope,
  {
    fact: 'Use two-space indentation in this repository.',
    context: 'The user is describing the conventions for the billing service repository.',
  },
  ['user', 'project', 'task', 'session', 'unclear'],
);
