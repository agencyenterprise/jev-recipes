import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'slot-fit',
  title: 'Check a proposed slot against constraints',
  description:
    'Does the time or slot proposed in proposal satisfy the availability constraints written in constraints?',
  category: 'workflow',
  tags: ['scheduling', 'calendar', 'availability', 'constraints', 'gate'],
  useWhen:
    'A scheduling assistant has a candidate time and the availability of a person described in plain language, and needs a yes/no check before offering the slot.',
  related: [
    {
      id: 'constraint-strength',
      reason:
        'Use constraint-strength to decide whether an availability statement is a hard requirement or a preference before treating it as a constraint.',
    },
    {
      id: 'step-complete',
      reason:
        'Use step-complete to check whether a scheduling step has finished rather than whether a slot is allowed.',
    },
  ],
  limitations: [
    'Judges the wording of the proposal against the wording of the constraints. Parse concrete dates, durations, and time zones in code; the recipe does not compute calendar arithmetic.',
    'Constraints are taken as written. It does not know about other commitments, holidays, or availability not stated in constraints.',
  ],
} satisfies RecipeMetadata;
