import { actionScope } from '../../recipes/action-scope/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  actionScope,
  {
    request: 'Explain why this deployment failed.',
    proposedAction: 'Deploy a replacement release to production.',
  },
  ['within_scope', 'additional_work', 'unclear'],
  ['constraints'],
);
