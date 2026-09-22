import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { incidentMatchInputSchema } from './schema.js';
import type { IncidentMatchInput, IncidentMatchResult } from './schema.js';

export async function incidentMatch(
  input: IncidentMatchInput,
  options: RecipeOptions = {},
): Promise<IncidentMatchResult> {
  const { minConfidence = 0.8, ...state } = incidentMatchInputSchema.parse(input);
  return selectCandidate(
    state,
    state.incidents,
    'Which supplied incident is supported as a match for ticket? Require compatible affected functionality and supplied scope. Shared words alone are insufficient.',
    minConfidence,
    options,
  );
}

export { incidentMatchInputSchema, incidentMatchResultSchema } from './schema.js';
export type { IncidentMatchInput, IncidentMatchResult } from './schema.js';
