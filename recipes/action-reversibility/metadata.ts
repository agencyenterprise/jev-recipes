import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'action-reversibility',
  title: 'Grade action reversibility',
  description:
    'How reversible is action, given any context, from a trivial undo to an irreversible external effect?',
  category: 'workflow',
  tags: ['agent', 'safety', 'action', 'reversibility', 'approval'],
  useWhen:
    'You need to decide whether an agent may proceed on its own or must pause for approval before a step that cannot be taken back.',
  related: [
    {
      id: 'action-scope',
      reason:
        'Use action-scope to check whether the action stays within the requested work before grading how reversible it is.',
    },
  ],
  limitations: [
    'Grades the action as described. It does not know which undo, backup, or recall facilities your system actually provides unless context says so.',
    'Reversibility is not permission. An irreversible action may be exactly what the user asked for, and a trivial one may still be out of scope.',
  ],
} satisfies RecipeMetadata;
