export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function valueAtPath(record: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (value, segment) =>
        value !== null && typeof value === 'object' && Object.hasOwn(value, segment)
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      record,
    );
}

export function pickPaths(record: unknown, paths: string[]): Record<string, unknown> {
  return Object.fromEntries(paths.map((path) => [path, valueAtPath(record, path)]));
}

export function caseConfidence(result: unknown, expectedPaths: string[] = []): number | undefined {
  if (isRecord(result) && typeof result.confidence === 'number') return result.confidence;
  const scoped = expectedPaths.flatMap((path) => {
    const segments = path.split('.');
    for (let end = segments.length; end > 0; end--) {
      const node = valueAtPath(result, segments.slice(0, end).join('.'));
      if (isRecord(node) && typeof node.confidence === 'number') return [node.confidence];
    }
    return [];
  });
  const values = scoped.length ? scoped : collectConfidences(result);
  return values.length ? Math.min(...values) : undefined;
}

function collectConfidences(value: unknown): number[] {
  if (Array.isArray(value)) return value.flatMap(collectConfidences);
  if (isRecord(value))
    return Object.entries(value).flatMap(([name, field]) =>
      name === 'confidence' && typeof field === 'number' ? [field] : collectConfidences(field),
    );
  return [];
}

export async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 32)
    throw new Error('Concurrency must be an integer from 1 to 32.');
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex++;
        results[index] = await worker(items[index]!, index);
      }
    }),
  );
  return results;
}

export function roundedTo(places: number, value: number): number {
  return Number(value.toFixed(places));
}
