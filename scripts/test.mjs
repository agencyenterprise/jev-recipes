import { access } from 'node:fs/promises';
import { recipeIdPattern } from './lib/recipes.mjs';
import { npm } from './lib/process.mjs';

try {
  const recipe = process.env.RECIPE;
  if (recipe) {
    if (!recipeIdPattern.test(recipe))
      throw new Error('RECIPE must be a kebab-case recipe ID, such as route.');
    const test = `tests/recipe/${recipe}.test.ts`;
    await access(test);
    await npm(['run', 'test:recipes', '--', test]);
  } else {
    await npm(['test']);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
