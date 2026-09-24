import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'finger-actions',
  title: 'Choose an action for every finger',
  description:
    'On beat, which listed option should each finger in fingers take, given music and style, or rest?',
  category: 'workflow',
  tags: ['music', 'piano', 'performance', 'fingers', 'assignment', 'live-performance', 'agent'],
  useWhen:
    'A playing loop advances one subdivision at a time and wants every finger to pick from its own reachable options in a single call.',
  related: [
    {
      id: 'next-note',
      reason:
        'Use next-note when the loop chooses one melodic note rather than an action per finger.',
    },
    {
      id: 'next-chord',
      reason: 'Use next-chord to pick the harmony first, then let finger-actions voice it.',
    },
  ],
  limitations: [
    'Each finger is judged as its own question within one request, so two fingers can pick the same key. Resolve collisions and physical reach in code.',
    'Options are the caller-supplied reachable actions for that finger; the recipe does not invent notes or check key membership.',
    'Beat timing, note durations, and MIDI output belong in application code.',
  ],
} satisfies RecipeMetadata;
