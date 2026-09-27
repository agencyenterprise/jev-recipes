import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';
import { jsonValueSchema, recordWithOwnKeys } from '../../dist/src/data.js';

test('records preserve own keys without changing prototypes', () => {
  const schema = recordWithOwnKeys(z.string().min(1), z.number().min(0).max(1));
  const input = JSON.parse('{"__proto__":0.9,"constructor":0.1}');
  const result = schema.parse(input);
  assert.deepEqual(result, input);
  assert.equal(Object.getPrototypeOf(result), Object.prototype);
  assert.equal(Object.hasOwn(result, '__proto__'), true);
  assert.equal(schema.safeParse(JSON.parse('{"__proto__":2}')).success, false);
  assert.equal(schema.safeParse({ '': 1 }).success, false);
  assert.equal(schema.safeParse(undefined).success, false);
  const description = z.toJSONSchema(z.object({ probabilities: schema }), { io: 'input' });
  assert.deepEqual(description.required, ['probabilities']);
  assert.equal(description.properties.probabilities.type, 'object');
  assert.equal(description.properties.probabilities.additionalProperties.maximum, 1);
});

test('JSON validation preserves keys, clones values, and rejects non-JSON data', () => {
  const input = JSON.parse('{"nested":[{"__proto__":{"value":1}}]}');
  const result = jsonValueSchema.parse(input);
  assert.deepEqual(result, input);
  assert.notEqual(result.nested, input.nested);
  assert.equal(Object.hasOwn(result.nested[0], '__proto__'), true);
  const cyclic = {};
  cyclic.self = cyclic;
  for (const invalid of [cyclic, [undefined], new Array(1), Infinity, new Date(), 1n, () => {}])
    assert.equal(jsonValueSchema.safeParse(invalid).success, false);
  const shared = { value: 1 };
  assert.deepEqual(jsonValueSchema.parse([shared, shared]), [shared, shared]);
  const description = z.toJSONSchema(z.object({ data: jsonValueSchema }), { io: 'input' });
  assert.deepEqual(description.required, ['data']);
});
