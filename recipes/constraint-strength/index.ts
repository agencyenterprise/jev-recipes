import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { constraintStrengthInputSchema, constraintStrengthResultSchema } from './schema.js';
import type { ConstraintStrengthInput, ConstraintStrengthResult } from './schema.js';

export async function constraintStrength(
  input: ConstraintStrengthInput,
  options: RecipeOptions = {},
): Promise<ConstraintStrengthResult> {
  const { minConfidence = 0.8, ...state } = constraintStrengthInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How binding is the single constraint expressed by statement in context? Interpret the expressed wording and qualifications, not hidden intent or keyword matches alone. A prohibition can be required. A stated preference is preferred when alternatives remain acceptable; optional requires explicit discretion with no stated preference. A condition describes when a constraint applies and does not by itself make the constraint optional. Do not infer authority, permission, consent, or a lasting user preference. Choose unclear for unresolved mixed constraints, hypothetical wording, or text that does not establish a constraint.',
    {
      required:
        'The statement presents an obligation or prohibition that must be met whenever its stated condition applies.',
      preferred:
        'The statement favors an outcome but explicitly or unambiguously allows alternatives.',
      optional: 'The statement explicitly leaves the choice open without favoring an outcome.',
      unclear:
        'The wording or context does not establish one constraint with a clear level of obligation.',
    },
    options,
  );
  return constraintStrengthResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  constraintStrengthInputSchema,
  constraintStrengthResultSchema,
  constraintStrengthVerdictSchema,
} from './schema.js';
export type {
  ConstraintStrengthInput,
  ConstraintStrengthResult,
  ConstraintStrengthVerdict,
} from './schema.js';
