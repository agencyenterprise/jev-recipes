import type { RecipeOptions } from '../../src/schema.js';
import {
  answerCoverage,
  answerCoverageInputSchema,
  answerCoverageResultSchema,
} from '../../recipes/answer-coverage/index.js';
import { metadata as answerCoverageMetadata } from '../../recipes/answer-coverage/metadata.js';
import {
  answerRelevance,
  answerRelevanceInputSchema,
  answerRelevanceResultSchema,
} from '../../recipes/answer-relevance/index.js';
import { metadata as answerRelevanceMetadata } from '../../recipes/answer-relevance/metadata.js';
import {
  citationMatch,
  citationMatchInputSchema,
  citationMatchResultSchema,
} from '../../recipes/citation-match/index.js';
import { metadata as citationMatchMetadata } from '../../recipes/citation-match/metadata.js';
import {
  citationNeeded,
  citationNeededInputSchema,
  citationNeededResultSchema,
} from '../../recipes/citation-needed/index.js';
import { metadata as citationNeededMetadata } from '../../recipes/citation-needed/metadata.js';
import {
  answerConsistency,
  answerConsistencyInputSchema,
  answerConsistencyResultSchema,
} from '../../recipes/answer-consistency/index.js';
import { metadata as answerConsistencyMetadata } from '../../recipes/answer-consistency/metadata.js';
import {
  summaryCoverage,
  summaryCoverageInputSchema,
  summaryCoverageResultSchema,
} from '../../recipes/summary-coverage/index.js';
import { metadata as summaryCoverageMetadata } from '../../recipes/summary-coverage/metadata.js';
import {
  certaintyMatch,
  certaintyMatchInputSchema,
  certaintyMatchResultSchema,
} from '../../recipes/certainty-match/index.js';
import { metadata as certaintyMatchMetadata } from '../../recipes/certainty-match/metadata.js';
import {
  promiseCheck,
  promiseCheckInputSchema,
  promiseCheckResultSchema,
} from '../../recipes/promise-check/index.js';
import { metadata as promiseCheckMetadata } from '../../recipes/promise-check/metadata.js';
import {
  toneCheck,
  toneCheckInputSchema,
  toneCheckResultSchema,
} from '../../recipes/tone-check/index.js';
import { metadata as toneCheckMetadata } from '../../recipes/tone-check/metadata.js';
import {
  draftCompare,
  draftCompareInputSchema,
  draftCompareResultSchema,
} from '../../recipes/draft-compare/index.js';
import { metadata as draftCompareMetadata } from '../../recipes/draft-compare/metadata.js';

export const answersRecipes = {
  'answer-coverage': {
    metadata: answerCoverageMetadata,
    inputSchema: answerCoverageInputSchema,
    resultSchema: answerCoverageResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      answerCoverage(answerCoverageInputSchema.parse(input), options),
  },
  'answer-relevance': {
    metadata: answerRelevanceMetadata,
    inputSchema: answerRelevanceInputSchema,
    resultSchema: answerRelevanceResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      answerRelevance(answerRelevanceInputSchema.parse(input), options),
  },
  'citation-match': {
    metadata: citationMatchMetadata,
    inputSchema: citationMatchInputSchema,
    resultSchema: citationMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      citationMatch(citationMatchInputSchema.parse(input), options),
  },
  'citation-needed': {
    metadata: citationNeededMetadata,
    inputSchema: citationNeededInputSchema,
    resultSchema: citationNeededResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      citationNeeded(citationNeededInputSchema.parse(input), options),
  },
  'answer-consistency': {
    metadata: answerConsistencyMetadata,
    inputSchema: answerConsistencyInputSchema,
    resultSchema: answerConsistencyResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      answerConsistency(answerConsistencyInputSchema.parse(input), options),
  },
  'summary-coverage': {
    metadata: summaryCoverageMetadata,
    inputSchema: summaryCoverageInputSchema,
    resultSchema: summaryCoverageResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      summaryCoverage(summaryCoverageInputSchema.parse(input), options),
  },
  'certainty-match': {
    metadata: certaintyMatchMetadata,
    inputSchema: certaintyMatchInputSchema,
    resultSchema: certaintyMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      certaintyMatch(certaintyMatchInputSchema.parse(input), options),
  },
  'promise-check': {
    metadata: promiseCheckMetadata,
    inputSchema: promiseCheckInputSchema,
    resultSchema: promiseCheckResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      promiseCheck(promiseCheckInputSchema.parse(input), options),
  },
  'tone-check': {
    metadata: toneCheckMetadata,
    inputSchema: toneCheckInputSchema,
    resultSchema: toneCheckResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      toneCheck(toneCheckInputSchema.parse(input), options),
  },
  'draft-compare': {
    metadata: draftCompareMetadata,
    inputSchema: draftCompareInputSchema,
    resultSchema: draftCompareResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      draftCompare(draftCompareInputSchema.parse(input), options),
  },
};
