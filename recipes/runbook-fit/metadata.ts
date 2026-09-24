import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'runbook-fit',
  title: 'Check whether a runbook applies to an incident',
  description: 'Does runbook address the symptoms and component described in incident?',
  category: 'workflow',
  tags: ['incident-response', 'runbook', 'on-call', 'devops', 'gate', 'retrieval'],
  useWhen:
    'You retrieve candidate runbooks for a live incident and need to filter out ones that cover a different component or a different failure mode before surfacing them to the responder.',
  related: [
    {
      id: 'troubleshooting-fit',
      reason:
        "Use troubleshooting-fit for end-user support articles and a customer's described problem, rather than operational runbooks and incidents.",
    },
    {
      id: 'source-applicability',
      reason:
        'Use source-applicability to check whether a general document applies to a situation, when neither side is an incident or a runbook.',
    },
  ],
  limitations: [
    'Checks that the runbook targets the described symptoms and component, not that following it will resolve the incident.',
    'Does not check whether the runbook is current or whether its steps are safe. Ownership and freshness belong in application code.',
  ],
} satisfies RecipeMetadata;
