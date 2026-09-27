import { callbackResponsibility } from '../../recipes/callback-responsibility/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  callbackResponsibility,
  {
    conversation:
      'Avery: I will call you when the replacement arrives. Sam: Thanks, I will wait for your call.',
    roles: 'Avery is the business representative. Sam is the customer.',
  },
  ['business', 'customer', 'either', 'none', 'unclear'],
);
