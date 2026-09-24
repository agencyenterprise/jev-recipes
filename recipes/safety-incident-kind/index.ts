import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { safetyIncidentKindInputSchema, safetyIncidentKindResultSchema } from './schema.js';
import type { SafetyIncidentKindInput, SafetyIncidentKindResult } from './schema.js';

export async function safetyIncidentKind(
  input: SafetyIncidentKindInput,
  options: RecipeOptions = {},
): Promise<SafetyIncidentKindResult> {
  const { minConfidence = 0.8, ...state } = safetyIncidentKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Read report and decide what kind of safety event it describes, based only on the consequences the report states. When the report describes more than one consequence, pick the kind involving a person over damage or release, and release over damage. Use unsafe_condition only when no event has occurred and the report describes a hazard that exists. Use unclear when the report does not say what happened or what the consequences were. Ignore the reporter's own classification, blame, and tone.",
    {
      near_miss:
        'An event occurred that could have injured someone, damaged property, or released a substance but did not, such as a close call or a dropped load that struck nothing.',
      first_aid:
        'A person was hurt and the report describes treatment limited to first aid, such as cleaning and bandaging a cut, an ice pack, or a plaster, with no clinic or hospital visit.',
      medical_treatment:
        'A person was hurt and the report describes treatment beyond first aid, such as a clinic or hospital visit, sutures, a prescription, restricted duty, or time away from work.',
      property_damage: 'Equipment, product, or the facility was damaged and no person was hurt.',
      environmental_release:
        'A substance was spilled, leaked, or emitted outside its intended containment, whether or not anyone was hurt or anything was damaged.',
      unsafe_condition:
        'No event occurred; the report describes a hazard that exists, such as a blocked exit, a missing machine guard, a damaged railing, or a leaking valve not yet releasing.',
      unclear:
        'The report does not say enough about what happened or its consequences to tell which kind of event it describes.',
    },
    options,
  );
  return safetyIncidentKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  safetyIncidentKindInputSchema,
  safetyIncidentKindResultSchema,
  safetyIncidentKindVerdictSchema,
} from './schema.js';
export type {
  SafetyIncidentKindInput,
  SafetyIncidentKindResult,
  SafetyIncidentKindVerdict,
} from './schema.js';
