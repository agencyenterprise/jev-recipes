import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instrument-report-facets',
  title: 'Label the facets of an instrument repair message',
  description:
    'Which of these does message state about an instrument problem: the instrument and model, the symptom, when it started, recent changes, and the environment it is kept in?',
  category: 'support',
  tags: ['music', 'instruments', 'repair', 'support', 'labels', 'multi-label', 'facets'],
  useWhen:
    'You take in repair or support messages from players and want to know which standard intake details are already supplied so you can pre-fill a ticket or ask only for what is missing.',
  related: [
    {
      id: 'symptom-facets',
      reason:
        "Use symptom-facets for the analogous intake check on a patient's description of a medical symptom.",
    },
    {
      id: 'bug-report-completeness',
      reason:
        'Use bug-report-completeness for software bug reports, where the expected parts are reproduction steps, expected and actual behavior, and environment.',
    },
  ],
  limitations: [
    'Labels are independent, so a message can state several facets or none.',
    'Detects that a detail is stated, not that it is accurate. A model name can be wrong and a stated onset can be misremembered.',
    'Does not diagnose the problem or judge its severity. Parse dates, humidity figures, and model identifiers in application code.',
  ],
} satisfies RecipeMetadata;
