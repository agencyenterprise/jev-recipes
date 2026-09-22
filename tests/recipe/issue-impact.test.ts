import { issueImpact } from '../../recipes/issue-impact/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  issueImpact,
  {
    message: 'I cannot sign in, so I cannot access any of my reports.',
  },
  ['blocked', 'degraded', 'cosmetic', 'unclear'],
  ['context'],
);
