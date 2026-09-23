import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'causal-attribution',
  title: 'Identify personal and situational explanations',
  description:
    'Label whether an explanation attributes a specified behavior to the person, circumstances, both, or gives no cause.',
  category: 'conversation',
  tags: [
    'psychology',
    'behavior',
    'causal attribution',
    'personal cause',
    'situational cause',
    'dispositional',
    'annotation',
    'alignment-research',
  ],
  useWhen: 'You need to label whether an explanation points to the person, the situation, or both.',
  related: [
    {
      id: 'attribution-match',
      reason:
        'Use attribution-match to check who made or endorsed a statement, rather than what kind of cause it gives.',
    },
    {
      id: 'motivation-source',
      reason:
        'Use motivation-source to distinguish enjoyment of an activity from pursuing a separate outcome in a stated reason.',
    },
    {
      id: 'verify',
      reason:
        'Use verify to assess supplied evidence for a causal claim; causal-attribution does not establish causation.',
    },
  ],
  limitations: [
    'Labels the supplied explanation, not the actual cause, blame, or a psychological trait of the actor.',
    'Personal and situational refer to the focal actor, not the speaker or whoever is named in a cause.',
    'A personal attribution alone does not establish bias or a fundamental attribution error.',
  ],
} satisfies RecipeMetadata;
