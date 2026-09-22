import { audienceFit } from '../../recipes/audience-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  audienceFit,
  {
    document: 'Rotate the OAuth refresh token and invalidate the active session grant.',
    audience:
      'A customer unfamiliar with authentication terminology who wants to sign out of all devices.',
  },
  ['appropriate', 'too_technical', 'too_basic', 'unclear'],
);
