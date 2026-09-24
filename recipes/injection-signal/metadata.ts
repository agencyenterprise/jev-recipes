import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'injection-signal',
  title: 'Detect agent-directed instructions',
  description: 'Does text contain instructions aimed at steering an AI system or agent?',
  category: 'workflow',
  tags: ['security', 'prompt-injection', 'agent', 'safety', 'gate', 'retrieval'],
  useWhen:
    'You need to screen retrieved documents, tool results, or user uploads before an agent reads them as context.',
  related: [
    {
      id: 'pii-presence',
      reason:
        'Use pii-presence to screen the same text for personal data before storing or sharing it.',
    },
    {
      id: 'instruction-conflict',
      reason: 'Use instruction-conflict when two legitimate instructions may disagree.',
    },
  ],
  limitations: [
    'Detects instruction-like content aimed at machines. It does not judge whether the instructions would succeed or are malicious.',
    'Quarantine, stripping, and logging decisions belong in application code.',
  ],
} satisfies RecipeMetadata;
