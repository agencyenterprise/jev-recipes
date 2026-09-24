import { questionRelevance } from '../../recipes/question-relevance/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  questionRelevance,
  {
    question:
      'Walk me through how you handled a production incident where the root cause was unclear.',
    role: 'Site Reliability Engineer: production operations, incident response, weekly on-call rotation.',
  },
  ['relevant', 'unrelated'],
);
