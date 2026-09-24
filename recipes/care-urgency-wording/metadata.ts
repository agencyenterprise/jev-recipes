import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'care-urgency-wording',
  title: "Grade the urgency a patient's wording asks for",
  description:
    "How urgent is the care that message asks for, from routine to emergency, judged on what the patient's wording says rather than on medical assessment?",
  category: 'support',
  tags: ['healthcare', 'patient-message', 'urgency', 'scheduling', 'rubric', 'score'],
  useWhen:
    'You need to sort patient messages into scheduling or response-time queues by the timeline the patient asks for, before or alongside clinical triage handled by protocol.',
  related: [
    {
      id: 'urgency-signal',
      reason:
        'Use urgency-signal when you only need a yes/no check that a message explicitly asks for urgent attention.',
    },
    {
      id: 'handoff',
      reason:
        'Use handoff to decide whether a message should leave the automated flow for a human, such as a nurse line.',
    },
  ],
  limitations: [
    'Grades the urgency the wording asks for, not medical triage. Enforce emergency routing in code by protocol regardless of this result.',
    'Reads stated timing only; a calm message about a serious symptom grades as the patient worded it, and an anxious message about a minor one grades high.',
  ],
} satisfies RecipeMetadata;
