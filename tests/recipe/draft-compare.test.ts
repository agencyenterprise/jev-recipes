import { draftCompare } from '../../recipes/draft-compare/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  draftCompare,
  {
    request: 'Explain how to reset a password.',
    firstDraft: 'Select Forgot password on the sign-in page.',
    secondDraft: 'Contact billing to download an invoice.',
    rubric: 'Prefer a direct answer to the requested task.',
  },
  ['first', 'second', 'tie', 'neither', 'unclear'],
);
