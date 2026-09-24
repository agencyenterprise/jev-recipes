import { actionEffects } from '../../recipes/action-effects/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  actionEffects,
  {
    action:
      'Send the weekly product digest to all 1,240 subscribers on the newsletter list through the SendGrid API, then set last_digest_sent_at to now on each subscriber row in the users table.',
  },
  ['writesData', 'sendsMessage', 'spendsMoney', 'deletesData', 'callsExternal'],
);
