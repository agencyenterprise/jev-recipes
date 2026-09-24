import { moodRequest } from '../../recipes/mood-request/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  moodRequest,
  { message: 'long day, can we get something soft and dreamy? trying to wind down before bed' },
  ['happy', 'sad', 'calm', 'energetic', 'tense', 'romantic', 'unclear'],
);
