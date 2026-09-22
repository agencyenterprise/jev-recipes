import { citationNeeded } from '../../recipes/citation-needed/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  citationNeeded,
  {
    statement: 'Reset links expire after 30 minutes.',
    citationRules:
      'Cite documentation for claims about product behavior. Greetings need no citations.',
  },
  ['needed', 'unnecessary', 'unclear'],
);
