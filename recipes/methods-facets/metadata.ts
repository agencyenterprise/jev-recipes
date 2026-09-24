import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'methods-facets',
  title: 'Label what a methods section states',
  description:
    'Which of these does methods state: sample size, data source, analysis method, limitations, and preregistration or a protocol?',
  category: 'knowledge',
  tags: ['research', 'methods', 'reporting', 'academic-writing', 'reproducibility', 'labels'],
  useWhen:
    'You screen manuscripts, preprints, or study summaries for reporting completeness before deciding which ones need a request for missing methodological detail.',
  related: [
    {
      id: 'answer-disclosures',
      reason:
        'Use answer-disclosures to label the caveats and disclosures in an answer, rather than the reporting elements of a methods section.',
    },
    {
      id: 'content-facets',
      reason:
        'Use content-facets to label the structural elements of an article, rather than the methodological details of a study.',
    },
  ],
  limitations: [
    'Labels whether each element is stated, not whether the sample is adequate, the source is reliable, or the analysis is appropriate.',
    'Judges only the supplied text. Details reported elsewhere in the paper, in supplements, or in a linked registration are invisible unless pasted in.',
    'Compliance with a specific reporting checklist, such as CONSORT or PRISMA, is a mapping that belongs in application code.',
  ],
} satisfies RecipeMetadata;
