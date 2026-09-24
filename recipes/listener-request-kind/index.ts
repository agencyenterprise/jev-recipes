import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { listenerRequestKindInputSchema, listenerRequestKindResultSchema } from './schema.js';
import type { ListenerRequestKindInput, ListenerRequestKindResult } from './schema.js';

export async function listenerRequestKind(
  input: ListenerRequestKindInput,
  options: RecipeOptions = {},
): Promise<ListenerRequestKindResult> {
  const { minConfidence = 0.8, ...state } = listenerRequestKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read message from a listener of a live musical performance and decide which aspect of the performance it asks to change. Use context, when supplied, only to resolve what a short or relative message points at, such as "slower" or "more of that". Pick the single control the message presses most. Choose mood when it names a feeling it wants to hear, tempo when it asks for faster or slower, style when it names a genre or manner of playing, specific_piece when it names a song, composer, or piece, dynamics when it asks for louder or softer, and stop when it asks to pause or end. Reactions, compliments, questions, and chatter that ask nothing of the performance are unclear. Do not judge whether the request is reasonable.',
    {
      mood: 'The message asks for a feeling or atmosphere, such as something sad, happy, calm, or tense.',
      tempo:
        'The message asks the performance to go faster or slower, or names a pace such as a lullaby or a sprint.',
      style:
        'The message asks for a genre or manner of playing, such as jazz, classical, bluesy, or bouncy.',
      specific_piece: 'The message names a song, piece, composer, or artist it wants to hear.',
      dynamics:
        'The message asks for the performance to be louder, softer, quieter, or more forceful.',
      stop: 'The message asks the performance to pause, stop, take a break, or end.',
      unclear:
        'The message asks nothing of the performance, or asks for something that fits none of the named controls.',
    },
    options,
  );
  return listenerRequestKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  listenerRequestKindInputSchema,
  listenerRequestKindResultSchema,
  listenerRequestKindVerdictSchema,
} from './schema.js';
export type {
  ListenerRequestKindInput,
  ListenerRequestKindResult,
  ListenerRequestKindVerdict,
} from './schema.js';
