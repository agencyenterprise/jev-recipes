import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'appeal-grounds-kind',
  title: 'Classify the ground an appeal asserts',
  description:
    'What ground does appeal primarily assert: a factual error, a procedural error, new evidence, hardship, a misapplied rule, or something else?',
  category: 'workflow',
  tags: [
    'public-sector',
    'appeals',
    'adjudication',
    'classification',
    'workflow',
    'case-management',
  ],
  useWhen:
    'You need to sort incoming appeals of a benefits, permit, enforcement, or academic decision by the kind of argument they make, so each reaches the right reviewer or template before anyone reads the file.',
  related: [
    {
      id: 'correction-target',
      reason:
        'Use correction-target to identify what part of a prior output a correction points at, rather than what kind of ground an appeal asserts.',
    },
    {
      id: 'feedback-kind',
      reason:
        'Use feedback-kind to classify general feedback on a product or service, rather than a formal appeal of a decision.',
    },
  ],
  limitations: [
    'Classifies the argument the appellant makes, not whether it is correct or whether the appeal should succeed. Merits review belongs to the adjudicator.',
    'An appeal that asserts several grounds is classified by the one it presses most; split multi-ground appeals in code when each needs its own review.',
    'Does not check timeliness, standing, or whether the ground is one the process allows.',
  ],
} satisfies RecipeMetadata;
