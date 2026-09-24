import { groundingLevel } from '../../recipes/grounding-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  groundingLevel,
  {
    draft: 'The Starter plan includes 5 GB of storage and unlimited collaborators.',
    evidence: 'Starter plan: 5 GB storage, up to 10 collaborators.',
  },
  ['none', 'weak', 'partial', 'mostly', 'full'],
  'grounding',
);
