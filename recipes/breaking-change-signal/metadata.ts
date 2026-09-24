import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'breaking-change-signal',
  title: 'Detect breaking changes',
  description:
    'Does change indicate a change that would break existing callers, integrations, stored data, or documented behavior?',
  category: 'workflow',
  tags: ['code-review', 'breaking-change', 'compatibility', 'api', 'versioning', 'gate'],
  useWhen:
    'You need to flag changes that require a major version bump, a migration note, or downstream coordination before they merge.',
  related: [
    {
      id: 'change-meaning',
      reason:
        'Use change-meaning to decide whether an edit to documentation or contract text alters its meaning.',
    },
    {
      id: 'instruction-conflict',
      reason:
        'Use instruction-conflict when a change may disagree with an existing documented rule or requirement.',
    },
  ],
  limitations: [
    'Judges the change as described, not the actual code or its consumers. It cannot know which fields callers really depend on.',
    'Does not choose a version number or write migration notes. Semantic versioning policy belongs in application code.',
  ],
} satisfies RecipeMetadata;
