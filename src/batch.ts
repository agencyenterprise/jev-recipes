import type { ResultMetadata } from './schema.js';

export type BatchEvaluation<Item> = ResultMetadata & { items: Item[] };

/**
 * Split `items` into chunks of at most `batchSize`, evaluate every chunk
 * concurrently with `evaluate`, and merge the per-item results back into the
 * original order. Token usage is summed across requests; `model` comes from
 * the first response. One chunk is one Jev request, so a caller with 1,000
 * inputs and a batch size of 20 makes 50 requests instead of 1,000.
 */
export async function evaluateInBatches<Input, Item>(
  items: Input[],
  batchSize: number,
  evaluate: (chunk: Input[], offset: number) => Promise<BatchEvaluation<Item>>,
): Promise<BatchEvaluation<Item>> {
  if (!Number.isInteger(batchSize) || batchSize < 1)
    throw new Error('batchSize must be a positive integer.');
  const chunks: { chunk: Input[]; offset: number }[] = [];
  for (let offset = 0; offset < items.length; offset += batchSize)
    chunks.push({ chunk: items.slice(offset, offset + batchSize), offset });
  let firstFailure: { error: unknown } | undefined;
  const settled = await Promise.allSettled(
    chunks.map(async ({ chunk, offset }) => {
      try {
        return await evaluate(chunk, offset);
      } catch (error) {
        firstFailure ??= { error };
        throw error;
      }
    }),
  );
  // Let request recorders finish before a caller archives this failed batch.
  if (firstFailure) throw firstFailure.error;
  const evaluations = settled.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );
  return {
    items: evaluations.flatMap((evaluation) => evaluation.items),
    model: evaluations[0]?.model ?? 'none',
    usage: evaluations.reduce(
      (total, evaluation) => ({
        input_tokens: total.input_tokens + evaluation.usage.input_tokens,
        output_tokens: total.output_tokens + evaluation.usage.output_tokens,
      }),
      { input_tokens: 0, output_tokens: 0 },
    ),
  };
}
