import { referenceResolve } from '../../recipes/reference-resolve/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  referenceResolve,
  {
    message: 'Please cancel the hardware order, not my subscription.',
    reference: 'the hardware order',
    candidates: [
      {
        id: 'order',
        text: 'A pending hardware order.',
      },
      {
        id: 'subscription',
        text: 'An active monthly storage subscription.',
      },
    ],
  },
  'candidates',
  ['context'],
);
