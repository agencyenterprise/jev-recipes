import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instrument-issue-kind',
  title: 'Classify an instrument problem report',
  description:
    'What kind of problem does report describe with a musical instrument: tuning, buzz or rattle, no sound, intonation, mechanical, cosmetic, or unclear?',
  category: 'support',
  tags: ['music', 'instruments', 'repair', 'support', 'classification', 'triage'],
  useWhen:
    'You take in repair requests or support messages from players and need to route each one to the right technician, help article, or intake form based on the kind of problem described.',
  related: [
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind when the categories are your own list rather than this fixed set of instrument problem types.',
    },
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact to grade how badly the problem affects the player, rather than what kind of problem it is.',
    },
  ],
  limitations: [
    'Classifies the symptom as the player describes it, not the underlying cause. A buzz can come from frets, a nut, or loose hardware, and a tuning problem can come from strings, pegs, or a cracked neck; diagnosis is a separate step.',
    'A report that describes several problems is classified by the one it presses most. Split multi-problem reports in code when each needs its own ticket.',
    'Does not judge urgency, cost, or whether the instrument is under warranty.',
  ],
} satisfies RecipeMetadata;
