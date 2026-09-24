import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'proposal-facets',
  title: 'Label the facets of a grant proposal',
  description:
    'Which of these does proposal include: a statement of need, measurable objectives, planned activities, a budget, an evaluation plan?',
  category: 'knowledge',
  tags: ['nonprofit', 'grants', 'proposal', 'fundraising', 'labels', 'multi-label'],
  useWhen:
    'You screen draft or submitted grant proposals for the sections a funder or an internal reviewer expects, or you want to tell a writer which parts are missing before a deadline.',
  related: [
    {
      id: 'plan-completeness',
      reason:
        'Use plan-completeness to grade how completely a plan covers a specific task, rather than which standard sections a proposal contains.',
    },
    {
      id: 'content-facets',
      reason:
        'Use content-facets for the structural elements of an article, such as a thesis and evidence, rather than the parts of a funding request.',
    },
  ],
  limitations: [
    'Labels are independent, so a proposal can carry several or none.',
    'Detects that a facet is present, not that it is convincing. A stated need can be unsupported and a budget can be unrealistic.',
    "Does not check the proposal against a funder's guidelines, page limits, or required attachments. Enforce format rules in application code.",
  ],
} satisfies RecipeMetadata;
