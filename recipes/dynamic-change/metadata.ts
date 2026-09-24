import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'dynamic-change',
  title: 'Steer the loudness',
  description:
    'Should the upcoming phrase be softer, equally loud, or louder, judged from audience remarks about volume in context and the dynamics written in recentMaterial?',
  category: 'workflow',
  tags: ['music', 'dynamics', 'live-performance', 'steering', 'workflow', 'decision'],
  useWhen:
    'Your player must pick a volume level for the next phrase from requests for quiet or power.',
  related: [
    {
      id: 'intent-change',
      reason:
        'Use intent-change to detect that a listener has changed what they want, rather than to choose a dynamics direction from the whole context.',
    },
    {
      id: 'tone-check',
      reason:
        'Use tone-check to check a draft against caller-defined writing criteria; this recipe steers loudness, not prose.',
    },
  ],
  limitations: [
    'Chooses a direction only. It does not pick a dynamic marking, velocity, or gain value; application code owns the amount.',
    'Weighs the requests stated in context as written and does not know which listeners matter more unless context says so.',
    'Reads recentMaterial as described; it cannot hear audio or verify the loudness that was actually played.',
  ],
} satisfies RecipeMetadata;
