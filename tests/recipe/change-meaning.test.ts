import { changeMeaning } from '../../recipes/change-meaning/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  changeMeaning,
  {
    before: 'Guests may export reports.',
    after: 'Only workspace owners may export reports.',
  },
  ['meaning_changed', 'editorial_only', 'unclear'],
  ['context'],
);
