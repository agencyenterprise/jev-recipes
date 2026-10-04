import type { ResultMetadata } from './schema.js';

export type BatchEvaluation<Item> = ResultMetadata & { items: Item[] };

export async function evaluateInBatches<Input, Item>(
  items: Input[],
  batchSize: number,
  evaluateBatch: (items: Input[], offset: number) => Promise<BatchEvaluation<Item>>,
): Promise<BatchEvaluation<Item>> {
  if (!Number.isInteger(batchSize) || batchSize < 1)
    throw new Error('batchSize must be a positive integer.');

  const batches = splitIntoBatches(items, batchSize);
  const batchResults = await Promise.allSettled(
    batches.map(async ({ items, offset }) => evaluateBatch(items, offset)),
  );
  const firstFailedBatch = batchResults.find((result) => result.status === 'rejected');
  if (firstFailedBatch) throw firstFailedBatch.reason;

  const evaluations = batchResults.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );
  return combineBatchResults(evaluations);
}

function splitIntoBatches<Input>(items: Input[], batchSize: number) {
  const batches: { items: Input[]; offset: number }[] = [];
  for (let offset = 0; offset < items.length; offset += batchSize)
    batches.push({ items: items.slice(offset, offset + batchSize), offset });
  return batches;
}

function combineBatchResults<Item>(evaluations: BatchEvaluation<Item>[]): BatchEvaluation<Item> {
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
