import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { shipmentIssueKindInputSchema, shipmentIssueKindResultSchema } from './schema.js';
import type { ShipmentIssueKindInput, ShipmentIssueKindResult } from './schema.js';

export async function shipmentIssueKind(
  input: ShipmentIssueKindInput,
  options: RecipeOptions = {},
): Promise<ShipmentIssueKindResult> {
  const { minConfidence = 0.8, ...state } = shipmentIssueKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What shipping problem does message report, given any context? Judge the problem the sender describes with the delivery of their order, not their tone or what remedy they ask for. When several problems are mentioned, choose the one the sender is mainly reporting.',
    {
      delayed:
        'The shipment is late or has not arrived by the expected date but is still expected to arrive.',
      damaged:
        'The shipment arrived with the item or packaging broken, crushed, leaking, or otherwise harmed.',
      lost: 'The shipment cannot be located, tracking has stopped, or it was marked delivered but never received.',
      wrong_item:
        'The shipment arrived but contained a different item, quantity, size, or variant than ordered.',
      address:
        'The shipment cannot be delivered because the address is wrong, incomplete, or undeliverable.',
      none: 'The message does not report a shipping problem.',
      unclear: 'The message reports a problem whose kind is not established by the supplied text.',
    },
    options,
  );
  return shipmentIssueKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  shipmentIssueKindInputSchema,
  shipmentIssueKindResultSchema,
  shipmentIssueKindVerdictSchema,
} from './schema.js';
export type {
  ShipmentIssueKindInput,
  ShipmentIssueKindResult,
  ShipmentIssueKindVerdict,
} from './schema.js';
