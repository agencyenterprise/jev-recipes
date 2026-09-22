import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { documentRoleInputSchema, documentRoleResultSchema } from './schema.js';
import type { DocumentRoleInput, DocumentRoleResult } from './schema.js';

export async function documentRole(
  input: DocumentRoleInput,
  options: RecipeOptions = {},
): Promise<DocumentRoleResult> {
  const { minConfidence = 0.8, ...state } = documentRoleInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the primary purpose of document? Judge the actual content rather than a title alone. Choose unclear if several purposes are equally central.',
    {
      policy: 'Defines rules, permissions, requirements, or allowed behavior.',
      tutorial: 'Teaches a task through a guided sequence.',
      reference: 'Describes interfaces, features, or facts for lookup.',
      troubleshooting: 'Helps diagnose or resolve a described problem.',
      release_note: 'Describes changes in a release or update.',
      other: 'Has a clear purpose outside the listed roles.',
      unclear: 'The primary role cannot be established.',
    },
    options,
  );
  return documentRoleResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  documentRoleInputSchema,
  documentRoleResultSchema,
  documentRoleVerdictSchema,
} from './schema.js';
export type { DocumentRoleInput, DocumentRoleResult, DocumentRoleVerdict } from './schema.js';
