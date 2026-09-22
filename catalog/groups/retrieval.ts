import { rerank, rerankInputSchema, rerankResultSchema } from '../../recipes/rerank/index.js';
import { metadata as rerankMetadata } from '../../recipes/rerank/metadata.js';
import { verify, verifyInputSchema, verifyResultSchema } from '../../recipes/verify/index.js';
import { metadata as verifyMetadata } from '../../recipes/verify/metadata.js';
import { answerability, answerabilityInputSchema, answerabilityResultSchema } from '../../recipes/answerability/index.js';
import { metadata as answerabilityMetadata } from '../../recipes/answerability/metadata.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  retrievalNeeded,
  retrievalNeededInputSchema,
  retrievalNeededResultSchema,
} from '../../recipes/retrieval-needed/index.js';
import { metadata as retrievalNeededMetadata } from '../../recipes/retrieval-needed/metadata.js';
import {
  freshnessNeeded,
  freshnessNeededInputSchema,
  freshnessNeededResultSchema,
} from '../../recipes/freshness-needed/index.js';
import { metadata as freshnessNeededMetadata } from '../../recipes/freshness-needed/metadata.js';
import {
  sourceApplicability,
  sourceApplicabilityInputSchema,
  sourceApplicabilityResultSchema,
} from '../../recipes/source-applicability/index.js';
import { metadata as sourceApplicabilityMetadata } from '../../recipes/source-applicability/metadata.js';
import {
  evidenceConflict,
  evidenceConflictInputSchema,
  evidenceConflictResultSchema,
} from '../../recipes/evidence-conflict/index.js';
import { metadata as evidenceConflictMetadata } from '../../recipes/evidence-conflict/metadata.js';
import {
  passageDuplicate,
  passageDuplicateInputSchema,
  passageDuplicateResultSchema,
} from '../../recipes/passage-duplicate/index.js';
import { metadata as passageDuplicateMetadata } from '../../recipes/passage-duplicate/metadata.js';
import {
  evidenceNovelty,
  evidenceNoveltyInputSchema,
  evidenceNoveltyResultSchema,
} from '../../recipes/evidence-novelty/index.js';
import { metadata as evidenceNoveltyMetadata } from '../../recipes/evidence-novelty/metadata.js';
import {
  cacheMatch,
  cacheMatchInputSchema,
  cacheMatchResultSchema,
} from '../../recipes/cache-match/index.js';
import { metadata as cacheMatchMetadata } from '../../recipes/cache-match/metadata.js';
import {
  queryEquivalence,
  queryEquivalenceInputSchema,
  queryEquivalenceResultSchema,
} from '../../recipes/query-equivalence/index.js';
import { metadata as queryEquivalenceMetadata } from '../../recipes/query-equivalence/metadata.js';
import {
  contextRole,
  contextRoleInputSchema,
  contextRoleResultSchema,
} from '../../recipes/context-role/index.js';
import { metadata as contextRoleMetadata } from '../../recipes/context-role/metadata.js';
import {
  querySpecificity,
  querySpecificityInputSchema,
  querySpecificityResultSchema,
} from '../../recipes/query-specificity/index.js';
import { metadata as querySpecificityMetadata } from '../../recipes/query-specificity/metadata.js';

export const retrievalRecipes = {
  rerank: { metadata: rerankMetadata, inputSchema: rerankInputSchema, resultSchema: rerankResultSchema, run: (input: unknown, options?: RecipeOptions) => rerank(rerankInputSchema.parse(input), options) },
  verify: { metadata: verifyMetadata, inputSchema: verifyInputSchema, resultSchema: verifyResultSchema, run: (input: unknown, options?: RecipeOptions) => verify(verifyInputSchema.parse(input), options) },
  answerability: { metadata: answerabilityMetadata, inputSchema: answerabilityInputSchema, resultSchema: answerabilityResultSchema, run: (input: unknown, options?: RecipeOptions) => answerability(answerabilityInputSchema.parse(input), options) },
  'retrieval-needed': {
    metadata: retrievalNeededMetadata,
    inputSchema: retrievalNeededInputSchema,
    resultSchema: retrievalNeededResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      retrievalNeeded(retrievalNeededInputSchema.parse(input), options),
  },
  'freshness-needed': {
    metadata: freshnessNeededMetadata,
    inputSchema: freshnessNeededInputSchema,
    resultSchema: freshnessNeededResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      freshnessNeeded(freshnessNeededInputSchema.parse(input), options),
  },
  'source-applicability': {
    metadata: sourceApplicabilityMetadata,
    inputSchema: sourceApplicabilityInputSchema,
    resultSchema: sourceApplicabilityResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      sourceApplicability(sourceApplicabilityInputSchema.parse(input), options),
  },
  'evidence-conflict': {
    metadata: evidenceConflictMetadata,
    inputSchema: evidenceConflictInputSchema,
    resultSchema: evidenceConflictResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      evidenceConflict(evidenceConflictInputSchema.parse(input), options),
  },
  'passage-duplicate': {
    metadata: passageDuplicateMetadata,
    inputSchema: passageDuplicateInputSchema,
    resultSchema: passageDuplicateResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      passageDuplicate(passageDuplicateInputSchema.parse(input), options),
  },
  'evidence-novelty': {
    metadata: evidenceNoveltyMetadata,
    inputSchema: evidenceNoveltyInputSchema,
    resultSchema: evidenceNoveltyResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      evidenceNovelty(evidenceNoveltyInputSchema.parse(input), options),
  },
  'cache-match': {
    metadata: cacheMatchMetadata,
    inputSchema: cacheMatchInputSchema,
    resultSchema: cacheMatchResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      cacheMatch(cacheMatchInputSchema.parse(input), options),
  },
  'query-equivalence': {
    metadata: queryEquivalenceMetadata,
    inputSchema: queryEquivalenceInputSchema,
    resultSchema: queryEquivalenceResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      queryEquivalence(queryEquivalenceInputSchema.parse(input), options),
  },
  'context-role': {
    metadata: contextRoleMetadata,
    inputSchema: contextRoleInputSchema,
    resultSchema: contextRoleResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      contextRole(contextRoleInputSchema.parse(input), options),
  },
  'query-specificity': {
    metadata: querySpecificityMetadata,
    inputSchema: querySpecificityInputSchema,
    resultSchema: querySpecificityResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      querySpecificity(querySpecificityInputSchema.parse(input), options),
  },
};
