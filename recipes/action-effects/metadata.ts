import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'action-effects',
  title: 'Label the side effects of an action',
  description:
    'Which side effects does the described action involve: writing or modifying data, sending a message or notification, spending or moving money, deleting something, or calling an external service?',
  category: 'workflow',
  tags: ['agent', 'safety', 'action', 'side-effects', 'approval', 'labels'],
  useWhen:
    'An agent is about to execute a step and your approval policy differs by effect, so you want to gate auto-execution per side effect rather than with one blanket risk score.',
  related: [
    {
      id: 'action-reversibility',
      reason:
        'Use action-reversibility to grade how hard the action is to undo, rather than which kinds of effect it has.',
    },
    {
      id: 'action-scope',
      reason:
        'Use action-scope to check whether the action stays within the work that was requested.',
    },
  ],
  limitations: [
    'Labels the effects the action description states or plainly entails. It does not know what your tools actually do behind the description.',
    'Read-only lookups against an external API still count as external calls; whether that is acceptable is a policy decision for application code.',
    'Permission checks, spending limits, and confirmation prompts belong in application code that consumes these labels.',
  ],
} satisfies RecipeMetadata;
