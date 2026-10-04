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

const EXACT_ID_BONUS = 10_000;
const FULL_COVERAGE_BONUS = 1_000;
const PHRASE_BONUS = 50;
const EXACT_MATCH = 1;
const SHARED_STEM_MINIMUM_LENGTH = 4;
const SHARED_STEM_MINIMUM_RATIO = 0.6;

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

type TermMatch = { quality: number; weight: number };

function scoreRecipe(recipe: RecipeMetadata, query: string, terms: string[]): number {
  if (!query) return 0;
  const fields = weightedFields(recipe);
  const matches = terms.map((term) => bestMatch(fields, term));
  if (matches.every((match) => match.quality === 0)) return -1;

  const coverage = matches.reduce((total, match) => total + match.quality, 0) / terms.length;
  const relevance = matches.reduce((total, match) => total + match.weight, 0);
  return (
    (normalize(recipe.id) === query ? EXACT_ID_BONUS : 0) +
    (matchesPhrase(recipe, terms) ? PHRASE_BONUS : 0) +
    coverage * FULL_COVERAGE_BONUS +
    relevance
  );
}

function weightedFields(recipe: RecipeMetadata): [string, number][] {
  return [
    [normalize(recipe.id), 40],
    [normalize(recipe.title), 25],
    [normalize(recipe.tags.join(' ')), 20],
    [normalize(recipe.useWhen ?? ''), 10],
    [normalize(recipe.description), 5],
    [normalize(recipe.category), 1],
  ];
}

function bestMatch(fields: [string, number][], term: string): TermMatch {
  return fields.reduce<TermMatch>(
    (best, [text, fieldWeight]) => {
      const quality = fieldMatch(text, term);
      return {
        quality: Math.max(best.quality, quality),
        weight: Math.max(best.weight, fieldWeight * quality),
      };
    },
    { quality: 0, weight: 0 },
  );
}

function matchesPhrase(recipe: RecipeMetadata, terms: string[]): boolean {
  return terms.length > 1 && normalize(recipe.useWhen ?? '').includes(terms.join(' '));
}

function fieldMatch(text: string, term: string): number {
  if (text.includes(term)) return EXACT_MATCH;
  return text.split(' ').reduce((best, word) => Math.max(best, stemSimilarity(word, term)), 0);
}

function stemSimilarity(first: string, second: string): number {
  const longerLength = Math.max(first.length, second.length);
  let sharedLength = 0;
  while (sharedLength < longerLength && first[sharedLength] === second[sharedLength])
    sharedLength++;
  const sharesStem =
    sharedLength >= SHARED_STEM_MINIMUM_LENGTH &&
    sharedLength >= Math.ceil(longerLength * SHARED_STEM_MINIMUM_RATIO);
  return sharesStem ? sharedLength / longerLength : 0;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}
