import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'phrase-complete',
  title: 'Check whether a phrase has closed',
  description:
    'Does recentNotes form a complete musical phrase that is ready to cadence or rest, or is it still open, given any meter supplied?',
  category: 'workflow',
  tags: ['music', 'melody', 'phrase', 'cadence', 'generation', 'gate'],
  useWhen:
    'A generation loop needs to know whether the line it has produced can pause, cadence, or hand off to a new idea, or whether it should keep the phrase going.',
  related: [
    {
      id: 'step-complete',
      reason:
        'Use step-complete when supplied evidence must establish a stated completion condition, rather than judging musical closure from the notes themselves.',
    },
    {
      id: 'resolution-check',
      reason:
        'Use resolution-check to detect whether a customer reports an issue as resolved, not whether a melody has come to rest.',
    },
  ],
  limitations: [
    'Judges closure from note names, rhythms, and any annotations in the text. It does not identify the key, compute scale degrees, or count beats; state the key and bar position in the text when they matter.',
    'A phrase can be heard as complete and still be musically better continued. The verdict reports readiness to close, not whether closing is the best choice.',
    'Phrase conventions vary by style; a blues line and a chorale close differently.',
  ],
} satisfies RecipeMetadata;
