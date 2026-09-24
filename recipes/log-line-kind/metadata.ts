import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'log-line-kind',
  title: 'Classify what a log line reports',
  description:
    'What does line report: an error, a warning, a lifecycle event, a handled request, a metric, or debug output?',
  category: 'workflow',
  tags: ['logging', 'observability', 'devops', 'classification', 'on-call', 'triage'],
  useWhen:
    'You are grouping or filtering unstructured log lines from mixed sources and cannot rely on a level field being present or accurate.',
  related: [
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind once a line is known to report an error and you need to say what kind of failure it was.',
    },
    {
      id: 'result-outcome',
      reason:
        'Use result-outcome to classify how a reported task or job ended, rather than what kind of log line it is.',
    },
  ],
  limitations: [
    'Classifies one line from its wording. Lines that only make sense with neighbouring lines or a stack trace may come back unclear.',
    'Does not trust or ignore a printed level token by rule; it weighs the token against what the line describes.',
    'Timestamps, request IDs, and numeric values are not parsed. Extract them in application code.',
  ],
} satisfies RecipeMetadata;
