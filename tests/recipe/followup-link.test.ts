import { followupLink } from '../../recipes/followup-link/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  followupLink,
  {
    message: 'Can you make that explanation shorter?',
    requests: [
      {
        id: 'reset',
        text: 'Explain how password resets work.',
      },
      {
        id: 'invoice',
        text: 'Download my invoice.',
      },
    ],
  },
  'requests',
  ['context'],
);
