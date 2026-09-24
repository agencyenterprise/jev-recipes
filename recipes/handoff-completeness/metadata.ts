import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'handoff-completeness',
  title: 'Grade handoff completeness',
  description:
    'How ready is item, a work description being handed to another agent or person, to be picked up without asking questions, on a five-level rubric?',
  category: 'workflow',
  tags: ['agent', 'delegation', 'handoff', 'completeness', 'multi-agent'],
  useWhen:
    'You need to grade a task description before delegating it, so an orchestrator can enrich it or ask for missing pieces instead of handing off something a worker will bounce back.',
  related: [
    {
      id: 'plan-completeness',
      reason:
        'Use plan-completeness to grade whether a plan covers its goal, rather than whether a single work item is ready to hand off.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to find the specific missing requirements once an item grades below complete.',
    },
  ],
  limitations: [
    'Grades what the item states, not whether the stated goal is correct, feasible, or worth doing.',
    'Cannot know what the recipient already knows, so shared context that is not written into the item counts as missing.',
    'The score is an expected value over rubric levels. Application code chooses the level at which to hand off.',
  ],
} satisfies RecipeMetadata;
