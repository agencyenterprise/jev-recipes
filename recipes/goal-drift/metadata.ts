import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'goal-drift',
  title: 'Detect goal drift',
  description: 'Does step still serve goal, or has work drifted to something goal did not ask for?',
  category: 'workflow',
  tags: ['agent', 'goal', 'drift', 'scope', 'monitoring', 'gate'],
  useWhen:
    'You need a yes/no check on each step of a long-running agent so it stops before spending effort on work nobody asked for.',
  related: [
    {
      id: 'step-progress',
      reason:
        'Use step-progress to grade how much an observed result moved the objective forward, rather than whether the next step still belongs to it.',
    },
    {
      id: 'intent-change',
      reason:
        'Use intent-change when the user may have redirected the goal, so a step that looks drifted is actually following a new instruction.',
    },
  ],
  limitations: [
    'Judges a single step against the stated goal. It does not know whether the user later widened or changed the goal unless context says so.',
    'Reports drift, not whether the drifted work is harmful or valuable. Stopping, asking, or continuing is an application decision.',
  ],
} satisfies RecipeMetadata;
