import { memoryValue } from '../../recipes/memory-value/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  memoryValue,
  {
    fact: 'The user prefers short, direct support replies.',
    purpose: 'Help the user draft customer support replies across sessions.',
  },
  ['ongoing_value', 'task_only', 'incidental', 'unclear'],
  ['context'],
);
