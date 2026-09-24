import { emotionKind } from '../../recipes/emotion-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  emotionKind,
  {
    message:
      'I am really worried about tomorrow. If the migration fails again we lose the whole weekend.',
  },
  ['joy', 'anger', 'sadness', 'fear', 'surprise', 'neutral', 'unclear'],
  ['context'],
);
