import { evidenceNovelty } from '../../recipes/evidence-novelty/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  evidenceNovelty,
  {
    question: 'How do I reset my password and when does the link expire?',
    passage: 'Reset links expire after 30 minutes.',
    existingEvidence: [
      {
        id: 'steps',
        text: 'Select Forgot password to receive a reset link.',
      },
    ],
  },
  ['adds_information', 'repeats_information', 'irrelevant', 'unclear'],
);
