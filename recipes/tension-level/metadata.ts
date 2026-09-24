import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tension-level',
  title: 'Grade harmonic tension',
  description:
    'How much harmonic tension does the current point in progression carry, from fully resolved to a peak demanding resolution, given any key supplied?',
  category: 'workflow',
  tags: ['music', 'harmony', 'tension', 'generation', 'score', 'composition'],
  useWhen:
    'A generation loop or accompaniment engine wants to know whether the harmony is at rest, building, or begging for resolution, so it can decide whether to release, hold, or push further.',
  related: [
    {
      id: 'urgency-signal',
      reason:
        'Use urgency-signal to detect an explicit request for urgent attention in a message, not the pull of an unresolved chord.',
    },
    {
      id: 'step-progress',
      reason:
        'Use step-progress to judge whether a new observation advances a task objective, rather than how far a harmony is from its home chord.',
    },
  ],
  limitations: [
    'Grades the tension implied by chord symbols and annotations at the last point in progression. It does not analyze voicings, compute scale degrees, or identify the key; supply key and describe suspensions or holds in the text.',
    'Tension is heard relative to a style; a dominant seventh that demands resolution in a hymn is a resting chord in a blues. State the style in the text when it matters.',
    'The grade is not a decision about what to play next.',
  ],
} satisfies RecipeMetadata;
