import { actionCompare } from '../../recipes/action-compare/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(
  actionCompare,
  {
    goal: 'Find out why the nightly export failed.',
    firstAction: 'Read the job log.',
    secondAction: 'Re-run the job now.',
  },
  ['constraints'],
);
