export function recordDecisions(options) {
  const trace = [];
  async function decide(name, recipe, input) {
    const recipeOptions = options.model ? { model: options.model } : {};
    if (options.client) recipeOptions.client = options.client;
    if (options.fixtures) {
      const response = options.fixtures[name];
      if (!response) throw new Error(`Missing offline fixture for ${name}.`);
      recipeOptions.client = { systemOne: async (request) => response(request) };
    }
    if (!recipeOptions.client && !options.live)
      throw new Error('Provide a client, fixtures, or explicit live mode.');
    try {
      const result = await recipe(input, recipeOptions);
      trace.push({ recipe: name, input, result });
      return result;
    } catch (error) {
      trace.push({ recipe: name, input, error: error.message });
      throw error;
    }
  }
  return { decide, trace };
}
