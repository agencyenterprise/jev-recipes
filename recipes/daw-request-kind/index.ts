import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { dawRequestKindInputSchema, dawRequestKindResultSchema } from './schema.js';
import type { DawRequestKindInput, DawRequestKindResult } from './schema.js';

export async function dawRequestKind(
  input: DawRequestKindInput,
  options: RecipeOptions = {},
): Promise<DawRequestKindResult> {
  const { minConfidence = 0.8, ...state } = dawRequestKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read request, a spoken or typed instruction to a DAW or music program, and decide which kind of operation it asks for. Judge by what the program would have to do, not by the words used: quantizing, trimming, and moving clips are edit operations, changing a level or pan is a mix operation, and adding or changing reverb, compression, or EQ is an effect operation. Pick the single kind request presses most. Use unclear when request does not ask the program to do anything recognizable, such as a general question or chatter.',
    {
      record:
        'The request asks to start, stop, arm, punch in, loop-record, or otherwise capture new audio or MIDI.',
      edit: 'The request asks to cut, trim, split, move, copy, delete, quantize, stretch, or otherwise change existing clips or notes in place.',
      mix: 'The request asks to change levels, panning, sends, buses, mute or solo state, or automation of those parameters.',
      effect:
        'The request asks to add, remove, bypass, or change the settings of an effect or processor such as reverb, delay, compression, EQ, or distortion.',
      arrange:
        'The request asks to add, remove, rename, or reorder tracks or sections, change tempo or time signature, set markers, or otherwise change the structure of the project.',
      export:
        'The request asks to bounce, render, export, share, or save the project or a part of it to a file or destination.',
      unclear:
        'The request does not ask the program to perform a recognizable operation, or is too vague to tell which kind it wants.',
    },
    options,
  );
  return dawRequestKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  dawRequestKindInputSchema,
  dawRequestKindResultSchema,
  dawRequestKindVerdictSchema,
} from './schema.js';
export type { DawRequestKindInput, DawRequestKindResult, DawRequestKindVerdict } from './schema.js';
