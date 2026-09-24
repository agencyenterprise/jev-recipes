import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'loss-cause-kind',
  title: 'Identify the cause of loss in a claim narrative',
  description:
    'What cause of loss does narrative describe: weather, fire, water, theft, collision, wear and tear, vandalism, or something else?',
  category: 'knowledge',
  tags: ['insurance', 'claims', 'cause-of-loss', 'classification', 'peril', 'triage'],
  useWhen:
    'A claims intake or routing system needs to sort a free-form loss description into a cause-of-loss category so it can pick the right adjuster queue, forms, or follow-up questions.',
  related: [
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind to classify why a technical operation failed rather than what caused an insured loss.',
    },
    {
      id: 'shipment-issue-kind',
      reason:
        'Use shipment-issue-kind for what went wrong with a delivery; this recipe classifies the peril behind a property or vehicle loss.',
    },
  ],
  limitations: [
    'Names the cause the narrative describes, not the cause an investigation would establish, and makes no coverage or exclusion determination.',
    'Returns the primary cause only. Chains such as a storm that causes a flood resolve to the initiating cause the narrative emphasizes, or to unclear when the narrative gives no dominant cause.',
  ],
} satisfies RecipeMetadata;
