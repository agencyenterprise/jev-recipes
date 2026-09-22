import { clarify, clarifyInputSchema, clarifyResultSchema } from '../../recipes/clarify/index.js';
import { metadata as clarifyMetadata } from '../../recipes/clarify/metadata.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  turnIntent,
  turnIntentInputSchema,
  turnIntentResultSchema,
} from '../../recipes/turn-intent/index.js';
import { metadata as turnIntentMetadata } from '../../recipes/turn-intent/metadata.js';
import {
  followupLink,
  followupLinkInputSchema,
  followupLinkResultSchema,
} from '../../recipes/followup-link/index.js';
import { metadata as followupLinkMetadata } from '../../recipes/followup-link/metadata.js';
import {
  referenceResolve,
  referenceResolveInputSchema,
  referenceResolveResultSchema,
} from '../../recipes/reference-resolve/index.js';
import { metadata as referenceResolveMetadata } from '../../recipes/reference-resolve/metadata.js';
import {
  intentChange,
  intentChangeInputSchema,
  intentChangeResultSchema,
} from '../../recipes/intent-change/index.js';
import { metadata as intentChangeMetadata } from '../../recipes/intent-change/metadata.js';
import {
  correctionTarget,
  correctionTargetInputSchema,
  correctionTargetResultSchema,
} from '../../recipes/correction-target/index.js';
import { metadata as correctionTargetMetadata } from '../../recipes/correction-target/metadata.js';
import {
  confirmationMatch,
  confirmationMatchInputSchema,
  confirmationMatchResultSchema,
} from '../../recipes/confirmation-match/index.js';
import { metadata as confirmationMatchMetadata } from '../../recipes/confirmation-match/metadata.js';
import {
  cancellationCheck,
  cancellationCheckInputSchema,
  cancellationCheckResultSchema,
} from '../../recipes/cancellation-check/index.js';
import { metadata as cancellationCheckMetadata } from '../../recipes/cancellation-check/metadata.js';
import {
  topicShift,
  topicShiftInputSchema,
  topicShiftResultSchema,
} from '../../recipes/topic-shift/index.js';
import { metadata as topicShiftMetadata } from '../../recipes/topic-shift/metadata.js';
import {
  responseNeeded,
  responseNeededInputSchema,
  responseNeededResultSchema,
} from '../../recipes/response-needed/index.js';
import { metadata as responseNeededMetadata } from '../../recipes/response-needed/metadata.js';
import {
  resolutionCheck,
  resolutionCheckInputSchema,
  resolutionCheckResultSchema,
} from '../../recipes/resolution-check/index.js';
import { metadata as resolutionCheckMetadata } from '../../recipes/resolution-check/metadata.js';

export const conversationRecipes = {
  clarify: {
    metadata: clarifyMetadata,
    inputSchema: clarifyInputSchema,
    resultSchema: clarifyResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      clarify(clarifyInputSchema.parse(input), options),
  },
  'turn-intent': {
    metadata: turnIntentMetadata,
    inputSchema: turnIntentInputSchema,
    resultSchema: turnIntentResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      turnIntent(turnIntentInputSchema.parse(input), options),
  },
  'followup-link': {
    metadata: followupLinkMetadata,
    inputSchema: followupLinkInputSchema,
    resultSchema: followupLinkResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      followupLink(followupLinkInputSchema.parse(input), options),
  },
  'reference-resolve': {
    metadata: referenceResolveMetadata,
    inputSchema: referenceResolveInputSchema,
    resultSchema: referenceResolveResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      referenceResolve(referenceResolveInputSchema.parse(input), options),
  },
  'intent-change': {
    metadata: intentChangeMetadata,
    inputSchema: intentChangeInputSchema,
    resultSchema: intentChangeResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      intentChange(intentChangeInputSchema.parse(input), options),
  },
  'correction-target': {
    metadata: correctionTargetMetadata,
    inputSchema: correctionTargetInputSchema,
    resultSchema: correctionTargetResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      correctionTarget(correctionTargetInputSchema.parse(input), options),
  },
  'confirmation-match': {
    metadata: confirmationMatchMetadata,
    inputSchema: confirmationMatchInputSchema,
    resultSchema: confirmationMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      confirmationMatch(confirmationMatchInputSchema.parse(input), options),
  },
  'cancellation-check': {
    metadata: cancellationCheckMetadata,
    inputSchema: cancellationCheckInputSchema,
    resultSchema: cancellationCheckResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      cancellationCheck(cancellationCheckInputSchema.parse(input), options),
  },
  'topic-shift': {
    metadata: topicShiftMetadata,
    inputSchema: topicShiftInputSchema,
    resultSchema: topicShiftResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      topicShift(topicShiftInputSchema.parse(input), options),
  },
  'response-needed': {
    metadata: responseNeededMetadata,
    inputSchema: responseNeededInputSchema,
    resultSchema: responseNeededResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      responseNeeded(responseNeededInputSchema.parse(input), options),
  },
  'resolution-check': {
    metadata: resolutionCheckMetadata,
    inputSchema: resolutionCheckInputSchema,
    resultSchema: resolutionCheckResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      resolutionCheck(resolutionCheckInputSchema.parse(input), options),
  },
};
