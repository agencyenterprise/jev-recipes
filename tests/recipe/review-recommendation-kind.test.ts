import { reviewRecommendationKind } from '../../recipes/review-recommendation-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  reviewRecommendationKind,
  {
    review:
      'The paper addresses an important question and the experimental setup is generally careful. However, the central claim in Section 5 rests on the independence assumption introduced in Section 3, which the authors never test, and the baseline comparison omits the two strongest recent methods. I would need to see the assumption validated and the comparison extended before I could support publication. The writing issues I noted in the margins are secondary and easy to fix.',
  },
  ['accept', 'minor_revision', 'major_revision', 'reject', 'unclear'],
);
