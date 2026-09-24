import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'postmortem-facets',
  title: 'Label the facets of a postmortem',
  description:
    'Which of these does postmortem include: a timeline, a root cause, customer impact, contributing factors, action items?',
  category: 'workflow',
  tags: ['incident-response', 'postmortem', 'labels', 'multi-label', 'devops', 'review'],
  useWhen:
    'You need to check an incident postmortem for the sections a review process expects before accepting it, or to tell the author which parts are missing.',
  related: [
    {
      id: 'report-facets',
      reason:
        'Use report-facets for agent progress reports, where the expected parts are an outcome, evidence, blockers, and next steps.',
    },
    {
      id: 'summary-coverage',
      reason:
        'Use summary-coverage to check whether a summary covers a source document, rather than whether a document contains expected sections.',
    },
  ],
  limitations: [
    'Labels are independent, so a postmortem can carry several or none.',
    'Detects that a facet is present, not that it is correct. A stated root cause can be wrong, and an action item can be unowned or vague.',
    'Does not check section headings, templates, or length. Enforce document structure in application code.',
  ],
} satisfies RecipeMetadata;
