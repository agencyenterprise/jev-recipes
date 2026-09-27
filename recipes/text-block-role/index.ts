import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { textBlockRoleInputSchema, textBlockRoleResultSchema } from './schema.js';
import type { TextBlockRoleInput, TextBlockRoleResult } from './schema.js';

export async function textBlockRole(
  input: TextBlockRoleInput,
  options: RecipeOptions = {},
): Promise<TextBlockRoleResult> {
  const { minConfidence = 0.8, ...state } = textBlockRoleInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What structural role does text play in its source document? Use before, after, and context only to interpret this block. Choose the role of text itself, not the subject it discusses. Code discussed in prose is body; a description of a table is not a table. A short sentence is not necessarily a heading. Choose unclear when the supplied text cannot distinguish plausible roles. Never infer missing text.',
    {
      heading: 'A title or section label introducing the content that follows.',
      body: 'Ordinary prose forming a paragraph, including signature prose and explanations.',
      list_item: 'One item in an enumeration or a bulleted list.',
      code: 'Source code, a shell command, or a program fragment.',
      table: 'Text arranged into rows and columns representing tabular relationships.',
      caption: 'A label or description specifically attached to a figure or table.',
      formula: 'A mathematical expression or equation, rather than prose mentioning mathematics.',
      other: 'A clear structural role outside these categories, such as page furniture.',
      unclear: 'Several roles remain plausible or the text is insufficient.',
    },
    options,
  );
  return textBlockRoleResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  textBlockRoleInputSchema,
  textBlockRoleResultSchema,
  textBlockRoleVerdictSchema,
} from './schema.js';
export type { TextBlockRoleInput, TextBlockRoleResult, TextBlockRoleVerdict } from './schema.js';
