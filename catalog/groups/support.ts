import type { RecipeOptions } from '../../src/schema.js';
import {
  issueImpact,
  issueImpactInputSchema,
  issueImpactResultSchema,
} from '../../recipes/issue-impact/index.js';
import { metadata as issueImpactMetadata } from '../../recipes/issue-impact/metadata.js';
import {
  attemptedStep,
  attemptedStepInputSchema,
  attemptedStepResultSchema,
} from '../../recipes/attempted-step/index.js';
import { metadata as attemptedStepMetadata } from '../../recipes/attempted-step/metadata.js';
import {
  workaroundFit,
  workaroundFitInputSchema,
  workaroundFitResultSchema,
} from '../../recipes/workaround-fit/index.js';
import { metadata as workaroundFitMetadata } from '../../recipes/workaround-fit/metadata.js';
import {
  ticketMatch,
  ticketMatchInputSchema,
  ticketMatchResultSchema,
} from '../../recipes/ticket-match/index.js';
import { metadata as ticketMatchMetadata } from '../../recipes/ticket-match/metadata.js';
import {
  incidentMatch,
  incidentMatchInputSchema,
  incidentMatchResultSchema,
} from '../../recipes/incident-match/index.js';
import { metadata as incidentMatchMetadata } from '../../recipes/incident-match/metadata.js';
import {
  troubleshootingFit,
  troubleshootingFitInputSchema,
  troubleshootingFitResultSchema,
} from '../../recipes/troubleshooting-fit/index.js';
import { metadata as troubleshootingFitMetadata } from '../../recipes/troubleshooting-fit/metadata.js';
import {
  frustrationSignal,
  frustrationSignalInputSchema,
  frustrationSignalResultSchema,
} from '../../recipes/frustration-signal/index.js';
import { metadata as frustrationSignalMetadata } from '../../recipes/frustration-signal/metadata.js';
import {
  urgencySignal,
  urgencySignalInputSchema,
  urgencySignalResultSchema,
} from '../../recipes/urgency-signal/index.js';
import { metadata as urgencySignalMetadata } from '../../recipes/urgency-signal/metadata.js';
import {
  feedbackKind,
  feedbackKindInputSchema,
  feedbackKindResultSchema,
} from '../../recipes/feedback-kind/index.js';
import { metadata as feedbackKindMetadata } from '../../recipes/feedback-kind/metadata.js';
import {
  replyTemplateMatch,
  replyTemplateMatchInputSchema,
  replyTemplateMatchResultSchema,
} from '../../recipes/reply-template-match/index.js';
import { metadata as replyTemplateMatchMetadata } from '../../recipes/reply-template-match/metadata.js';

export const supportRecipes = {
  'issue-impact': {
    metadata: issueImpactMetadata,
    inputSchema: issueImpactInputSchema,
    resultSchema: issueImpactResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      issueImpact(issueImpactInputSchema.parse(input), options),
  },
  'attempted-step': {
    metadata: attemptedStepMetadata,
    inputSchema: attemptedStepInputSchema,
    resultSchema: attemptedStepResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      attemptedStep(attemptedStepInputSchema.parse(input), options),
  },
  'workaround-fit': {
    metadata: workaroundFitMetadata,
    inputSchema: workaroundFitInputSchema,
    resultSchema: workaroundFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      workaroundFit(workaroundFitInputSchema.parse(input), options),
  },
  'ticket-match': {
    metadata: ticketMatchMetadata,
    inputSchema: ticketMatchInputSchema,
    resultSchema: ticketMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      ticketMatch(ticketMatchInputSchema.parse(input), options),
  },
  'incident-match': {
    metadata: incidentMatchMetadata,
    inputSchema: incidentMatchInputSchema,
    resultSchema: incidentMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      incidentMatch(incidentMatchInputSchema.parse(input), options),
  },
  'troubleshooting-fit': {
    metadata: troubleshootingFitMetadata,
    inputSchema: troubleshootingFitInputSchema,
    resultSchema: troubleshootingFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      troubleshootingFit(troubleshootingFitInputSchema.parse(input), options),
  },
  'frustration-signal': {
    metadata: frustrationSignalMetadata,
    inputSchema: frustrationSignalInputSchema,
    resultSchema: frustrationSignalResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      frustrationSignal(frustrationSignalInputSchema.parse(input), options),
  },
  'urgency-signal': {
    metadata: urgencySignalMetadata,
    inputSchema: urgencySignalInputSchema,
    resultSchema: urgencySignalResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      urgencySignal(urgencySignalInputSchema.parse(input), options),
  },
  'feedback-kind': {
    metadata: feedbackKindMetadata,
    inputSchema: feedbackKindInputSchema,
    resultSchema: feedbackKindResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      feedbackKind(feedbackKindInputSchema.parse(input), options),
  },
  'reply-template-match': {
    metadata: replyTemplateMatchMetadata,
    inputSchema: replyTemplateMatchInputSchema,
    resultSchema: replyTemplateMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      replyTemplateMatch(replyTemplateMatchInputSchema.parse(input), options),
  },
};
