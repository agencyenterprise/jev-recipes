import { evidenceConflict } from '../../recipes/evidence-conflict/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  evidenceConflict,
  {
    question: 'Can guests export reports?',
    firstPassage: 'Guests can export reports.',
    secondPassage: 'Guests cannot export reports.',
  },
  ['compatible', 'conflicting', 'different_scope', 'unclear'],
);
