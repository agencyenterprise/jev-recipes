import { escapeHtml as html, renderEvidence, schemaType } from './render.js';

export const source = 'https://github.com/agencyenterprise/jev-recipes';
export const maintainer = { name: 'Jeff Patterson', url: 'https://github.com/jpatterson933' };
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

export function metadata({
  origin,
  path = '/',
  title,
  summary,
  type = 'WebPage',
  updatedAt = null,
  alternates = [],
}) {
  const url = origin + path;
  const dated = updatedAt ? { dateModified: updatedAt } : {};
  return `<link rel="canonical" href="${html(url)}" />
    <meta name="author" content="${html(maintainer.name)}" />
    ${alternates.map((alternate) => `<link rel="alternate" type="${html(alternate.type)}" href="${html(alternate.href)}" />`).join('\n    ')}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jev recipes" />
    <meta property="og:title" content="${html(title)}" />
    <meta property="og:description" content="${html(summary)}" />
    <meta property="og:url" content="${html(url)}" />
    <script type="application/ld+json">${jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': origin + '/#maintainer',
          name: maintainer.name,
          url: maintainer.url,
          sameAs: [maintainer.url],
        },
        {
          '@type': 'Organization',
          '@id': origin + '/#contributors',
          name: 'jev-recipes contributors',
          url: source,
          member: { '@id': origin + '/#maintainer' },
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
          author: { '@id': origin + '/#maintainer' },
          publisher: { '@id': origin + '/#contributors' },
          ...dated,
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
                maintainer: { '@id': origin + '/#maintainer' },
              },
            ]
          : []),
      ],
    })}</script>`;
}

