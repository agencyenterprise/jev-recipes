import { feedbackActionability } from '../../recipes/feedback-actionability/index.js';
import { testScore } from './helpers/score.js';

testScore(
  feedbackActionability,
  {
    feedback:
      'Your thesis is buried in the fourth sentence. Move it to the opening line so the reader knows the argument up front.',
  },
  ['none', 'vague', 'directional', 'specific', 'complete'],
  'actionability',
);
