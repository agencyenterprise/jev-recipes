import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'wake-gate',
  title: 'Decide whether an event should wake a waiting agent',
  description:
    'Should event wake an agent that is paused until waitingFor happens: wake now, keep waiting, or ignore it as unrelated?',
  category: 'workflow',
  tags: ['agent', 'wake', 'resume', 'event', 'pause', 'scheduler', 'long-running', 'harness'],
  useWhen:
    'A paused or sleeping agent receives a timer tick, webhook, message, or file change and you must decide whether to resume its model loop.',
  related: [
    {
      id: 'goal-drift',
      reason: "Use goal-drift to check whether a resumed agent's next step still serves its goal.",
    },
    {
      id: 'progress-stall',
      reason: 'Use progress-stall to detect an agent that keeps waking without making progress.',
    },
  ],
  limitations: [
    "Judges only the supplied event against the stated wait condition. It does not know about earlier events or the agent's full history unless context supplies them.",
    'A wake verdict means the condition appears met or materially changed; the resumed agent still has to verify the actual state.',
  ],
} satisfies RecipeMetadata;
