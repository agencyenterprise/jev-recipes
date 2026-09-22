import { TypeSafeClient } from '@typesafe-ai/sdk';
import type { SystemOneRequest, TypeSafeClientConfig } from '@typesafe-ai/sdk';
import { decisionResponseSchema, recipeOptionsSchema } from './schema.js';
import type { RecipeOptions } from './schema.js';

export async function evaluateWithJev(request: SystemOneRequest, options: RecipeOptions = {}) {
  const { client = createClient(), model, signal } = recipeOptionsSchema.parse(options);
  const configuredRequest = model === undefined ? request : { ...request, model };
  const requestOptions = signal === undefined ? {} : { signal };
  const response = await client.systemOne(configuredRequest, requestOptions);

  return decisionResponseSchema.parse(response);
}

export function createClient(config: TypeSafeClientConfig = {}): TypeSafeClient {
  return new TypeSafeClient({ timeout: 30_000, logLevel: 'off', ...config });
}
