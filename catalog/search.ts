import type { RecipeMetadata } from '../src/schema.js';
import type { RecipeFilters } from './schema.js';

const stopWords = new Set([
  'a',
  'an',
  'the',
  'i',
  'this',
  'is',
  'my',
  'to',
  'of',
  'for',
  'in',
  'it',
  'do',
  'does',
  'how',
  'should',
  'with',
]);

export function searchRecipes<T extends RecipeMetadata>(
  recipes: readonly T[],
  filters: RecipeFilters,
): T[] {
  const query = normalize(filters.query ?? '');
  const words = query.split(' ').filter(Boolean);
  const significantWords = words.filter((word) => !stopWords.has(word));
  const terms = significantWords.length ? significantWords : words;
  return recipes
    .filter((recipe) => filters.category === undefined || recipe.category === filters.category)
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, query, terms) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id, 'en'))
    .slice(0, filters.limit)
    .map(({ recipe }) => recipe);
}

function scoreRecipe(recipe: RecipeMetadata, query: string, terms: string[]): number {
  if (!query) return 0;
  const fields: [string, number][] = [
    [normalize(recipe.id), 40],
    [normalize(recipe.title), 25],
    [normalize(recipe.tags.join(' ')), 20],
    [normalize(recipe.useWhen ?? ''), 10],
    [normalize(recipe.description), 5],
    [normalize(recipe.category), 1],
  ];
  let score = normalize(recipe.id) === query ? 1000 : 0;
  if (terms.length > 1 && normalize(recipe.useWhen ?? '').includes(terms.join(' '))) score += 50;
  for (const term of terms) {
    const matches = fields.filter(([text]) => text.includes(term));
    if (!matches.length) return -1;
    score += Math.max(...matches.map(([, weight]) => weight));
  }
  return score;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}
