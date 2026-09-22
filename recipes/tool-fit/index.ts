import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { toolFitInputSchema, toolFitResultSchema } from './schema.js';
import type { ToolFitInput, ToolFitResult } from './schema.js';

export async function toolFit(
  input: ToolFitInput,
  options: RecipeOptions = {},
): Promise<ToolFitResult> {
  const { minConfidence = 0.8, ...state } = toolFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Can the capabilities explicitly described in tool perform task? Do not assume capabilities that are not described. Capability fit is separate from permission to invoke the tool.',
    {
      fits: 'The described capabilities can perform the requested task.',
      does_not_fit: 'The described capabilities do not cover the task or explicitly exclude it.',
      unclear: 'The capability description lacks facts needed to decide.',
    },
    options,
  );
  return toolFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { toolFitInputSchema, toolFitResultSchema, toolFitVerdictSchema } from './schema.js';
export type { ToolFitInput, ToolFitResult, ToolFitVerdict } from './schema.js';
