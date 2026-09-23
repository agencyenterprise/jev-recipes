import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemSchema,
} from '../../src/schema.js';

export const chooseActionInputSchema = z.object({
  player: nonEmptyText.describe('The player whose next action should be chosen.'),
  objective: nonEmptyText.describe(
    'The goal or scoring preference used to compare eligible actions.',
  ),
  rules: nonEmptyText.describe(
    'Applicable game rules, including turn, phase, resource, and action constraints.',
  ),
  environment: nonEmptyText.describe(
    'The current game snapshot available to the player, after the supplied history.',
  ),
  actions: z
    .array(textItemSchema)
    .min(1)
    .refine(
      (actions) => new Set(actions.map((action) => action.id)).size === actions.length,
      'Action IDs must be unique.',
    )
    .describe('One or more candidate actions with unique IDs and concrete action descriptions.'),
  history: z
    .array(
      z.object({
        player: nonEmptyText.describe('The player who took the recorded action.'),
        action: nonEmptyText.describe(
          'The observed action, including its known outcome when relevant.',
        ),
      }),
    )
    .max(100)
    .describe('Optional observed actions by any players, oldest first. May be empty or incomplete.')
    .optional(),
  minConfidence: probability.optional(),
});
export const chooseActionResultSchema = selectionResultSchema;
export type ChooseActionInput = z.infer<typeof chooseActionInputSchema>;
export type ChooseActionResult = z.infer<typeof chooseActionResultSchema>;
