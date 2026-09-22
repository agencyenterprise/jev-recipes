import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'handoff',
  title: 'Check handoff rules',
  description: 'Decide whether a request matches your human escalation rules.',
  category: 'workflow',
  tags: ['escalation', 'support', 'human'],
  limitations: [
    'Does not contact a person, execute actions, or enforce permissions.',
    'Provide 1 to 50 rules with unique IDs; uncertain rules require review unless another rule confidently matches.',
  ],
} satisfies RecipeMetadata;
