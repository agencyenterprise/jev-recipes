import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'continuation-compare',
  title: 'Compare two musical continuations',
  description:
    'Which of firstContinuation and secondContinuation better follows the musical context in motif, contour, harmony, and any style supplied?',
  category: 'workflow',
  tags: ['music', 'generation', 'comparison', 'pairwise', 'melody', 'composition'],
  useWhen:
    'A generation loop has produced two candidate continuations for a passage and wants a head-to-head preference before committing to one.',
  related: [
    {
      id: 'draft-compare',
      reason:
        'Use draft-compare to choose between two text drafts under a rubric, not between two musical continuations of a passage.',
    },
    {
      id: 'action-compare',
      reason:
        'Use action-compare to compare two next steps against a goal and constraints, rather than two continuations against a musical context.',
    },
  ],
  limitations: [
    'Compares the two continuations as written. It does not verify key membership, count beats, or check voice leading; do those exactly in application code and describe the results in the text.',
    'A preferred continuation is only better than the other one supplied; neither may be good.',
    'Style preference is a judgment, so continuations that fit similarly well can tie or swap on different runs.',
  ],
} satisfies RecipeMetadata;
