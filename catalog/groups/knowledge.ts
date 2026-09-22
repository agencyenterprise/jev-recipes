import type { RecipeOptions } from '../../src/schema.js';
import {
  memoryValue,
  memoryValueInputSchema,
  memoryValueResultSchema,
} from '../../recipes/memory-value/index.js';
import { metadata as memoryValueMetadata } from '../../recipes/memory-value/metadata.js';
import {
  memoryScope,
  memoryScopeInputSchema,
  memoryScopeResultSchema,
} from '../../recipes/memory-scope/index.js';
import { metadata as memoryScopeMetadata } from '../../recipes/memory-scope/metadata.js';
import {
  memoryRelation,
  memoryRelationInputSchema,
  memoryRelationResultSchema,
} from '../../recipes/memory-relation/index.js';
import { metadata as memoryRelationMetadata } from '../../recipes/memory-relation/metadata.js';
import {
  preferenceKind,
  preferenceKindInputSchema,
  preferenceKindResultSchema,
} from '../../recipes/preference-kind/index.js';
import { metadata as preferenceKindMetadata } from '../../recipes/preference-kind/metadata.js';
import {
  factStability,
  factStabilityInputSchema,
  factStabilityResultSchema,
} from '../../recipes/fact-stability/index.js';
import { metadata as factStabilityMetadata } from '../../recipes/fact-stability/metadata.js';
import {
  documentRole,
  documentRoleInputSchema,
  documentRoleResultSchema,
} from '../../recipes/document-role/index.js';
import { metadata as documentRoleMetadata } from '../../recipes/document-role/metadata.js';
import {
  audienceFit,
  audienceFitInputSchema,
  audienceFitResultSchema,
} from '../../recipes/audience-fit/index.js';
import { metadata as audienceFitMetadata } from '../../recipes/audience-fit/metadata.js';
import {
  changeMeaning,
  changeMeaningInputSchema,
  changeMeaningResultSchema,
} from '../../recipes/change-meaning/index.js';
import { metadata as changeMeaningMetadata } from '../../recipes/change-meaning/metadata.js';
import {
  answerInvalidation,
  answerInvalidationInputSchema,
  answerInvalidationResultSchema,
} from '../../recipes/answer-invalidation/index.js';
import { metadata as answerInvalidationMetadata } from '../../recipes/answer-invalidation/metadata.js';
import {
  fieldSelect,
  fieldSelectInputSchema,
  fieldSelectResultSchema,
} from '../../recipes/field-select/index.js';
import { metadata as fieldSelectMetadata } from '../../recipes/field-select/metadata.js';

export const knowledgeRecipes = {
  'memory-value': {
    metadata: memoryValueMetadata,
    inputSchema: memoryValueInputSchema,
    resultSchema: memoryValueResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      memoryValue(memoryValueInputSchema.parse(input), options),
  },
  'memory-scope': {
    metadata: memoryScopeMetadata,
    inputSchema: memoryScopeInputSchema,
    resultSchema: memoryScopeResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      memoryScope(memoryScopeInputSchema.parse(input), options),
  },
  'memory-relation': {
    metadata: memoryRelationMetadata,
    inputSchema: memoryRelationInputSchema,
    resultSchema: memoryRelationResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      memoryRelation(memoryRelationInputSchema.parse(input), options),
  },
  'preference-kind': {
    metadata: preferenceKindMetadata,
    inputSchema: preferenceKindInputSchema,
    resultSchema: preferenceKindResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      preferenceKind(preferenceKindInputSchema.parse(input), options),
  },
  'fact-stability': {
    metadata: factStabilityMetadata,
    inputSchema: factStabilityInputSchema,
    resultSchema: factStabilityResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      factStability(factStabilityInputSchema.parse(input), options),
  },
  'document-role': {
    metadata: documentRoleMetadata,
    inputSchema: documentRoleInputSchema,
    resultSchema: documentRoleResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      documentRole(documentRoleInputSchema.parse(input), options),
  },
  'audience-fit': {
    metadata: audienceFitMetadata,
    inputSchema: audienceFitInputSchema,
    resultSchema: audienceFitResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      audienceFit(audienceFitInputSchema.parse(input), options),
  },
  'change-meaning': {
    metadata: changeMeaningMetadata,
    inputSchema: changeMeaningInputSchema,
    resultSchema: changeMeaningResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      changeMeaning(changeMeaningInputSchema.parse(input), options),
  },
  'answer-invalidation': {
    metadata: answerInvalidationMetadata,
    inputSchema: answerInvalidationInputSchema,
    resultSchema: answerInvalidationResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      answerInvalidation(answerInvalidationInputSchema.parse(input), options),
  },
  'field-select': {
    metadata: fieldSelectMetadata,
    inputSchema: fieldSelectInputSchema,
    resultSchema: fieldSelectResultSchema,
    run: (input: unknown, options?: RecipeOptions) =>
      fieldSelect(fieldSelectInputSchema.parse(input), options),
  },
};
