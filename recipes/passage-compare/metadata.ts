import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-compare',
  title: 'Compare two passages for a question',
  description: 'Which of firstPassage and secondPassage better helps answer question?',
  category: 'retrieval',
  tags: ['retrieval', 'comparison', 'pairwise', 'passage', 'ranking', 'evaluation'],
  useWhen:
    'You need a head-to-head preference between two retrieved passages, for tie-breaking, evaluation data, or reranker calibration.',
  related: [
    {
      id: 'rerank',
      reason: 'Use rerank to score many passages independently against one query.',
    },
    {
      id: 'context-role',
      reason: 'Use context-role to label what one passage contributes to a question.',
    },
  ],
  limitations: [
    'Compares two passages only. Order is declared irrelevant, but run both orders when calibrating.',
    'Judges helpfulness for the question, not the factual accuracy of either passage.',
  ],
} satisfies RecipeMetadata;
