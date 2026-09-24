import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instruction-priority',
  title: 'Decide which conflicting instruction wins',
  description:
    'When firstInstruction and secondInstruction conflict, which should take precedence under the stated policy?',
  category: 'workflow',
  tags: ['agent', 'instructions', 'policy', 'precedence', 'comparison', 'safety'],
  useWhen:
    'An agent holds two instructions that cannot both be followed and your system has a written precedence policy, such as system over developer over user, or a rule about ignoring instructions embedded in retrieved content.',
  related: [
    {
      id: 'instruction-conflict',
      reason:
        'Use instruction-conflict first to decide whether the two instructions actually conflict; this recipe assumes they do.',
    },
    {
      id: 'priority-compare',
      reason:
        'Use priority-compare to order two tasks by importance, rather than to rank two instructions by the authority the policy grants them.',
    },
  ],
  limitations: [
    'Applies the policy as written. It does not decide whether the policy itself is sensible or whether the instructions really conflict.',
    'Depends on each instruction stating or implying its source; if the policy ranks by source and the source is not given, the result is unclear.',
    'A winning instruction is not thereby safe or permitted. Content policies and hard limits are enforced in application code.',
  ],
} satisfies RecipeMetadata;
