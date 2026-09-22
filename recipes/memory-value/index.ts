import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { memoryValueInputSchema, memoryValueResultSchema } from './schema.js';
import type { MemoryValueInput, MemoryValueResult } from './schema.js';

export async function memoryValue(
  input: MemoryValueInput,
  options: RecipeOptions = {},
): Promise<MemoryValueResult> {
  const { minConfidence = 0.8, ...state } = memoryValueInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How useful is fact for future work under purpose? Distinguish lasting relevance from a current-task detail. Use the supplied purpose rather than assuming every personal fact is worth retaining.',
    {
      ongoing_value:
        'The fact has a clear recurring use for the supplied purpose beyond this task.',
      task_only: 'The fact helps the current task but has no established recurring use.',
      incidental: 'The fact has no clear use for the supplied purpose.',
      unclear: 'Its future usefulness cannot be established.',
    },
    options,
  );
  return memoryValueResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  memoryValueInputSchema,
  memoryValueResultSchema,
  memoryValueVerdictSchema,
} from './schema.js';
export type { MemoryValueInput, MemoryValueResult, MemoryValueVerdict } from './schema.js';
