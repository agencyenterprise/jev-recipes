import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'handoff',
  title: 'Check handoff rules',
  description: 'Decide whether a request matches your human escalation rules.',
  category: 'workflow',
  tags: ['escalation', 'support', 'human'],
  useWhen: 'You need to decide whether your escalation rules call for a human.',
  related: [
    { id: 'route', reason: 'Use route to choose a handler when escalation is not the decision.' },
  ],
  limitations: [
    'Does not contact a person, execute actions, or enforce permissions.',
    'Provide 1 to 50 rules with unique IDs; uncertain rules require review unless another rule confidently matches.',
  ],
} satisfies RecipeMetadata;
