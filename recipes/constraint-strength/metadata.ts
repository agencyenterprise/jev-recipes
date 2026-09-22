import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'constraint-strength',
  title: 'Distinguish requirements from preferences',
  description: 'Classify a stated constraint as required, preferred, optional, or unclear.',
  category: 'conversation',
  tags: [
    'constraint',
    'requirement',
    'preference',
    'optional',
    'mandatory',
    'must',
    'should',
    'hard',
    'soft',
  ],
  useWhen:
    'You need to distinguish a hard requirement from a preference or an optional suggestion.',
  related: [
    {
      id: 'preference-kind',
      reason:
        'Use preference-kind to distinguish lasting preferences from facts and temporary requests.',
    },
    {
      id: 'instruction-fit',
      reason:
        'Use instruction-fit to decide whether the constraint applies in the current circumstances.',
    },
    {
      id: 'instruction-conflict',
      reason: 'Use instruction-conflict to compare the requirements of two instructions.',
    },
  ],
  limitations: [
    'Reports how the supplied wording presents a constraint; it does not establish authority, consent, or permission.',
    'Evaluate one constraint at a time. Split mixed requirements in caller code before comparing their strength.',
  ],
} satisfies RecipeMetadata;
