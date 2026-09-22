import { memoryRelation } from '../../recipes/memory-relation/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  memoryRelation,
  {
    existingMemory: 'The project uses npm.',
    newFact: 'We have switched this project from npm to pnpm.',
  },
  ['repeats', 'supplements', 'updates', 'conflicts', 'unrelated', 'unclear'],
  ['context'],
);
