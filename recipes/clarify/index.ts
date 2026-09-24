import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { clarifyInputSchema, clarifyResultSchema } from './schema.js';
import type { ClarifyInput, ClarifyResult } from './schema.js';

export async function clarify(
  input: ClarifyInput,
  options: RecipeOptions = {},
): Promise<ClarifyResult> {
  const { request, context, requirements, minConfidence = 0.8 } = clarifyInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    { request, context: context ?? '', requirements },
    requirements,
    (index) =>
      `Is the information described by requirements[${index}].description supplied in the request or context?`,
    {
      present: 'The required information is explicitly supplied or unambiguously implied.',
      missing: 'Nothing in the request or context refers to this information at all.',
      ambiguous:
        'The request or context refers to this information, but it is vague, underspecified, conflicting, or open to multiple readings, so a follow-up question is needed to pin it down.',
    },
    options,
    'requirement',
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence >= minConfidence ? 'ready' : 'review',
  }));

  return clarifyResultSchema.parse({
    ...evaluation,
    checks,
    status: checks.every((check) => check.status === 'ready') ? 'ready' : 'review',
    canProceed: checks.every((check) => check.status === 'ready' && check.verdict === 'present'),
    missing: checks
      .filter((check) => check.status === 'ready' && check.verdict === 'missing')
      .map((check) => check.id),
    ambiguous: checks
      .filter((check) => check.status === 'ready' && check.verdict === 'ambiguous')
      .map((check) => check.id),
  });
}

export { clarifyInputSchema, clarifyResultSchema } from './schema.js';
export type {
  ClarifyInput,
  ClarifyRequirement,
  ClarifyResult,
  RequirementVerdict,
} from './schema.js';
