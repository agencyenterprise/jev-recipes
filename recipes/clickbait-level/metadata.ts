import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'clickbait-level',
  title: 'Grade clickbait level',
  description:
    'How much does headline rely on curiosity gaps, exaggeration, or emotional bait instead of stating what the content is?',
  category: 'conversation',
  tags: ['content', 'headline', 'clickbait', 'seo', 'psychology', 'score'],
  useWhen:
    'You want to rank, flag, or reject headlines that manipulate readers into clicking rather than telling them what they will get.',
  related: [
    {
      id: 'outcome-framing',
      reason: 'Use outcome-framing to judge whether a message frames a result as a gain or a loss.',
    },
    {
      id: 'question-leading',
      reason:
        'Use question-leading to detect questions that push the reader toward a particular answer.',
    },
  ],
  limitations: [
    'Grades the wording of the headline alone; it does not see the article and cannot say whether the headline is accurate.',
    'Does not measure click-through rate or reader trust. Publishing thresholds and rewrite policies belong in code.',
  ],
} satisfies RecipeMetadata;
