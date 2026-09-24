import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'objective-fit',
  title: 'Check question alignment to a learning objective',
  description:
    'Does question assess the skill or knowledge stated in objective, rather than something adjacent?',
  category: 'answer-quality',
  tags: ['education', 'assessment', 'alignment', 'learning-objective', 'questions'],
  useWhen:
    'You generate or review quiz and exam items and want to catch questions that test recall or a neighboring topic instead of the stated objective.',
  related: [
    {
      id: 'instruction-fit',
      reason:
        'Use instruction-fit to check whether a written instruction covers a given task and context.',
    },
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to check whether a question identifies a focused information need.',
    },
  ],
  limitations: [
    'Judges alignment only; an aligned question can still be too easy, too hard, or ambiguous.',
    'Depends on how precisely objective states the skill and cognitive level.',
    'Does not check whether the question has a correct answer or whether its answer key is right.',
  ],
} satisfies RecipeMetadata;
