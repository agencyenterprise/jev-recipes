import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ticketMatchInputSchema, ticketMatchResultSchema } from './schema.js';
import type { TicketMatchInput, TicketMatchResult } from './schema.js';

export async function ticketMatch(
  input: TicketMatchInput,
  options: RecipeOptions = {},
): Promise<TicketMatchResult> {
  const { minConfidence = 0.8, ...state } = ticketMatchInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do firstTicket and secondTicket describe the same underlying reported issue? Similar symptoms alone establish relatedness, not identity. Use only supplied links between the reports.',
    {
      same_issue:
        'The reports contain enough shared identifying context to establish the same issue.',
      related: 'The reports share symptoms or a subject but do not establish the same issue.',
      different: 'The reports describe materially different issues.',
      unclear: 'The descriptions are insufficient to establish even their relationship.',
    },
    options,
  );
  return ticketMatchResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  ticketMatchInputSchema,
  ticketMatchResultSchema,
  ticketMatchVerdictSchema,
} from './schema.js';
export type { TicketMatchInput, TicketMatchResult, TicketMatchVerdict } from './schema.js';
