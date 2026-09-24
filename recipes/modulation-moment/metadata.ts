import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'modulation-moment',
  title: 'Check whether now is a moment to change key',
  description:
    'Is now a musically suitable moment to modulate away from key, judged on the phrase position, cadence, and stability described in recentMaterial?',
  category: 'workflow',
  tags: ['music', 'harmony', 'modulation', 'key', 'generation', 'gate'],
  useWhen:
    'A generation loop wants to introduce a key change and needs to know whether the current point is a natural seam, such as the end of a phrase or a settled cadence, or whether a change now would cut a line off mid-thought.',
  related: [
    {
      id: 'topic-shift',
      reason:
        'Use topic-shift to detect whether a conversation message moves to a new topic, not whether a passage is ready to move to a new key.',
    },
    {
      id: 'step-complete',
      reason:
        'Use step-complete when supplied evidence must establish a stated completion condition, rather than judging a musical seam from the passage itself.',
    },
  ],
  limitations: [
    'Judges suitability from the phrase position, cadence, and stability described in the text. It does not identify the current key, find pivot chords, or plan the new key; those belong in application code or a later step.',
    'A suitable moment is a seam, not an obligation; staying in key can be the better choice.',
    'Styles differ in how abruptly they modulate, so a moment unsuitable for a chorale can suit a film cue.',
  ],
} satisfies RecipeMetadata;
