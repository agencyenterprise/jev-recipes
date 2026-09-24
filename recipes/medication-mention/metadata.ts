import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'medication-mention',
  title: 'Detect a medication or dosage mention',
  description: 'Does message mention a medication, supplement, or dosage?',
  category: 'support',
  tags: ['healthcare', 'patient-message', 'medication', 'routing', 'gate'],
  useWhen:
    'You need to route patient messages that name a drug, supplement, or dose toward pharmacy or prescriber review, or flag them for careful handling before storage.',
  related: [
    {
      id: 'pii-presence',
      reason:
        'Use pii-presence to detect personal identifiers that need protected handling alongside medication details.',
    },
    {
      id: 'memory-subject',
      reason:
        'Use memory-subject to decide whose record a stated medication fact belongs to before storing it.',
    },
  ],
  limitations: [
    'Detects that a medication, supplement, or dose is named. It does not extract the name, confirm the product exists, or judge whether the dosing is appropriate.',
    'Reads the supplied text only; it does not check the mention against a medication list or patient record.',
  ],
} satisfies RecipeMetadata;
