import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'corrective-action-fit',
  title: 'Check a corrective action against its root cause',
  description:
    'Does action address the cause stated in rootCause rather than only the symptom or the affected items?',
  category: 'workflow',
  tags: ['manufacturing', 'quality', 'capa', 'corrective-action', 'gate', 'review'],
  useWhen:
    'You review corrective action plans in a CAPA or nonconformance workflow and want to flag actions that rework parts, add inspection, or retrain people while leaving the stated cause in place.',
  related: [
    {
      id: 'workaround-fit',
      reason:
        'Use workaround-fit to check whether a temporary workaround addresses an issue within stated constraints, rather than whether a permanent action removes a cause.',
    },
    {
      id: 'troubleshooting-fit',
      reason:
        'Use troubleshooting-fit to assess a diagnostic procedure rather than a proposed fix.',
    },
  ],
  limitations: [
    'Judges the fit between two texts as written. It does not know whether rootCause is the true cause or whether action will work in practice.',
    'An action can address the cause and still be incomplete, unowned, or late. Owners, due dates, and effectiveness checks belong in application code.',
    'A misses verdict is a flag for a reviewer, not a rejection.',
  ],
} satisfies RecipeMetadata;
