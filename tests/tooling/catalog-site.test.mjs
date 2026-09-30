import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { listRecipes } from '../../dist/catalog/index.js';
import { run } from '../../scripts/lib/process.mjs';
import { recipePage, siteOrigin } from '../../site/pages.mjs';
import { escapeHtml } from '../../site/render.js';
import { siteDocs } from '../../scripts/lib/docs.mjs';

async function checkPage(path) {
  const page = await readFile(`site/dist${path}index.html`, 'utf8');
  const origin = siteOrigin(process.env.SITE_URL);
  assert.ok(page.includes(`rel="canonical" href="${origin}${path}"`), path);
  const schema = JSON.parse(
    page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  assert.ok(schema['@graph'].some((node) => node.url === origin + path));
  for (const [, href] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), origin + path);
    if (url.origin !== origin) continue;
    const target = resolve('site/dist', '.' + url.pathname);
    assert.ok(target.startsWith(resolve('site/dist')), href);
    assert.ok(await stat(target), `${path} -> ${href}`);
  }
  return page;
}

test('the static catalog contains valid source entries, executable fixtures, and related contracts', async () => {
  await run(process.execPath, ['site/build.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const catalog = JSON.parse(await readFile('site/dist/catalog.json', 'utf8'));
  assert.equal(catalog.recipes.length, listRecipes().length);
  const evidenceByRecipe = new Map(listRecipes().map((recipe) => [recipe.id, recipe.evidence]));
  const index = await checkPage('/recipes/');
  const homepage = await checkPage('/');
  assert.ok(!homepage.includes('<!-- ROUTE_POLICY_TABLE -->'));
  const sitemap = await readFile('site/dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, catalog.recipes.length + 2 + siteDocs.length);
  assert.equal(sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g).length, urls.length);
  for (const name of siteDocs) {
    const doc = await checkPage(`/docs/${name}/`);
    assert.ok(doc.includes('<h1>'), name);
    assert.ok(!(await readFile(`site/dist/docs/${name}.md`, 'utf8')).includes('](../'), name);
  }
  const llms = await readFile('site/dist/llms.txt', 'utf8');
  const llmsFull = await readFile('site/dist/llms-full.txt', 'utf8');
  assert.ok(homepage.includes('Jeff Patterson'));
  assert.ok(
    (await readFile('site/dist/robots.txt', 'utf8')).includes(
      `Sitemap: ${siteOrigin(process.env.SITE_URL)}/sitemap.xml`,
    ),
  );
  for (const entry of catalog.recipes) {
    const detail = JSON.parse(await readFile(`site/dist/recipes/${entry.id}.json`, 'utf8'));
    assert.equal(detail.id, entry.id);
    assert.deepEqual(entry.evidenceDetails, evidenceByRecipe.get(entry.id));
    assert.deepEqual(detail.evidenceDetails, evidenceByRecipe.get(entry.id));
    assert.equal(detail.evidence, entry.evidence);
    assert.ok(detail.functionName);
    assert.ok(detail.inputSchema.properties);
    assert.ok(detail.resultSchema.properties || detail.resultSchema.anyOf, entry.id);
    assert.equal(detail.fixture.result.model, 'demo-fixture');
    const page = await checkPage(`/recipes/${entry.id}/`);
    assert.match(detail.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(page.includes(`"dateModified":"${detail.updatedAt}"`));
    assert.ok(llms.includes(`${siteOrigin(process.env.SITE_URL)}/recipes/${entry.id}/index.md`));
    const markdown = await readFile(`site/dist/recipes/${entry.id}/index.md`, 'utf8');
    assert.ok(!markdown.includes('](../'), entry.id);
    assert.ok(llmsFull.includes(markdown.trim()), entry.id);
    assert.ok(index.includes(`href="./${entry.id}/"`));
    assert.ok(urls.includes(`${siteOrigin(process.env.SITE_URL)}/recipes/${entry.id}/`));
    assert.ok(page.includes(escapeHtml(detail.description)));
    assert.ok(page.includes(escapeHtml(detail.evidenceDetails.label)));
    assert.ok(page.includes(escapeHtml(JSON.stringify(detail.fixture.result, null, 2))));
    for (const limitation of detail.limitations) assert.ok(page.includes(escapeHtml(limitation)));
    for (const related of detail.related)
      assert.ok(catalog.recipes.some((recipe) => recipe.id === related.id));
  }
  const route = JSON.parse(await readFile('site/dist/recipes/route.json', 'utf8'));
  for (const [threshold, result] of Object.entries(route.fixture.policies)) {
    assert.ok(
      homepage.includes(
        `<th scope="row">${Math.round(Number(threshold) * 100)}%</th><td>${escapeHtml(result.status)}</td><td>${escapeHtml(result.route ?? 'None; review required')}</td>`,
      ),
      `Homepage confidence table must match the executed policy at ${threshold}`,
    );
  }
  const escaped = recipePage(
    { ...route, description: '</script><script>alert("x")</script>' },
    'https://example.com',
  );
  assert.ok(!escaped.includes('<script>alert'));
  assert.ok(escaped.includes('&lt;/script&gt;'));
  const schema = JSON.parse(
    escaped.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  assert.equal(
    schema['@graph'].find((node) => node['@type'] === 'TechArticle').description,
    '</script><script>alert("x")</script>',
  );
  assert.equal(route.fixture.policies['1'].status, 'review');
  const first = await readFile('site/dist/catalog.json', 'utf8');
  await run(process.execPath, ['site/build.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(await readFile('site/dist/catalog.json', 'utf8'), first);
});

test('site URLs must be deployment origins', () => {
  assert.equal(siteOrigin('https://example.com/'), 'https://example.com');
  assert.equal(siteOrigin('http://localhost:4173'), 'http://localhost:4173');
  for (const value of [
    'javascript:alert(1)',
    'https://example.com/path',
    'https://user:password@example.com',
    'https://example.com/?query=1',
    'https://example.com/#fragment',
  ])
    assert.throws(() => siteOrigin(value));
});
