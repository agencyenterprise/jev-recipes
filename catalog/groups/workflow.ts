import { route, routeInputSchema, routeResultSchema } from '../../recipes/route/index.js';
import { metadata as routeMetadata } from '../../recipes/route/metadata.js';
import { handoff, handoffInputSchema, handoffResultSchema } from '../../recipes/handoff/index.js';
import { metadata as handoffMetadata } from '../../recipes/handoff/metadata.js';
import type { RecipeOptions } from '../../src/schema.js';
import { toolFit, toolFitInputSchema, toolFitResultSchema } from '../../recipes/tool-fit/index.js';
import { metadata as toolFitMetadata } from '../../recipes/tool-fit/metadata.js';
import {
  argumentFit,
  argumentFitInputSchema,
  argumentFitResultSchema,
} from '../../recipes/argument-fit/index.js';
import { metadata as argumentFitMetadata } from '../../recipes/argument-fit/metadata.js';
import {
  resultUsefulness,
  resultUsefulnessInputSchema,
  resultUsefulnessResultSchema,
} from '../../recipes/result-usefulness/index.js';
import { metadata as resultUsefulnessMetadata } from '../../recipes/result-usefulness/metadata.js';
import {
  resultOutcome,
  resultOutcomeInputSchema,
  resultOutcomeResultSchema,
} from '../../recipes/result-outcome/index.js';
import { metadata as resultOutcomeMetadata } from '../../recipes/result-outcome/metadata.js';
import {
  actionScope,
  actionScopeInputSchema,
  actionScopeResultSchema,
} from '../../recipes/action-scope/index.js';
import { metadata as actionScopeMetadata } from '../../recipes/action-scope/metadata.js';
import {
  stepProgress,
  stepProgressInputSchema,
  stepProgressResultSchema,
} from '../../recipes/step-progress/index.js';
import { metadata as stepProgressMetadata } from '../../recipes/step-progress/metadata.js';
import {
  repeatedAttempt,
  repeatedAttemptInputSchema,
  repeatedAttemptResultSchema,
} from '../../recipes/repeated-attempt/index.js';
import { metadata as repeatedAttemptMetadata } from '../../recipes/repeated-attempt/metadata.js';
import {
  stepComplete,
  stepCompleteInputSchema,
  stepCompleteResultSchema,
} from '../../recipes/step-complete/index.js';
import { metadata as stepCompleteMetadata } from '../../recipes/step-complete/metadata.js';
import {
  failureKind,
  failureKindInputSchema,
  failureKindResultSchema,
} from '../../recipes/failure-kind/index.js';
import { metadata as failureKindMetadata } from '../../recipes/failure-kind/metadata.js';
import {
  instructionFit,
  instructionFitInputSchema,
  instructionFitResultSchema,
} from '../../recipes/instruction-fit/index.js';
import { metadata as instructionFitMetadata } from '../../recipes/instruction-fit/metadata.js';

export const workflowRecipes = {
  route: {
    metadata: routeMetadata,
    inputSchema: routeInputSchema,
    resultSchema: routeResultSchema,
    run: (input: unknown, options?: RecipeOptions) => route(routeInputSchema.parse(input), options),
  },
  handoff: {
    metadata: handoffMetadata,
    inputSchema: handoffInputSchema,
    resultSchema: handoffResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      handoff(handoffInputSchema.parse(input), options),
  },
  'tool-fit': {
    metadata: toolFitMetadata,
    inputSchema: toolFitInputSchema,
    resultSchema: toolFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      toolFit(toolFitInputSchema.parse(input), options),
  },
  'argument-fit': {
    metadata: argumentFitMetadata,
    inputSchema: argumentFitInputSchema,
    resultSchema: argumentFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      argumentFit(argumentFitInputSchema.parse(input), options),
  },
  'result-usefulness': {
    metadata: resultUsefulnessMetadata,
    inputSchema: resultUsefulnessInputSchema,
    resultSchema: resultUsefulnessResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      resultUsefulness(resultUsefulnessInputSchema.parse(input), options),
  },
  'result-outcome': {
    metadata: resultOutcomeMetadata,
    inputSchema: resultOutcomeInputSchema,
    resultSchema: resultOutcomeResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      resultOutcome(resultOutcomeInputSchema.parse(input), options),
  },
  'action-scope': {
    metadata: actionScopeMetadata,
    inputSchema: actionScopeInputSchema,
    resultSchema: actionScopeResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      actionScope(actionScopeInputSchema.parse(input), options),
  },
  'step-progress': {
    metadata: stepProgressMetadata,
    inputSchema: stepProgressInputSchema,
    resultSchema: stepProgressResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      stepProgress(stepProgressInputSchema.parse(input), options),
  },
  'repeated-attempt': {
    metadata: repeatedAttemptMetadata,
    inputSchema: repeatedAttemptInputSchema,
    resultSchema: repeatedAttemptResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      repeatedAttempt(repeatedAttemptInputSchema.parse(input), options),
  },
  'step-complete': {
    metadata: stepCompleteMetadata,
    inputSchema: stepCompleteInputSchema,
    resultSchema: stepCompleteResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      stepComplete(stepCompleteInputSchema.parse(input), options),
  },
  'failure-kind': {
    metadata: failureKindMetadata,
    inputSchema: failureKindInputSchema,
    resultSchema: failureKindResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      failureKind(failureKindInputSchema.parse(input), options),
  },
  'instruction-fit': {
    metadata: instructionFitMetadata,
    inputSchema: instructionFitInputSchema,
    resultSchema: instructionFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      instructionFit(instructionFitInputSchema.parse(input), options),
  },
};
