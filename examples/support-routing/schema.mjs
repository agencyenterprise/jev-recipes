import { z } from 'zod';
import { routeInputSchema, routeResultSchema } from 'jev-recipes/route';

export const supportRequestSchema = routeInputSchema.extend({
  request: z.string().trim().min(1).max(12000),
  minConfidence: z.number().min(0).max(1).default(0.8),
});

export const fallbackResultSchema = z
  .object({
    status: z.enum(['ready', 'review']),
    route: z.string().min(1).nullable(),
    model: z.string().min(1).optional(),
  })
  .strict()
  .refine((result) => (result.status === 'ready') === (result.route !== null), {
    message: 'Only a ready decision may contain a route.',
  });

export const routingOptionsSchema = z.object({
  client: z.custom((value) => typeof value?.systemOne === 'function'),
  model: z.string().trim().min(1).optional(),
  signal: z.instanceof(AbortSignal).optional(),
  fallback: z.custom((value) => typeof value === 'function').optional(),
});

export const proposalSchema = z
  .object({
    status: z.enum(['ready', 'review']),
    route: z.string().min(1).nullable(),
    source: z.enum(['primary', 'fallback']),
    reason: z.enum([
      'primary-ready',
      'no-clear-route',
      'low-confidence',
      'primary-failed',
      'fallback-ready',
      'fallback-review',
      'fallback-failed',
    ]),
    trace: z.array(
      z.discriminatedUnion('stage', [
        z.object({
          stage: z.literal('primary'),
          result: routeResultSchema.optional(),
          error: z.string().optional(),
        }),
        z.object({
          stage: z.literal('fallback'),
          result: z.unknown().optional(),
          error: z.string().optional(),
        }),
      ]),
    ),
  })
  .refine((result) => (result.status === 'ready') === (result.route !== null));

export function validateSelectedRoute(result, routes) {
  if (result.route !== null && !Object.hasOwn(routes, result.route))
    throw new Error('The decision selected an unknown route.');
  return result;
}

export function safeError(error) {
  let message = error instanceof Error ? error.message : String(error);
  for (const [name, value] of Object.entries(process.env)) {
    if (/KEY|TOKEN|SECRET|PASSWORD/i.test(name) && value && value.length >= 6)
      message = message.replaceAll(value, '[redacted]');
  }
  return message.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
}
