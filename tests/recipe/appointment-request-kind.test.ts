import { appointmentRequestKind } from '../../recipes/appointment-request-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  appointmentRequestKind,
  {
    message:
      'Hi, I am scheduled with Dr. Nguyen on Thursday at 2pm but my work shift changed. Is there anything available Friday morning instead?',
  },
  ['schedule', 'reschedule', 'cancel', 'results', 'refill', 'question', 'unclear'],
);
