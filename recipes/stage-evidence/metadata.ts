import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'stage-evidence',
  title: 'Check deal stage against evidence',
  description: 'Does evidence support that the deal is at stage as described?',
  category: 'workflow',
  tags: ['sales', 'crm', 'pipeline', 'stage', 'hygiene'],
  useWhen:
    'You need to audit pipeline hygiene by checking whether the conversation or activity on a deal justifies the stage a rep set.',
  related: [
    {
      id: 'step-complete',
      reason: 'Use step-complete to check whether a single workflow step was actually finished.',
    },
    {
      id: 'resolution-check',
      reason: 'Use resolution-check to decide whether a support conversation reached resolution.',
    },
  ],
  limitations: [
    'Judges only the supplied evidence against the supplied stage description. Missing activity makes a stage unsupported, not wrong.',
    'Does not decide which stage the deal should be at; it only checks the one given.',
  ],
} satisfies RecipeMetadata;
