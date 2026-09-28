import { escapeHtml as html, renderEvidence, schemaType } from './render.js';

export const source = 'https://github.com/agencyenterprise/jev-recipes';
export const description =
  'Jev recipes is a TypeScript library for route decisions, review results, and evidence. Use this guide to inspect recipes, run examples, and evaluate accuracy.';

export function siteOrigin(value = 'https://jev-recipes.com') {
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'SITE_URL must be an HTTP(S) origin without a path, credentials, query, or hash.',
    );
  return url.origin;
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function metadata({ origin, path = '/', title, summary, type = 'WebPage' }) {
  const url = origin + path;
  return `<link rel="canonical" href="${html(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jev recipes" />
    <meta property="og:title" content="${html(title)}" />
    <meta property="og:description" content="${html(summary)}" />
    <meta property="og:url" content="${html(url)}" />
    <script type="application/ld+json">${jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': origin + '/#contributors',
          name: 'jev-recipes contributors',
          url: source,
        },
        {
          '@type': 'WebSite',
          '@id': origin + '/#website',
          name: 'Jev recipes',
          url: origin + '/',
          publisher: { '@id': origin + '/#contributors' },
        },
        {
          '@type': type,
          '@id': url,
          url,
          name: title,
          description: summary,
          inLanguage: 'en',
          isPartOf: { '@id': origin + '/#website' },
          author: { '@id': origin + '/#contributors' },
        },
        ...(path === '/'
          ? [
              {
                '@type': 'SoftwareSourceCode',
                name: 'jev-recipes',
                description,
                codeRepository: source,
                programmingLanguage: 'TypeScript',
                license: source + '/blob/main/LICENSE',
                author: { '@id': origin + '/#contributors' },
              },
            ]
          : []),
      ],
    })}</script>`;
}

function page({ origin, path, title, summary, content, base, type }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${html(title)}</title><meta name="description" content="${html(summary)}" />
${metadata({ origin, path, title, summary, type })}
<link rel="stylesheet" href="${base}style.css" /></head><body>
<header class="masthead"><a class="brand" href="${base}">jev<span>recipes</span></a>
<nav aria-label="Resources"><a href="${base}recipes/">All recipes</a><a href="${source}">Source</a><a href="${base}#about">About</a></nav></header>
<main class="guide">${content}</main>
<footer>Maintained by <a href="${source}/graphs/contributors">jev-recipes contributors</a>.
MIT licensed. Independent community project. Jev and TypeSafe are products of TypeSafe AI.
<a href="${source}/issues">Report an issue</a>.</footer></body></html>\n`;
}

export function recipePage(recipe, origin) {
  const required = new Set(recipe.inputSchema.required ?? []);
  const fields = Object.entries(recipe.inputSchema.properties ?? {})
    .map(
      ([name, schema]) =>
        `<tr><th scope="row">${html(name)}</th><td>${html(schemaType(schema))}</td><td>${required.has(name) ? 'Required' : 'Optional'}</td></tr>`,
    )
    .join('');
  const content = `<p class="note"><a href="../">Recipe catalog</a> / ${html(recipe.id)}</p>
    <h1>${html(recipe.title)}</h1><p class="purpose">${html(recipe.description)}</p>
    <p>${html(recipe.useWhen)}</p>
    <p><a href="../../#${recipe.id}">Explore this recipe interactively</a> · <a href="${source}/tree/main/recipes/${recipe.id}">Source and implementation guide</a></p>
    <h2>Use ${html(recipe.id)} in TypeScript</h2>
    <p>Install with <code>npm install jev-recipes</code>. Requires Node.js 22.9 or newer and ES modules. Set <code>TYPESAFE_API_KEY</code> in your server environment for live calls, which send input to TypeSafe and use API quota. See the <a href="${source}/blob/main/README.md#use-a-recipe">installation guide</a>.</p>
    <pre><code>${html(`import { ${recipe.functionName} } from 'jev-recipes/${recipe.id}';\n\nconst result = await ${recipe.functionName}(${JSON.stringify(recipe.fixture.input, null, 2)});\nconsole.log(result);`)}</code></pre>
    <h2>Input contract</h2><div class="table-scroll"><table class="contract-table"><thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Needed</th></tr></thead><tbody>${fields}</tbody></table></div>
    <details><summary>Full input and result schemas</summary><pre>${html(JSON.stringify({ input: recipe.inputSchema, result: recipe.resultSchema }, null, 2))}</pre></details>
    <h2>Saved example result</h2><p>This hand-authored response demonstrates the contract. It is not a model accuracy measurement. Run it without an API key: <code>npx jev-recipes demo ${recipe.id}</code>.</p>
    <pre>${html(JSON.stringify(recipe.fixture.result, null, 2))}</pre>
    <h2>Evaluation evidence</h2>${renderEvidence(recipe, '../../')}
    <p>Use the <a href="${source}/blob/main/docs/evaluation.md">evaluation guide</a> to measure this decision on your own labeled cases.</p>
    <h2>Limitations</h2><ul>${recipe.limitations.map((item) => `<li>${html(item)}</li>`).join('')}</ul>
    <h2>Related recipes</h2><ul>${(recipe.related ?? []).map((item) => `<li><a href="../${item.id}/">${html(item.id)}</a>: ${html(item.reason)}</li>`).join('') || '<li>Browse the <a href="../">full catalog</a> for more decisions.</li>'}</ul>`;
  return page({
    origin,
    path: `/recipes/${recipe.id}/`,
    title: `${recipe.title} | Jev recipes`,
    summary: recipe.description,
    content,
    base: '../../',
    type: 'TechArticle',
  });
}

export function catalogPage(recipes, origin) {
  const groups = new Map();
  for (const recipe of recipes) {
    if (!groups.has(recipe.category)) groups.set(recipe.category, []);
    groups.get(recipe.category).push(recipe);
  }
  const content = `<h1>Jev recipe catalog</h1><p>Browse ${recipes.length} TypeScript recipes for bounded decisions. Each guide includes an input contract, a saved example, evaluation evidence, and limitations.</p>
    <p>Use the <a href="../#explorer">interactive explorer</a> to search and compare recipes.</p>
    ${[...groups].map(([category, entries]) => `<section><h2>${html(category)}</h2><ul class="catalog-links">${entries.map((recipe) => `<li><a href="./${recipe.id}/">${html(recipe.title)}</a><p>${html(recipe.description)}</p><span class="note">${html(recipe.evidenceDetails.label)}</span></li>`).join('')}</ul></section>`).join('')}`;
  return page({
    origin,
    path: '/recipes/',
    title: 'TypeScript recipe catalog | Jev recipes',
    summary:
      'Browse Jev recipe guides with TypeScript examples, input contracts, evaluation evidence, and limitations.',
    content,
    base: '../',
    type: 'CollectionPage',
  });
}

export function sitemap(recipes, origin) {
  const paths = ['/', '/recipes/', ...recipes.map((recipe) => `/recipes/${recipe.id}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${html(origin + path)}</loc></url>`).join('')}</urlset>\n`;
}
