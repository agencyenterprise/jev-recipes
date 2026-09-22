import { failureKind } from '../../recipes/failure-kind/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  failureKind,
  {
    failure: 'The export was rejected because the report name is missing.',
    categories: [
      {
        id: 'missing-input',
        text: 'A required input was not supplied.',
      },
      {
        id: 'temporary',
        text: 'A temporary service interruption prevented the operation.',
      },
    ],
  },
  'categories',
  ['context'],
);
