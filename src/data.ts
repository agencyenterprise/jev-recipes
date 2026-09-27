import { z } from 'zod';

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export const jsonValueSchema = z
  .unknown()
  .refine((value): value is JsonValue => isJsonValue(value), {
    error: 'Must be a JSON value.',
    abort: true,
  })
  .overwrite((value) => structuredClone(value))
  .nonoptional();

export function recordWithOwnKeys<Value extends z.ZodType>(
  keySchema: z.ZodString,
  valueSchema: Value,
) {
  const entriesSchema = z.array(z.tuple([keySchema, valueSchema]));
  const jsonSchema = z.toJSONSchema(z.record(keySchema, valueSchema));
  delete jsonSchema.$schema;

  return z
    .unknown()
    .refine(
      (value): value is Record<string, z.output<Value>> =>
        isPlainRecord(value) && entriesSchema.safeParse(Object.entries(value)).success,
      { error: 'Must be a record with valid keys and values.', abort: true },
    )
    .overwrite((value) => Object.fromEntries(entriesSchema.parse(Object.entries(value))))
    .nonoptional()
    .meta(jsonSchema);
}

function isJsonValue(value: unknown, ancestors = new Set<object>()): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (!Array.isArray(value) && !isPlainRecord(value)) return false;
  if (ancestors.has(value)) return false;

  ancestors.add(value);
  const children = Array.isArray(value) ? Array.from(value) : Object.values(value);
  const valid = children.every((child) => isJsonValue(child, ancestors));
  ancestors.delete(value);
  return valid;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
