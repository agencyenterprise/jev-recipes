import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'mood-match',
  title: 'Check a passage against a requested mood',
  description: 'Does the described passage deliver requestedMood?',
  category: 'workflow',
  tags: ['music', 'mood', 'live-performance', 'gate', 'steering', 'workflow'],
  useWhen:
    'A listener asked for a mood and a passage has been generated or described, and you want to check the passage delivers that mood before playing or committing to it.',
  related: [
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to check material against a described audience rather than a described musical passage against a requested mood.',
    },
    {
      id: 'instruction-fit',
      reason:
        "Use instruction-fit to check whether an instruction's scope covers a task, rather than whether music delivers a feeling.",
    },
  ],
  limitations: [
    'Compares two texts as written. It cannot hear the passage and does not know whether the description matches what was played.',
    'Judges conventional musical affect, not the reaction of any particular listener, who may hear the same passage differently.',
    'A mismatched verdict flags the passage for a change; it does not say what to change.',
  ],
} satisfies RecipeMetadata;
