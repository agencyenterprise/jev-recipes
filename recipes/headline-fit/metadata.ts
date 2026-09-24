import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'headline-fit',
  title: 'Check headline fit',
  description:
    'Does headline accurately represent what body says, without promising more than the body delivers?',
  category: 'knowledge',
  tags: ['content', 'headline', 'seo', 'editorial', 'accuracy', 'gate'],
  useWhen:
    'You publish or review articles and want to catch headlines that overstate, contradict, or misdirect from the body before they go live.',
  related: [
    {
      id: 'summary-coverage',
      reason:
        'Use summary-coverage to judge whether a longer summary captures the main points of a source.',
    },
    {
      id: 'attribution-match',
      reason:
        'Use attribution-match to check whether a quoted claim is attributed to the source that actually made it.',
    },
  ],
  limitations: [
    'Judges the headline against the supplied body only; it does not check whether the body itself is true.',
    'Does not measure engagement, search ranking, or style. Editorial house rules and length limits belong in code.',
  ],
} satisfies RecipeMetadata;
