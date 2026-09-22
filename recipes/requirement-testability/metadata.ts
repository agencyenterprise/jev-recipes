import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'requirement-testability',
  title: 'Check whether a requirement is testable',
  description:
    'Decide whether a requirement defines an observable way to distinguish meeting it from failing it.',
  category: 'knowledge',
  tags: [
    'requirement',
    'testable',
    'testability',
    'acceptance',
    'criteria',
    'measurable',
    'observable',
    'specification',
  ],
  useWhen:
    'You need to check whether a requirement has clear, observable acceptance criteria before building it.',
  related: [
    {
      id: 'step-complete',
      reason:
        'Use step-complete to check evidence against a condition that has already been defined.',
    },
    {
      id: 'clarify',
      reason: 'Use clarify to find missing information across a supplied list of requirements.',
    },
  ],
  limitations: [
    'Assesses the wording and supplied definitions; does not generate tests, prove feasibility, or inspect an implementation.',
    'Exact measurements and pass/fail calculations belong in application code.',
  ],
} satisfies RecipeMetadata;
