import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listRecipes, describeRecipe } from '../dist/catalog/index.js';
import { escapeHtml } from './render.js';
import { loadEvaluationRecipe } from '../dist/evaluation/dataset.js';
import { siteDocs, updateLedgerPath } from '../scripts/lib/docs.mjs';
import { absoluteMarkdown, guideSections, markdownTitle, renderMarkdown } from './markdown.mjs';
import {
  catalogPage,
  description,
  docPage,
  maintainer,
  metadata,
  notFoundPage,
  recipePage,
  siteOrigin,
  sitemap,
  source,
} from './pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'site/dist');
const origin = siteOrigin(process.env.SITE_URL);
const collections = JSON.parse(await readFile(join(root, 'evals/featured.json'), 'utf8'));
const ledger = JSON.parse(await readFile(join(root, updateLedgerPath), 'utf8'));
const updatedAt = (page) => {
  const entry = ledger[page];
  if (!entry) throw new Error(`No update date recorded for ${page}. Run npm run docs first.`);
  return entry.updatedAt;
};
const recipes = listRecipes();
for (const ids of Object.values(collections))
  for (const id of ids)
    if (!recipes.some((recipe) => recipe.id === id))
      throw new Error(`Unknown featured recipe: ${id}`);
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'recipes'), { recursive: true });
const entries = [];
const recipeMarkdown = [];
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
    updatedAt: updatedAt(`recipes/${recipe.id}`),
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
  const readmePath = `recipes/${recipe.id}/README.md`;
  const readme = await readFile(join(root, readmePath), 'utf8');
  await writeFile(
    join(output, 'recipes', recipe.id, 'index.html'),
    recipePage(detail, origin, renderMarkdown(guideSections(readme), readmePath)),
  );
  const markdown = `${absoluteMarkdown(readme, readmePath, origin).trim()}\n\nCanonical guide: ${origin}/recipes/${recipe.id}/\nEvidence: ${detail.evidenceDetails.label}. Last updated ${detail.updatedAt}.\n`;
  await writeFile(join(output, 'recipes', recipe.id, 'index.md'), markdown);
  recipeMarkdown.push(markdown);
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
const docs = [];
for (const name of siteDocs) {
  const docPath = `docs/${name}.md`;
  const markdown = await readFile(join(root, docPath), 'utf8');
  const doc = {
    name,
    title: markdownTitle(markdown),
    body: renderMarkdown(markdown, docPath),
    updatedAt: updatedAt(`docs/${name}`),
  };
  docs.push(doc);
  await mkdir(join(output, 'docs', name), { recursive: true });
  await writeFile(join(output, 'docs', name, 'index.html'), docPage(doc, origin));
  await writeFile(join(output, 'docs', `${name}.md`), absoluteMarkdown(markdown, docPath, origin));
}
const latestUpdate = [
  ...entries.map((entry) => entry.updatedAt),
  ...docs.map((doc) => doc.updatedAt),
]
  .sort()
  .at(-1);
const homepage = await readFile(join(root, 'site/index.html'), 'utf8');
await writeFile(
  join(output, 'index.html'),
  homepage.replace('<!-- ROUTE_POLICY_TABLE -->', routePolicyTable).replace(
    '<!-- SITE_METADATA -->',
    metadata({
      origin,
      title: 'Jev recipes | TypeScript guide to route decisions, review results, and evidence',
      summary: description,
      updatedAt: latestUpdate,
    }),
  ),
);
await writeFile(join(output, 'recipes/index.html'), catalogPage(entries, origin, latestUpdate));
await writeFile(join(output, '404.html'), notFoundPage(origin));
await writeFile(
  join(output, 'sitemap.xml'),
  sitemap(
    [
      { path: '/', updatedAt: latestUpdate },
      { path: '/recipes/', updatedAt: latestUpdate },
      ...docs.map((doc) => ({ path: `/docs/${doc.name}/`, updatedAt: doc.updatedAt })),
      ...entries.map((entry) => ({ path: `/recipes/${entry.id}/`, updatedAt: entry.updatedAt })),
    ],
    origin,
  ),
);
const llmsIndex = `# Jev recipes

> ${description}

jev-recipes is an MIT-licensed npm package (\`npm install jev-recipes\`) for Node.js 22.9 or newer. Each recipe asks Jev one bounded question and returns a typed decision with explicit uncertainty. Maintained by ${maintainer.name} (${maintainer.url}). Source: ${source}

## Docs

${docs.map((doc) => `- [${doc.title}](${origin}/docs/${doc.name}.md)`).join('\n')}

## Recipes

${entries.map((entry) => `- [${entry.title}](${origin}/recipes/${entry.id}/index.md): ${entry.description} Evidence: ${entry.evidenceDetails.label}.`).join('\n')}

## Optional

- [Recipe catalog (HTML)](${origin}/recipes/)
- [Complete recipe guides in one file](${origin}/llms-full.txt)
`;
await writeFile(join(output, 'llms.txt'), llmsIndex);
await writeFile(
  join(output, 'llms-full.txt'),
  `${llmsIndex}\n---\n\n${recipeMarkdown.join('\n---\n\n')}`,
);
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
console.log(`Built static catalog with ${entries.length} recipes. No model calls were made.`);
