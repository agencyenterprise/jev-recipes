import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'result-plausibility',
  title: 'Check result plausibility',
  description:
    'Is result a plausible, internally consistent answer to request rather than an error, placeholder, empty, or unrelated output dressed as data?',
  category: 'workflow',
  tags: ['agent', 'tool-result', 'plausibility', 'validation', 'quality', 'gate'],
  useWhen:
    'You need a yes/no check on a tool or subagent output before an agent trusts it, stores it, or builds the next step on it.',
  related: [
    {
      id: 'result-usefulness',
      reason:
        'Use result-usefulness once a result is plausible to decide whether it actually carries information the task needs.',
    },
    {
      id: 'result-outcome',
      reason:
        'Use result-outcome to classify what a result reports happened, such as success or failure, rather than whether it is real.',
    },
  ],
  limitations: [
    'Judges internal consistency and fit to the request, not factual accuracy. A plausible result can still be wrong.',
    'A genuine empty answer, such as a search that legitimately found nothing, is only plausible if the result says so rather than returning blank output.',
  ],
} satisfies RecipeMetadata;
