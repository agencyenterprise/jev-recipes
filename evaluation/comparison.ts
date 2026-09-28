import { isDeepStrictEqual } from 'node:util';
import { describeRecipe } from '../catalog/index.js';
import { recipeNameSchema } from '../catalog/schema.js';
import { isRecord } from './decisions.js';

export const scoringRevision = 2 as const;
const metadataFields = new Set([
  'model',
  'usage',
  'confidence',
  'probability',
  'probabilities',
  'score',
  'status',
]);
type Schema = Record<string, unknown>;
const resultSchemas = new Map<string, Schema>();

export function resultSchemaFor(recipe: string): Schema {
  const cached = resultSchemas.get(recipe);
  if (cached) return cached;
  const schema = describeRecipe(recipeNameSchema.parse(recipe)).resultSchema;
  resultSchemas.set(recipe, schema);
  return schema;
}

// Expected keys are result paths. Below an unconstrained payload, every key is data.
export function comparableDecision(value: unknown, recipe: string): unknown {
  if (!isRecord(value)) return value;
  const schema = resultSchemaFor(recipe);
  return Object.fromEntries(
    Object.entries(value)
      .filter(([path]) => !isMetadataPath(schema, path.split('.')))
      .map(([path, field]) => [path, normalize(field, schemaAtPath(schema, path.split('.')))]),
  );
}

export function matchesExpected(actual: unknown, expected: unknown, recipe: string): boolean {
  return isDeepStrictEqual(
    comparableDecision(actual, recipe),
    comparableDecision(expected, recipe),
  );
}

function normalize(value: unknown, schema: Schema | undefined): unknown {
  if (!schema) return value;
  if (Array.isArray(value))
    return value.map((item, index) => normalize(item, schemaAtPath(schema, [String(index)])));
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([name]) => !isMetadataPath(schema, [name]))
      .map(([name, field]) => [name, normalize(field, schemaAtPath(schema, [name]))]),
  );
}

export function isMetadataPath(schema: Schema, segments: string[]): boolean {
  if (!segments.length) return false;
  if (Array.isArray(schema.anyOf))
    return schema.anyOf.some((branch) => isRecord(branch) && isMetadataPath(branch, segments));
  const [first, ...rest] = segments;
  if (
    isRecord(schema.properties) &&
    Object.hasOwn(schema.properties, first!) &&
    metadataFields.has(first!)
  )
    return true;
  const child = schemaAtPath(schema, [first!]);
  return child !== undefined && isMetadataPath(child, rest);
}

export function schemaAtPath(schema: Schema, segments: string[]): Schema | undefined {
  if (!segments.length) return schema;
  if (Array.isArray(schema.anyOf)) {
    const candidates = schema.anyOf.flatMap((branch) => {
      const field = isRecord(branch) ? schemaAtPath(branch, segments) : undefined;
      return field ? [field] : [];
    });
    return candidates.length ? { anyOf: candidates } : undefined;
  }
  const [first, ...rest] = segments;
  if (
    isRecord(schema.properties) &&
    Object.hasOwn(schema.properties, first!) &&
    isRecord(schema.properties[first!])
  )
    return schemaAtPath(schema.properties[first!] as Schema, rest);
  if (schema.type === 'array' && /^(0|[1-9]\d*)$/.test(first!) && isRecord(schema.items))
    return schemaAtPath(schema.items, rest);
  if (isRecord(schema.additionalProperties)) return schemaAtPath(schema.additionalProperties, rest);
  if (
    schema.additionalProperties === true ||
    (schema.type === undefined && schema.enum === undefined && schema.const === undefined)
  )
    return {};
  return undefined;
}
