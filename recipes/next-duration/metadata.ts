import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'next-duration',
  title: 'Pick the next rhythmic value',
  description:
    'Which candidate rhythmic value best continues recentRhythm within meter, given any style supplied?',
  category: 'workflow',
  tags: ['music', 'rhythm', 'meter', 'generation', 'selection', 'composition'],
  useWhen:
    'A generation loop has chosen the next pitch and must decide how long to hold it, application code has enumerated a few legal durations, and you want a musical judgment of which one continues the rhythmic feel.',
  related: [
    {
      id: 'game-action',
      reason:
        'Use game-action when the choice is among generic JSON game actions rather than durations judged for rhythmic sense.',
    },
    {
      id: 'take-turn',
      reason:
        'Use take-turn to decide whether a player may act at all under game rules, rather than how long the next musical event should last.',
    },
  ],
  limitations: [
    'Judges rhythmic feel from written durations and a meter. It does not add up beats or verify that a candidate fits in the remaining bar; do that arithmetic in application code before supplying candidates.',
    'Groove is style-dependent, so the same pattern can want a long note in a ballad and a short one in a dance; supply style when it matters.',
    'A pick names a duration, not a pitch, articulation, or dynamic.',
  ],
} satisfies RecipeMetadata;
