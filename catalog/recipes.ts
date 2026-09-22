import type { RecipeOptions } from '../src/schema.js';
import { route, routeInputSchema, routeResultSchema } from '../recipes/route/index.js';
import { metadata as routeMetadata } from '../recipes/route/metadata.js';
import { rerank, rerankInputSchema, rerankResultSchema } from '../recipes/rerank/index.js';
import { metadata as rerankMetadata } from '../recipes/rerank/metadata.js';
import { verify, verifyInputSchema, verifyResultSchema } from '../recipes/verify/index.js';
import { metadata as verifyMetadata } from '../recipes/verify/metadata.js';
import {
  answerability,
  answerabilityInputSchema,
  answerabilityResultSchema,
} from '../recipes/answerability/index.js';
import { metadata as answerabilityMetadata } from '../recipes/answerability/metadata.js';
import { clarify, clarifyInputSchema, clarifyResultSchema } from '../recipes/clarify/index.js';
import { metadata as clarifyMetadata } from '../recipes/clarify/metadata.js';
import { handoff, handoffInputSchema, handoffResultSchema } from '../recipes/handoff/index.js';
import { metadata as handoffMetadata } from '../recipes/handoff/metadata.js';

export const recipes = {
  route: {
    metadata: routeMetadata,
    inputSchema: routeInputSchema,
    resultSchema: routeResultSchema,
    run: (input: unknown, options?: RecipeOptions) => route(routeInputSchema.parse(input), options),
  },
  rerank: {
    metadata: rerankMetadata,
    inputSchema: rerankInputSchema,
    resultSchema: rerankResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      rerank(rerankInputSchema.parse(input), options),
  },
  verify: {
    metadata: verifyMetadata,
    inputSchema: verifyInputSchema,
    resultSchema: verifyResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      verify(verifyInputSchema.parse(input), options),
  },
  answerability: {
    metadata: answerabilityMetadata,
    inputSchema: answerabilityInputSchema,
    resultSchema: answerabilityResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      answerability(answerabilityInputSchema.parse(input), options),
  },
  clarify: {
    metadata: clarifyMetadata,
    inputSchema: clarifyInputSchema,
    resultSchema: clarifyResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      clarify(clarifyInputSchema.parse(input), options),
  },
  handoff: {
    metadata: handoffMetadata,
    inputSchema: handoffInputSchema,
    resultSchema: handoffResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      handoff(handoffInputSchema.parse(input), options),
  },
};