function page({ origin, path, title, summary, content, base, type, updatedAt, alternates }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${html(title)}</title><meta name="description" content="${html(summary)}" />
${metadata({ origin, path, title, summary, type, updatedAt, alternates })}
<link rel="stylesheet" href="${base}style.css" /></head><body>
<header class="masthead"><a class="brand" href="${base}">jev<span>recipes</span></a>
<nav aria-label="Resources"><a href="${base}recipes/">All recipes</a><a href="${base}docs/evaluation/">Evaluation guide</a><a href="${source}">Source</a><a href="${base}#about">About</a></nav></header>
<main class="guide">${content}</main>
<footer>Maintained by <a rel="author" href="${maintainer.url}">${html(maintainer.name)}</a> with <a href="${source}/graphs/contributors">jev-recipes contributors</a>.
MIT licensed. Independent community project. Jev and TypeSafe are products of TypeSafe AI.
<a href="${source}/issues">Report an issue</a>.</footer></body></html>\n`;
}

function updatedLine(updatedAt) {
  return updatedAt
    ? `<p class="note">Last updated <time datetime="${html(updatedAt)}">${html(updatedAt)}</time>.</p>`
    : '';
}

export function recipePage(recipe, origin, guide = '') {
  const required = new Set(recipe.inputSchema.required ?? []);
  const fields = Object.entries(recipe.inputSchema.properties ?? {})
    .map(
      ([name, schema]) =>
        `<tr><th scope="row">${html(name)}</th><td>${html(schemaType(schema))}</td><td>${required.has(name) ? 'Required' : 'Optional'}</td></tr>`,
    )
    .join('');
  const id = html(recipe.id);
  const content = `<p class="note"><a href="../">Recipe catalog</a> / ${id}</p>
    <h1>${html(recipe.title)}</h1>
    <p class="purpose"><code>${id}</code> is a Jev recipe from the <code>jev-recipes</code> TypeScript package. ${html(recipe.description)} Use it when ${html(lowerFirst(recipe.useWhen))}</p>
    ${updatedLine(recipe.updatedAt)}
    <p><a href="../../#${recipe.id}">Explore this recipe interactively</a> · <a href="${source}/tree/main/recipes/${recipe.id}">Source and implementation guide</a> · <a href="./index.md">Markdown version</a></p>
    <h2>How do I use ${id} in TypeScript?</h2>
    <p>Install with <code>npm install jev-recipes</code>. Requires Node.js 22.9 or newer and ES modules. Set <code>TYPESAFE_API_KEY</code> in your server environment for live calls, which send input to TypeSafe and use API quota. See the <a href="${source}/blob/main/README.md#use-a-recipe">installation guide</a>.</p>
    <pre><code>${html(`import { ${recipe.functionName} } from 'jev-recipes/${recipe.id}';\n\nconst result = await ${recipe.functionName}(${JSON.stringify(recipe.fixture.input, null, 2)});\nconsole.log(result);`)}</code></pre>
    <h2>What input does ${id} take?</h2><div class="table-scroll"><table class="contract-table"><thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Needed</th></tr></thead><tbody>${fields}</tbody></table></div>
    <details><summary>Full input and result schemas</summary><pre>${html(JSON.stringify({ input: recipe.inputSchema, result: recipe.resultSchema }, null, 2))}</pre></details>
    <h2>What does a ${id} result look like?</h2><p>This hand-authored response demonstrates the contract. It is not a model accuracy measurement. Run it without an API key: <code>npx jev-recipes demo ${recipe.id}</code>.</p>
    <pre>${html(JSON.stringify(recipe.fixture.result, null, 2))}</pre>
    ${guide}
    <h2>How accurate is ${id}?</h2>${renderEvidence(recipe, '../../')}
    <p>Use the <a href="../../docs/evaluation/">evaluation guide</a> to measure this decision on your own labeled cases.</p>
    <h2>What are the limits of ${id}?</h2><ul>${recipe.limitations.map((item) => `<li>${html(item)}</li>`).join('')}</ul>
    <h2>Which recipes are related to ${id}?</h2><ul>${(recipe.related ?? []).map((item) => `<li><a href="../${item.id}/">${html(item.id)}</a>: ${html(item.reason)}</li>`).join('') || '<li>Browse the <a href="../">full catalog</a> for more decisions.</li>'}</ul>`;
  return page({
    origin,
    path: `/recipes/${recipe.id}/`,
    title: `${recipe.title} | Jev recipes`,
    summary: recipe.description,
    content,
    base: '../../',
    type: 'TechArticle',
    updatedAt: recipe.updatedAt,
    alternates: [{ type: 'text/markdown', href: `${origin}/recipes/${recipe.id}/index.md` }],
  });
}

function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function docPage({ name, title, body, updatedAt }, origin) {
  const content = `<p class="note"><a href="../../">Jev recipes</a> / docs / ${html(name)}</p>
    ${body}
    ${updatedLine(updatedAt)}
    <p><a href="../${name}.md">Markdown version</a> · <a href="${source}/blob/main/docs/${name}.md">Source on GitHub</a></p>`;
  return page({
    origin,
    path: `/docs/${name}/`,
    title: `${title} | Jev recipes`,
    summary: `${title} for the jev-recipes TypeScript library.`,
    content,
    base: '../../',
    type: 'TechArticle',
    updatedAt,
    alternates: [{ type: 'text/markdown', href: `${origin}/docs/${name}.md` }],
  });
}

export function catalogPage(recipes, origin, updatedAt) {
  const groups = new Map();
  for (const recipe of recipes) {
    if (!groups.has(recipe.category)) groups.set(recipe.category, []);
    groups.get(recipe.category).push(recipe);
  }
  const content = `<h1>Jev recipe catalog</h1><p>Browse ${recipes.length} TypeScript recipes for bounded decisions. Each guide includes an input contract, a saved example, evaluation evidence, and limitations.</p>
    ${updatedLine(updatedAt)}
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
    updatedAt,
  });
}

export function notFoundPage(origin) {
  return page({
    origin,
    path: '/404.html',
    title: 'Page not found | Jev recipes',
    summary: 'The requested page does not exist on the Jev recipes site.',
    content: `<h1>Page not found</h1>
    <p>This address does not match a page on this site. The recipe may have been renamed, or the link may be out of date.</p>
    <p><a href="/recipes/">Browse the recipe catalog</a> or <a href="/">return to the homepage</a>.</p>`,
    base: '/',
    type: 'WebPage',
  });
}

export function sitemap(pages, origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .map(
      ({ path, updatedAt }) =>
        `<url><loc>${html(origin + path)}</loc>${updatedAt ? `<lastmod>${html(updatedAt)}</lastmod>` : ''}</url>`,
    )
    .join('')}</urlset>\n`;
}
