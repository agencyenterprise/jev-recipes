import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'qualification-evidence',
  title: 'Check evidence for a qualification',
  description:
    'Does profile contain concrete evidence that the candidate meets requirement, not just matching keywords?',
  category: 'workflow',
  tags: ['recruiting', 'hiring', 'screening', 'qualification', 'evidence'],
  useWhen:
    'You screen resumes or candidate summaries against one requirement at a time and want to separate demonstrated experience from keyword matches.',
  related: [
    {
      id: 'step-complete',
      reason:
        'Use step-complete for the general form: does evidence establish that a condition is met.',
    },
    {
      id: 'verify',
      reason: 'Use verify to check several candidate claims against paired evidence in one call.',
    },
  ],
  limitations: [
    'Judges whether the profile describes evidence, not whether that evidence is true or verifiable.',
    'One requirement per call. Loop over requirements or aggregate in application code.',
    'A profile can be evidenced for a requirement and still be a poor fit overall; this is not a hiring decision.',
  ],
} satisfies RecipeMetadata;
