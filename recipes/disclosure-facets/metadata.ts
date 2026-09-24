import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'disclosure-facets',
  title: 'Label what a property disclosure addresses',
  description:
    'Which of these does disclosure address: known defects, prior repairs, environmental hazards, boundary or easement issues, association rules?',
  category: 'knowledge',
  tags: ['real-estate', 'disclosures', 'labels', 'multi-label', 'transactions', 'due-diligence'],
  useWhen:
    "You need several independent checks on a seller's or landlord's disclosure text in one call, to see which topics it covers and which it is silent on before a buyer, tenant, or reviewer relies on it.",
  related: [
    {
      id: 'privacy-notice-facets',
      reason:
        'Use privacy-notice-facets for the same coverage-check pattern over a privacy notice instead of a property disclosure.',
    },
    {
      id: 'clarify',
      reason:
        "Use clarify to decide whether a buyer's question about the disclosure is too ambiguous to answer, rather than what the disclosure itself addresses.",
    },
  ],
  limitations: [
    'Each label reports whether the disclosure addresses the topic, not whether what it says is true, complete, or sufficient under local disclosure law.',
    'A statement that the seller knows of no issue counts as addressing the topic. Silence does not.',
    'Labels are independent, so a disclosure can carry several, all, or none.',
  ],
} satisfies RecipeMetadata;
