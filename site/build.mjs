import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listRecipes, describeRecipe } from '../dist/catalog/index.js';
import { escapeHtml } from './render.js';
import { loadEvaluationRecipe } from '../dist/evaluation/dataset.js';
import {
  catalogPage,
  description,
  metadata,
  notFoundPage,
  recipePage,
  siteOrigin,
  sitemap,
} from './pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'site/dist');
const origin = siteOrigin(process.env.SITE_URL);
const collections = JSON.parse(await readFile(join(root, 'evals/featured.json'), 'utf8'));
const recipes = listRecipes();
for (const ids of Object.values(collections))
  for (const id of ids)
    if (!recipes.some((recipe) => recipe.id === id))
      throw new Error(`Unknown featured recipe: ${id}`);
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'recipes'), { recursive: true });
const entries = [];
let routePolicyTable = '';
for (const recipe of recipes) {
  for (const related of recipe.related ?? [])
    if (!recipes.some((entry) => entry.id === related.id))
      throw new Error(`Unknown related recipe: ${related.id}`);
  const description = describeRecipe(recipe.id);
  const fixture = JSON.parse(await readFile(join(root, 'recipes', recipe.id, 'demo.json'), 'utf8'));
  const implementation = await loadEvaluationRecipe(recipe.id);
  const fixtureOptions = { client: { systemOne: async () => structuredClone(fixture.response) } };
  const result = await implementation.run(fixture.input, fixtureOptions);
  const policies = {};
  if (Object.hasOwn(implementation.inputSchema.shape, 'minConfidence')) {
    for (const minConfidence of [0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1])
      policies[minConfidence] = await implementation.run(
        { ...fixture.input, minConfidence },
        fixtureOptions,
      );
  }
  const report = await readFile(join(root, 'evals/results', `${recipe.id}.json`), 'utf8')
    .then(JSON.parse)
    .catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
  const evidenceDetails = recipe.evidence;
  const evidence =
    evidenceDetails.measurement === null
      ? evidenceDetails.kind
      : evidenceDetails.kind === 'earlier'
        ? 'earlier'
        : 'measured';
  const collection =
    Object.entries(collections).find(([, ids]) => ids.includes(recipe.id))?.[0] ?? null;
  const module = await import(new URL(`../dist/recipes/${recipe.id}/index.js`, import.meta.url));
  const functionName = Object.entries(module).find(([, value]) => typeof value === 'function')?.[0];
  if (!functionName) throw new Error(`Missing function export for ${recipe.id}.`);
  const entry = {
    ...recipe,
    collection,
    evidence,
    evidenceDetails,
    measured:
      report && evidenceDetails.measurement
        ? {
            cases: report.cases,
            accuracy: report.accuracy,
            ready: report.ready ?? null,
            review: report.review ?? null,
            failed: report.failed ?? null,
            model: report.model,
            split: report.evidence?.split ?? null,
            date: report.evidence?.evaluatedAt ?? null,
            acceptance: report.acceptance?.label ?? null,
            acceptanceMet: report.acceptance?.met ?? null,
          }
        : null,
  };
  entries.push(entry);
  if (recipe.id === 'route') {
    routePolicyTable =
      '<div class="table-scroll"><table class="contract-table"><caption>Saved routing response under each confidence policy</caption><thead><tr><th scope="col">Minimum confidence</th><th scope="col">Decision status</th><th scope="col">Selected route</th></tr></thead><tbody>' +
      Object.entries(policies)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(
          ([threshold, result]) =>
            `<tr><th scope="row">${Math.round(Number(threshold) * 100)}%</th><td>${escapeHtml(result.status)}</td><td>${escapeHtml(result.route ?? 'None; review required')}</td></tr>`,
        )
        .join('') +
      '</tbody></table></div>';
  }
  const detail = {
    ...description,
    ...entry,
    functionName,
    fixture: { input: fixture.input, result, policies },
    report,
  };
  await writeFile(join(output, 'recipes', `${recipe.id}.json`), JSON.stringify(detail));
  await mkdir(join(output, 'recipes', recipe.id), { recursive: true });
  await writeFile(join(output, 'recipes', recipe.id, 'index.html'), recipePage(detail, origin));
  if (report) {
    await mkdir(join(output, 'reports'), { recursive: true });
    await writeFile(
      join(output, 'reports', `${recipe.id}.json`),
      JSON.stringify(report, null, 2) + '\n',
    );
  }
}
for (const name of ['app.js', 'render.js', 'style.css'])
  await cp(join(root, 'site', name), join(output, name));
const homepage = await readFile(join(root, 'site/index.html'), 'utf8');
await writeFile(
  join(output, 'index.html'),
  homepage.replace('<!-- ROUTE_POLICY_TABLE -->', routePolicyTable).replace(
    '<!-- SITE_METADATA -->',
    metadata({
      origin,
      title: 'Jev recipes | TypeScript guide to route decisions, review results, and evidence',
      summary: description,
    }),
  ),
);
await writeFile(join(output, 'recipes/index.html'), catalogPage(entries, origin));
await writeFile(join(output, '404.html'), notFoundPage(origin));
await writeFile(join(output, 'sitemap.xml'), sitemap(entries, origin));
await writeFile(
  join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);
await cp(join(root, 'dist/catalog/search.js'), join(output, 'search.js'));
const listings = entries.map(
  ({ id, title, description, useWhen, tags, category, collection, evidence, evidenceDetails }) => ({
    id,
    title,
    description,
    useWhen,
    tags,
    category,
    collection,
    evidence,
    evidenceDetails,
  }),
);
await writeFile(join(output, 'catalog.json'), JSON.stringify({ recipes: listings, collections }));
await mkdir(dirname(join(output, 'docs/evaluation.md')), { recursive: true });
for (const name of [
  'evaluation.md',
  'integrations.md',
  'gateway-validation.md',
  'coding-assistants.md',
])
  await cp(join(root, 'docs', name), join(output, 'docs', name));
console.log(`Built static catalog with ${entries.length} recipes. No model calls were made.`);
