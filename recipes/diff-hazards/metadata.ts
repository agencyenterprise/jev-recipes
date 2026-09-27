import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'diff-hazards',
  title: 'Flag hazards in a code diff',
  description:
    'Which hazards does diff introduce: leaked secrets, destructive commands, debug leftovers, weakened tests, or dependency changes?',
  category: 'workflow',
  tags: [
    'diff',
    'code-review',
    'secrets',
    'destructive',
    'pre-commit',
    'agent',
    'safety',
    'harness',
  ],
  useWhen:
    'A coding agent or pre-commit hook needs a fast screen of a diff for the mistakes that reviewers most often catch late.',
  related: [
    {
      id: 'change-risk',
      reason:
        'Use change-risk to grade the overall shipping risk of a described change rather than flag specific hazards in the diff text.',
    },
    {
      id: 'commit-message-fit',
      reason: 'Use commit-message-fit to check whether the commit message describes the change.',
    },
    {
      id: 'breaking-change-signal',
      reason: 'Use breaking-change-signal to check whether a change breaks callers.',
    },
  ],
  limitations: [
    'Reads only the supplied diff text. It does not run the code, resolve imports, or see files outside the diff.',
    'A pattern that looks like a secret, such as an example key in documentation, may be flagged; treat detections as a prompt for review, not proof.',
  ],
} satisfies RecipeMetadata;
