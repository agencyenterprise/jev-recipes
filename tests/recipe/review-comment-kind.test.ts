import { reviewCommentKind } from '../../recipes/review-comment-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  reviewCommentKind,
  {
    comment:
      'This returns undefined when the list is empty because items[0] is read before the length check.',
  },
  ['bug', 'design', 'style', 'question', 'nit', 'praise', 'unclear'],
  ['context'],
);
