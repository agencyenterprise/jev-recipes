import { draftCompare } from '../../recipes/draft-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(draftCompare, {
  request: 'Explain how to reset a password.',
  firstDraft: 'Select Forgot password on the sign-in page.',
  secondDraft: 'Contact billing to download an invoice.',
  rubric: 'Prefer a direct answer to the requested task.',
});
