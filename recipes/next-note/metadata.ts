import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'next-note',
  title: 'Pick the next melody note',
  description:
    'Which candidate note best continues the melody in recentNotes, given any key and style supplied?',
  category: 'workflow',
  tags: ['music', 'melody', 'generation', 'selection', 'piano', 'composition'],
  useWhen:
    'A generation loop such as an infinite piano player has produced the last few notes, application code has enumerated a handful of legal next notes, and you want a musical judgment of which one continues the line best, or whether a rest is better.',
  related: [
    {
      id: 'game-action',
      reason:
        'Use game-action when the choice is among generic JSON game actions rather than notes judged for melodic sense.',
    },
    {
      id: 'choose-action',
      reason:
        'Use choose-action when an explicit goal and rulebook govern the pick instead of melodic continuity in a key and style.',
    },
  ],
  limitations: [
    'Judges melodic sense from note names and descriptions. It does not verify that a candidate is in the key or compute intervals exactly; do those checks in application code before supplying candidates.',
    'Taste in a style is a judgment, not a rule. Two runs on the same input can prefer different candidates when they fit similarly well.',
    'A pick says nothing about duration, dynamics, or harmony under the note; supply or decide those separately.',
  ],
} satisfies RecipeMetadata;
