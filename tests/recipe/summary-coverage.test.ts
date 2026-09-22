import { summaryCoverage } from '../../recipes/summary-coverage/index.js';
import { testBatch } from './helpers/batch.js';

testBatch(
  summaryCoverage,
  {
    summary: 'We agreed to keep the API unchanged.',
    points: [
      {
        id: 'api',
        text: 'Keep the public API unchanged.',
      },
      {
        id: 'docs',
        text: 'Update the installation instructions.',
      },
    ],
  },
  'points',
  ['preserved', 'partial', 'missing', 'unclear'],
  'preserved',
  'allPreserved',
);
