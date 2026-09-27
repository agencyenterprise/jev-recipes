import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'context-prune',
  title: 'Prune agent context',
  description:
    'Which of items, earlier tool results and messages in an agent session, are still needed to finish objective, so the rest can be dropped from context?',
  category: 'memory',
  tags: ['agent', 'context', 'compaction', 'prune', 'memory', 'tool-results', 'harness'],
  useWhen:
    'An agent session is growing long and you want to drop stale tool output and messages before the next model turn without summarizing what must stay verbatim.',
  related: [
    {
      id: 'rerank',
      reason:
        'Use rerank to order passages by relevance to a query rather than decide what an agent still needs.',
    },
    {
      id: 'memory-value',
      reason: 'Use memory-value to decide whether a fact is worth storing long term.',
    },
    {
      id: 'progress-stall',
      reason: 'Use progress-stall to detect an agent that keeps reprocessing the same context.',
    },
  ],
  limitations: [
    'Judges each item on its own text and the stated objective. It cannot see dependencies between items unless their text makes them explicit.',
    'Uncertain items stay in keep. A short objective that hides what the agent still has to do makes most items look unnecessary; state the remaining work concretely.',
    'Accepts up to 50 items per call. Chunk longer histories and pass recent so later chunks know what was already handled.',
  ],
} satisfies RecipeMetadata;
