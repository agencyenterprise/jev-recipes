import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tempo-change',
  title: 'Steer the tempo',
  description:
    'Should the beat slow down, hold, or speed up next, given what listeners said about pace in context and how fast recentMaterial moved?',
  category: 'workflow',
  tags: ['music', 'tempo', 'live-performance', 'steering', 'workflow', 'decision'],
  useWhen:
    'A live loop has read chat about speed and must choose one pacing direction for the coming bars.',
  related: [
    {
      id: 'intent-change',
      reason:
        'Use intent-change to detect that a listener has changed what they want, rather than to choose a tempo direction from the whole context.',
    },
    {
      id: 'step-progress',
      reason:
        'Use step-progress to judge movement toward a caller-defined objective rather than a tempo adjustment.',
    },
  ],
  limitations: [
    'Chooses a direction only. It does not pick a beats-per-minute value or a rate of change; application code owns the amount.',
    'Weighs the requests stated in context as written and does not know which listeners matter more unless context says so.',
    'Reads recentMaterial as described; it cannot hear audio or verify that the description matches what was played.',
  ],
} satisfies RecipeMetadata;
