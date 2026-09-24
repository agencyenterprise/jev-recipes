import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'content-facets',
  title: 'Label article facets',
  description:
    'Which of these does article include: a clear thesis, supporting evidence, counterarguments, a call to action, and signals of author expertise?',
  category: 'knowledge',
  tags: ['content', 'seo', 'article', 'editorial', 'quality', 'labels'],
  useWhen:
    'You audit published or drafted articles for structural completeness before deciding whether they need more evidence, a stance, or a conclusion.',
  related: [
    {
      id: 'answer-disclosures',
      reason:
        'Use answer-disclosures to label the caveats and disclosures an answer contains rather than the structure of an article.',
    },
    {
      id: 'argument-fit',
      reason: 'Use argument-fit to judge whether a specific argument supports a specific claim.',
    },
  ],
  limitations: [
    'Labels what the article contains; it does not judge whether the thesis is correct, the evidence is sound, or the expertise is genuine.',
    'Long articles are read as one text. Section-level analysis and scoring rules belong in code.',
  ],
} satisfies RecipeMetadata;
