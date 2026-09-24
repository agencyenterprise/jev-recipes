import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'symptom-facets',
  title: 'Label the symptom facets a patient message states',
  description:
    'Which of these does message state about a symptom: when it began, how bad it is, how long it has lasted, what makes it better or worse, what the patient has already tried?',
  category: 'support',
  tags: ['healthcare', 'intake', 'patient-message', 'labels', 'multi-label', 'facets'],
  useWhen:
    'You need to know which standard intake details a patient message already supplies so you can pre-fill a form or ask only for what is missing.',
  related: [
    {
      id: 'message-facets',
      reason:
        'Use message-facets for the general communicative facets of a message, such as questions, deadlines, and requests.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether to ask the patient a follow-up question about the facets this recipe finds missing.',
    },
  ],
  limitations: [
    'Reports intake completeness only: whether the wording states each facet, not whether the details are accurate or clinically meaningful. It makes no diagnosis or triage judgment.',
    'Labels are independent, so a message can state several facets or none. Parse actual dates, durations, and doses in code.',
  ],
} satisfies RecipeMetadata;
