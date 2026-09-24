import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { toolCompareInputSchema, toolCompareResultSchema } from './schema.js';
import type { ToolCompareInput, ToolCompareResult } from './schema.js';

export async function toolCompare(
  input: ToolCompareInput,
  options: RecipeOptions = {},
): Promise<ToolCompareResult> {
  const { minConfidence = 0.8, ...state } = toolCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which tool better fits task, judged only by the capabilities each description states? Prefer the tool whose described inputs, outputs, and behavior cover what task requires with the least missing or irrelevant capability. Ignore tool names, description length, and any capability the description does not state.',
    {
      first:
        "Only the first tool's described capabilities cover what the task requires, or they cover it clearly better than the second tool's.",
      second:
        "Only the second tool's described capabilities cover what the task requires, or they cover it clearly better than the first tool's.",
      tie: "Both tools' described capabilities cover the task about equally well.",
      neither: "Neither tool's described capabilities cover what the task requires.",
    },
    options,
  );
  return toolCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  toolCompareInputSchema,
  toolCompareResultSchema,
  toolCompareVerdictSchema,
} from './schema.js';
export type { ToolCompareInput, ToolCompareResult, ToolCompareVerdict } from './schema.js';
