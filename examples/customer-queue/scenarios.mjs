import { fixture } from '../shared/fixtures.mjs';

export const queueState = {
  seenMessageIds: [],
  contactBlocked: false,
  routes: {
    billing: 'Invoices, charges, and refunds.',
    technical: 'Product failures and technical support.',
  },
  requests: [
    {
      id: 'invoice',
      text: 'The invoice has an unexpected service fee.',
      owner: 'billing',
      handoverCompleted: true,
    },
  ],
  handoffRules: [
    {
      id: 'human-requested',
      description: 'The customer explicitly requests a human representative.',
    },
  ],
  allowedCommitments: 'The billing team can investigate. No callback date or refund is guaranteed.',
};

export const queueFixtures = {
  'route-many': fixture({ default: 'billing' }),
  route: fixture({ route: 'billing' }),
  'contact-opt-out': fixture({ decision: 'none' }),
  'followup-link': fixture({ decision: 'candidate_0' }),
  'response-needed': fixture({ decision: 'reply_needed' }),
  handoff: fixture({ default: 'does_not_match' }),
  'followup-timing': fixture({ decision: 'after_event' }),
  'callback-responsibility': fixture({ decision: 'business' }),
  'promise-check': fixture({ decision: 'within_commitments' }),
};
