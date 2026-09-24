import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'review-recommendation-kind',
  title: "Classify a peer review's recommendation",
  description:
    'What recommendation does the wording of review express: accept, minor revision, major revision, or reject?',
  category: 'knowledge',
  tags: [
    'research',
    'peer-review',
    'academic-writing',
    'editorial',
    'classification',
    'recommendation',
  ],
  useWhen:
    'An editor or review-management tool needs to read the recommendation implied by a free-text review, for example when the reviewer skipped the form field or when the text and the ticked box disagree.',
  related: [
    {
      id: 'draft-compare',
      reason:
        'Use draft-compare to judge which of two revisions is better, rather than what a reviewer recommended.',
    },
    {
      id: 'feedback-kind',
      reason:
        'Use feedback-kind to classify general user feedback, rather than the recommendation in a formal peer review.',
    },
  ],
  limitations: [
    "Reads the recommendation the wording expresses, not whether the reviewer's assessment is fair or the paper is any good.",
    'A review that mixes praise and severe objections is classified by the disposition its wording commits to; when it commits to none, the result is unclear.',
    'Journal-specific decision categories, such as reject and resubmit, must be mapped from these four in application code.',
  ],
} satisfies RecipeMetadata;
