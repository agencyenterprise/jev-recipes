import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { lossCauseKindInputSchema, lossCauseKindResultSchema } from './schema.js';
import type { LossCauseKindInput, LossCauseKindResult } from './schema.js';

export async function lossCauseKind(
  input: LossCauseKindInput,
  options: RecipeOptions = {},
): Promise<LossCauseKindResult> {
  const { minConfidence = 0.8, ...state } = lossCauseKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Decide which cause of loss narrative describes. Judge from what the claimant says caused the damage or loss, not from the type of damage alone. When the narrative describes a chain of events, choose the initiating cause it presents as responsible. Choose unclear when the narrative does not say what caused the loss or gives several causes with no dominant one.',
    {
      weather:
        'The narrative attributes the loss to a weather event such as wind, hail, lightning, a storm, flooding from rainfall, snow load, or freezing temperatures.',
      fire: 'The narrative attributes the loss to fire, smoke, or an explosion.',
      water:
        'The narrative attributes the loss to water from plumbing, appliances, roofs, or sewer backup rather than from a weather event.',
      theft:
        'The narrative attributes the loss to property being stolen, including burglary, robbery, or a break-in where items were taken.',
      collision:
        'The narrative attributes the loss to a vehicle, vessel, or object striking or being struck by another vehicle or object.',
      wear_and_tear:
        'The narrative attributes the loss to gradual deterioration, aging, corrosion, or lack of maintenance rather than a sudden event.',
      vandalism:
        'The narrative attributes the loss to deliberate damage or defacement by someone, without property being taken.',
      other:
        'The narrative clearly states a cause that fits none of the listed categories, such as a falling tree with no weather involved, an animal, or a dropped object.',
      unclear:
        'The narrative does not say what caused the loss, or it names several causes with no dominant one.',
    },
    options,
  );
  return lossCauseKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  lossCauseKindInputSchema,
  lossCauseKindResultSchema,
  lossCauseKindVerdictSchema,
} from './schema.js';
export type { LossCauseKindInput, LossCauseKindResult, LossCauseKindVerdict } from './schema.js';
