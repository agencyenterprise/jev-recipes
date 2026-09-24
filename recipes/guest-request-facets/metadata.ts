import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'guest-request-facets',
  title: 'Label the booking facets a guest request states',
  description:
    'Which of these does request state: travel dates, party size, accessibility needs, a budget, or a special occasion?',
  category: 'support',
  tags: ['hospitality', 'booking', 'intake', 'guest-request', 'labels', 'multi-label', 'facets'],
  useWhen:
    'A reservations or concierge assistant receives a free-form guest inquiry and needs to know which standard booking details are already present so it can pre-fill the request and ask only for what is missing.',
  related: [
    {
      id: 'message-facets',
      reason:
        'Use message-facets for the general communicative facets of a message, such as questions, deadlines, and requests, rather than booking-specific details.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether to ask the guest a follow-up question about the facets this recipe finds missing.',
    },
  ],
  limitations: [
    'Reports only whether the wording states each facet, not whether the dates are available, the party fits a room, or the budget is realistic. Parse actual dates, counts, and amounts in application code.',
    'Labels are independent, so a request can state several facets or none. It does not judge urgency or sentiment.',
  ],
} satisfies RecipeMetadata;
