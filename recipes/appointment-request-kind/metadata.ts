import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'appointment-request-kind',
  title: "Classify a patient's appointment request",
  description:
    'What does the patient primarily want from message: to schedule, reschedule, or cancel an appointment, get results, get a refill, or ask a question?',
  category: 'support',
  tags: ['healthcare', 'patient-message', 'scheduling', 'intent', 'routing', 'choice'],
  useWhen:
    'You need to route incoming patient portal messages or voicemail transcripts to the scheduling, results, or pharmacy queue by the main thing the patient asks for.',
  related: [
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent for the general communicative purpose of a message outside the appointment domain.',
    },
    {
      id: 'cancellation-check',
      reason:
        'Use cancellation-check when you only need to know whether a message cancels something.',
    },
  ],
  limitations: [
    'Returns the primary request only. A message that both cancels and asks a question gets one label; split multi-request messages in code.',
    'Does not verify that the referenced appointment, prescription, or test exists in your system or belongs to the sender.',
  ],
} satisfies RecipeMetadata;
