import { processCustomerQueue } from './workflow.mjs';
import { queueFixtures, queueState } from './scenarios.mjs';
import { fixture } from '../shared/fixtures.mjs';
import { proposeClarification } from './clarification.mjs';

const live = process.argv.includes('--live');
if (process.argv.slice(2).some((arg) => arg !== '--live'))
  throw new Error('Usage: node examples/customer-queue/run.mjs [--live]');
const options = live ? { live: true, model: 'jev-1.13.0' } : { fixtures: queueFixtures };
const callback = await processCustomerQueue(
  queueState,
  [
    {
      id: 'callback',
      text: 'Please call me once billing finishes investigating.',
      context: 'Customer asked about the fee on the invoice. Business: Billing will investigate.',
      proposedReply: 'The billing team can investigate the fee.',
    },
  ],
  options,
);
const acknowledgment = await processCustomerQueue(
  callback.state,
  [
    {
      id: 'thanks',
      text: 'Thanks for passing that on.',
      context: 'Business: Billing has your invoice question.',
    },
  ],
  live
    ? options
    : {
        fixtures: { ...queueFixtures, 'response-needed': fixture({ decision: 'no_reply_needed' }) },
      },
);
const optOut = await processCustomerQueue(
  acknowledgment.state,
  [{ id: 'stop-contact', text: 'Stop contacting me on every channel.' }],
  live
    ? options
    : { fixtures: { ...queueFixtures, 'contact-opt-out': fixture({ decision: 'all_contact' }) } },
);
const clarification = await proposeClarification(
  {
    request: 'Invoice 123 has a duplicate charge.',
    requirements: [
      { id: 'invoice', description: 'Invoice number' },
      { id: 'problem', description: 'The problem to investigate' },
    ],
    questions: { invoice: 'Which invoice number?', problem: 'What is wrong with the invoice?' },
  },
  live ? options : { fixtures: { clarify: fixture({ default: 'present' }) } },
);
console.log(
  JSON.stringify(
    {
      mode: live ? 'live-decisions' : 'fixture',
      note: 'Only proposed next steps are returned. No customer messages are sent. Fixtures demonstrate control flow, not accuracy.',
      callback,
      acknowledgment,
      optOut,
      clarification,
    },
    null,
    2,
  ),
);
