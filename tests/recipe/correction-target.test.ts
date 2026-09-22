import { correctionTarget } from '../../recipes/correction-target/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  correctionTarget,
  {
    message: 'The billing email is finance@example.com, not support@example.com.',
    targets: [
      {
        id: 'billing-email',
        text: 'Billing email: support@example.com',
      },
      {
        id: 'shipping-city',
        text: 'Shipping city: Portland',
      },
    ],
  },
  'targets',
  ['context'],
);
