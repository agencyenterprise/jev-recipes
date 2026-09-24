import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'novelty-claim-level',
  title: 'Grade how strongly a statement claims novelty',
  description:
    'How strongly does the wording of statement claim novelty for a contribution, from no novelty claim to first-ever or unprecedented?',
  category: 'conversation',
  tags: ['research', 'academic-writing', 'novelty', 'claims', 'psychology', 'score'],
  useWhen:
    'You are reviewing abstracts, introductions, grant text, or press copy and want to flag how hard the wording sells the contribution as new, so overclaiming can be checked against the actual related work.',
  related: [
    {
      id: 'certainty-match',
      reason:
        'Use certainty-match to check whether stated confidence matches the evidence, rather than how much novelty the wording claims.',
    },
    {
      id: 'outcome-framing',
      reason:
        'Use outcome-framing to label how a result is framed as gain or loss, rather than how new it is said to be.',
    },
  ],
  limitations: [
    'Grades the wording only. It does not know the literature and cannot say whether the claimed novelty is real.',
    "A statement can claim little novelty and still be original, or claim a first and be correct; comparing the claim against related work is the reviewer's job.",
    'Judges one statement at a time. Aggregating over a whole paper belongs in application code.',
  ],
} satisfies RecipeMetadata;
