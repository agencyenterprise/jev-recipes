import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'next-chord',
  title: 'Pick the next chord',
  description:
    'Which candidate chord best continues progression, given any key and style supplied?',
  category: 'workflow',
  tags: ['music', 'harmony', 'chords', 'generation', 'selection', 'composition'],
  useWhen:
    'A generation loop has a chord progression so far, application code has enumerated a few chords it could play next, and you want a musical judgment of which continuation a listener in the stated style would expect or enjoy.',
  related: [
    {
      id: 'game-action',
      reason:
        'Use game-action when the choice is among generic JSON game actions rather than chords judged for harmonic sense.',
    },
    {
      id: 'choose-action',
      reason:
        'Use choose-action when an explicit goal and rulebook govern the pick instead of harmonic continuity in a key and style.',
    },
  ],
  limitations: [
    'Judges harmonic sense from chord symbols and descriptions. It does not verify that a chord belongs to the key, spell voicings, or check voice leading; do those in application code before supplying candidates.',
    'Style expectations differ, so a progression that sounds inevitable in one genre may sound dull in another; supply style when it matters.',
    'A pick names a chord, not its voicing, rhythm, or duration.',
  ],
} satisfies RecipeMetadata;
