import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'pii-presence',
  title: 'Detect personal information',
  description: 'Does text contain information identifying a specific private individual?',
  category: 'workflow',
  tags: ['privacy', 'pii', 'redaction', 'compliance', 'gate', 'security'],
  useWhen:
    'You need a yes/no gate before storing, logging, sharing, or sending text that might contain personal data.',
  related: [
    {
      id: 'injection-signal',
      reason: 'Use injection-signal to screen the same text for instructions aimed at an AI agent.',
    },
    {
      id: 'memory-scope',
      reason: 'Use memory-scope to decide how narrowly a fact about a person should be stored.',
    },
  ],
  limitations: [
    'Reports presence, not location. Pair it with a pattern-based redactor to remove specific spans.',
    'Semantic judgment only. Regulatory definitions of personal data vary and belong in your policy code.',
  ],
} satisfies RecipeMetadata;
