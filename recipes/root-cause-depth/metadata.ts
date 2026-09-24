import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'root-cause-depth',
  title: 'Grade the depth of a root cause analysis',
  description:
    'How deep does analysis go in explaining a failure, on a five-level rubric from restating the symptom to naming a verified systemic cause?',
  category: 'workflow',
  tags: ['manufacturing', 'quality', 'root-cause', 'capa', 'score', 'review'],
  useWhen:
    'You review corrective action requests, nonconformance dispositions, or incident write-ups and want to flag analyses that stop at the symptom or the immediate cause before a quality reviewer accepts them.',
  related: [
    {
      id: 'causal-attribution',
      reason:
        'Use causal-attribution to label whether an explanation blames the person or the situation, rather than how deep the causal chain goes.',
    },
    {
      id: 'explanation-level',
      reason:
        'Use explanation-level to grade how much reasoning an answer shows for a conclusion, rather than how far a failure analysis traces its causes.',
    },
  ],
  limitations: [
    'Grades how far the stated chain of causes reaches, not whether any link in it is true. A deep analysis can be deeply wrong.',
    'Rewards what analysis states, so a correct cause left implicit grades shallow.',
    'Does not know your CAPA procedure or which depth is required for a given defect class. Acceptance thresholds belong in application code.',
  ],
} satisfies RecipeMetadata;
