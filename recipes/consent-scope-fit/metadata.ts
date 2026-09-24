import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'consent-scope-fit',
  title: 'Check whether consent wording covers a use',
  description: 'Does the wording of consent cover the described use?',
  category: 'knowledge',
  tags: ['healthcare', 'consent', 'authorization', 'privacy', 'scope', 'gate'],
  useWhen:
    "You hold the text of a patient's consent or authorization and need to check, before sharing or using their information, whether the described use falls within what the wording permits.",
  related: [
    {
      id: 'consent-request',
      reason:
        'Use consent-request to check that a message actually asks for consent, before there is any consent wording to compare against.',
    },
    {
      id: 'source-applicability',
      reason:
        'Use source-applicability to check whether a policy or source document applies to a situation at all.',
    },
  ],
  limitations: [
    'Compares wording only. It does not determine legal sufficiency, whether the consent was validly obtained, or whether it has expired or been revoked.',
    'Dates, revocation status, and the identity of the named parties belong in application records, not in this check.',
  ],
} satisfies RecipeMetadata;
