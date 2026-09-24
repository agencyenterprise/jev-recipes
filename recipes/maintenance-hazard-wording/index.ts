import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  maintenanceHazardWordingInputSchema,
  maintenanceHazardWordingResultSchema,
} from './schema.js';
import type { MaintenanceHazardWordingInput, MaintenanceHazardWordingResult } from './schema.js';

export async function maintenanceHazardWording(
  input: MaintenanceHazardWordingInput,
  options: RecipeOptions = {},
): Promise<MaintenanceHazardWordingResult> {
  const { minConfidence = 0.8, ...state } = maintenanceHazardWordingInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read the maintenance request and decide whether it describes a safety hazard: a gas or burning smell, active water intrusion or flooding, exposed or sparking wiring, structural damage such as a sagging ceiling or cracked support, loss of heat during cold weather, a blocked or non-functioning exit, or a comparable threat to occupants. Judge what request describes, not how urgently it is worded: a calm report of a gas smell is a hazard and an angry report of a dripping faucet is routine. Ignore tone, length, and whether the tenant proposes a fix.',
    {
      true: 'The request describes a condition that threatens occupant safety, such as a gas smell, active leaking or flooding, exposed or sparking wiring, structural damage, no heat in cold conditions, or a blocked exit.',
      false:
        'The request describes a repair, cosmetic, comfort, or appliance problem that does not threaten occupant safety, such as a dripping faucet, a broken cabinet hinge, or a slow drain.',
    },
    options,
  );
  return maintenanceHazardWordingResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'hazard' : 'routine',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  maintenanceHazardWordingInputSchema,
  maintenanceHazardWordingResultSchema,
  maintenanceHazardWordingVerdictSchema,
} from './schema.js';
export type {
  MaintenanceHazardWordingInput,
  MaintenanceHazardWordingResult,
  MaintenanceHazardWordingVerdict,
} from './schema.js';
