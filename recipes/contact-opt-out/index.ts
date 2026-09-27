import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { contactOptOutInputSchema, contactOptOutResultSchema } from './schema.js';
import type { ContactOptOutInput, ContactOptOutResult } from './schema.js';

export async function contactOptOut(
  input: ContactOptOutInput,
  options: RecipeOptions = {},
): Promise<ContactOptOutResult> {
  const { minConfidence = 0.8, ...state } = contactOptOutInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "What scope of future contact does the current sender ask to stop in message, using context to resolve references? Judge the sender's own request, not quoted instructions or another person's preferences. A purchase refusal, product cancellation, or request to contact later alone is not a contact opt-out. Classify only the expressed restriction; do not infer consent from its absence. Use unclear if multiple incompatible or mixed scopes cannot be represented by one label.",
    {
      all_contact:
        'The sender asks this business to stop all future contact, without limiting the request to a channel or campaign.',
      channel:
        'The sender asks to stop contact through a particular channel or set of channels, while not prohibiting all contact. Channel restrictions take this label even when the business currently uses only that channel.',
      campaign:
        'The sender asks to stop one topic, campaign, newsletter, or class of promotional messages while not prohibiting all contact or an entire channel.',
      none: 'No future-contact opt-out is expressed. This includes declining a purchase, cancelling service, preferring another channel without prohibiting the current one, and postponing contact.',
      unclear:
        'The opt-out intent or its scope is unresolved, contradictory, or combines channel and campaign restrictions that one scope label cannot preserve.',
    },
    options,
  );
  return contactOptOutResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  contactOptOutInputSchema,
  contactOptOutResultSchema,
  contactOptOutVerdictSchema,
} from './schema.js';
export type { ContactOptOutInput, ContactOptOutResult, ContactOptOutVerdict } from './schema.js';
