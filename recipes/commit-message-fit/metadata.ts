import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'commit-message-fit',
  title: 'Check commit message accuracy',
  description:
    'Does message accurately describe change, neither omitting a material part nor claiming work not present?',
  category: 'workflow',
  tags: ['code-review', 'commit', 'message', 'pull-request', 'gate', 'changelog'],
  useWhen:
    'You need to flag commit or pull request titles that understate, overstate, or misdescribe the change they accompany before merge or changelog generation.',
  related: [
    {
      id: 'summary-coverage',
      reason:
        'Use summary-coverage to check whether a longer description preserves each specific point of a change.',
    },
    {
      id: 'change-meaning',
      reason:
        'Use change-meaning to decide whether an edit to text alters its meaning or is editorial only.',
    },
  ],
  limitations: [
    'Compares the message against the supplied change description, not the repository. A misleading change summary produces a misleading verdict.',
    'Does not judge message style, ticket references, or conventional-commit formatting.',
  ],
} satisfies RecipeMetadata;
