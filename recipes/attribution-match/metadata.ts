import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: 'attribution-match',
  title: "Check a statement's attributed source",
  description:
    'Check whether supplied source text attributes a statement to the claimed speaker or source.',
  category: 'knowledge',
  tags: [
    'attribution',
    'speaker',
    'who said',
    'source ownership',
    'quotation',
    'annotation',
    'alignment-research',
  ],
  useWhen:
    'You need to check who said a statement in a transcript or source excerpt, separately from whether it is true.',
  related: [
    {
      id: 'citation-match',
      reason:
        'Use citation-match to check which passages support a claim, rather than who made it.',
    },
    {
      id: 'claim-stance',
      reason:
        "Use claim-stance to label a response's own position toward a claim, rather than verifying a named attribution.",
    },
    {
      id: 'reference-resolve',
      reason:
        'Use reference-resolve to select the referent of an ambiguous expression from supplied candidates.',
    },
  ],
  limitations: [
    'Checks only the supplied attribution record. It does not authenticate a source or establish original authorship, truth, or copyright ownership.',
    'Missing statements and unresolved speaker identities require review; absence from an excerpt is not proof of false attribution.',
    'Nested quotation and endorsement are distinct. Include enough surrounding text to establish who is speaking.',
  ],
} satisfies RecipeMetadata;
