export function recordDecisions(options = {}) {
  const trace = [];
  async function decide(name, recipe, input) {
    const recipeOptions = options.model ? { model: options.model } : {};
    if (options.signal) recipeOptions.signal = options.signal;
    if (options.client) recipeOptions.client = options.client;
    if (options.fixtures) {
      const response = options.fixtures[name];
      if (!response) throw new Error(`Missing offline fixture for ${name}.`);
      recipeOptions.client = { systemOne: async (request) => response(request) };
    }
    if (!recipeOptions.client && !options.live)
      throw new Error('Provide a client, fixtures, or explicit live mode.');
    const started = performance.now();
    try {
      const result = await recipe(input, recipeOptions);
      record({
        recipe: name,
        outcome: result?.status ?? 'completed',
        model: result?.model ?? null,
        usage: result?.usage ? { ...result.usage } : null,
        durationMs: performance.now() - started,
        ...(options.includeContent ? { input, result } : {}),
      });
      return result;
    } catch (error) {
      record({
        recipe: name,
        outcome: 'failed',
        model: options.model ?? null,
        usage: null,
        durationMs: performance.now() - started,
        error: error?.name === 'AbortError' ? 'aborted' : 'decision-failed',
        ...(options.includeContent ? { input } : {}),
      });
      throw error;
    }
  }
  function record(event) {
    trace.push(event);
    // Observers cannot mutate results or fail a decision; returned promises are not awaited.
    try {
      const observation = options.onDecision?.(structuredClone(event));
      Promise.resolve(observation).catch(() => {});
    } catch {
      /* Observability is best-effort. */
    }
  }
  return { decide, trace };
}
