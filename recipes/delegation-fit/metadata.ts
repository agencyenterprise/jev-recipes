import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'delegation-fit',
  title: 'Check delegation fit',
  description: 'Does subtask fall within the capabilities described for the delegate?',
  category: 'workflow',
  tags: ['agent', 'delegation', 'capabilities', 'routing', 'multi-agent'],
  useWhen:
    'You need a yes/no check before handing a subtask to a specific sub-agent or worker whose tools, access, or permissions are described in text.',
  related: [
    {
      id: 'tool-fit',
      reason:
        'Use tool-fit to check whether a single tool matches a request, rather than whether a whole subtask matches a delegate.',
    },
    {
      id: 'route',
      reason:
        'Use route to choose among several named delegates at once when more than one might fit.',
    },
  ],
  limitations: [
    'Judges fit against the capabilities as written. Abilities the delegate has but the description omits count as missing.',
    'Reports whether the subtask is within scope, not whether the delegate would do it well or how long it would take.',
  ],
} satisfies RecipeMetadata;
