import { searchRecipes } from './search.js';

const search = document.querySelector('#search');
const collection = document.querySelector('#collection');
const evidence = document.querySelector('#evidence');
const results = document.querySelector('#results');
const inspector = document.querySelector('#inspector');
const count = document.querySelector('#result-count');
const details = new Map();
let recipes = [];
let selectedId = location.hash.slice(1) || 'route';
let selectionRequest = 0;

try {
  const catalog = await fetchJson('./catalog.json');
  recipes = catalog.recipes;
  renderResults();
  await selectRecipe(selectedId);
} catch {
  count.textContent = 'The catalog could not load. Refresh this page to try again.';
}

for (const control of [search, collection, evidence])
  control.addEventListener('input', renderResults);
window.addEventListener('hashchange', () => selectRecipe(location.hash.slice(1) || 'route'));

function renderResults() {
  const matches = searchRecipes(recipes, { query: search.value }).filter(
    (recipe) =>
      (!collection.value || recipe.collection === collection.value) &&
      (!evidence.value || recipe.evidence === evidence.value),
  );
  count.textContent = `${matches.length} ${matches.length === 1 ? 'recipe' : 'recipes'}`;
  results.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent =
      'No recipes match these filters. Try a shorter task description or choose all collections.';
    results.append(empty);
  }
  for (const recipe of matches) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recipe-row';
    button.setAttribute('aria-pressed', String(recipe.id === selectedId));
    button.innerHTML = `<strong>${escapeHtml(recipe.title)}</strong><p>${escapeHtml(recipe.description)}</p><span class="evidence-label ${recipe.evidence === 'measured' ? 'current' : ''}">${evidenceLabel(recipe)}</span>`;
    button.addEventListener('click', () => {
      if (location.hash === `#${recipe.id}`) selectRecipe(recipe.id);
      else location.hash = recipe.id;
      if (matchMedia('(max-width: 680px)').matches)
        inspector.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    results.append(button);
  }
}

async function selectRecipe(id) {
  const request = ++selectionRequest;
  if (!recipes.some((recipe) => recipe.id === id)) {
    inspector.textContent = 'This recipe is not in the catalog. Choose one from the list.';
    return;
  }
  selectedId = id;
  renderResults();
  inspector.setAttribute('aria-busy', 'true');
  try {
    const recipe = await readDetails(id);
    if (request !== selectionRequest) return;
    renderInspector(recipe);
  } catch {
    inspector.textContent = 'This recipe could not load. Select it again to retry.';
  } finally {
    if (request === selectionRequest) inspector.removeAttribute('aria-busy');
  }
}

async function readDetails(id) {
  if (!details.has(id)) details.set(id, await fetchJson(`./recipes/${id}.json`));
  return details.get(id);
}

function renderInspector(recipe) {
  const required = new Set(recipe.inputSchema.required ?? []);
  const fields = Object.entries(recipe.inputSchema.properties ?? {})
    .map(
      ([name, schema]) =>
        `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(schemaType(schema))}</td><td>${required.has(name) ? 'Required' : 'Optional'}</td></tr>`,
    )
    .join('');
  const hasPolicies = Object.keys(recipe.fixture.policies).length > 0;
  const workflow =
    recipe.collection === 'agent-operations'
      ? 'agent-loop'
      : recipe.collection === 'customer-conversations'
        ? 'customer-queue'
        : null;
  inspector.innerHTML = `
    <div class="recipe-heading"><h2>${escapeHtml(recipe.title)}</h2><a href="https://github.com/agencyenterprise/jev-recipes/tree/main/recipes/${recipe.id}" class="note">View source</a></div>
    <p class="purpose">${escapeHtml(recipe.useWhen)}</p>
    <div class="import-line">import { ${recipe.functionName} } from 'jev-recipes/${recipe.id}';</div>
    ${renderEvidence(recipe)}
    <h3>Input contract</h3><table class="contract-table"><thead><tr><th>Field</th><th>Type</th><th>Needed</th></tr></thead><tbody>${fields}</tbody></table>
    <details><summary>Full input and result schemas</summary><pre id="schemas"></pre></details>
    <div class="fixture-toolbar"><h3>Explore the saved fixture</h3>${
      hasPolicies
        ? '<label>Minimum confidence<select id="confidence"><option value="">Recipe default</option>' +
          Object.keys(recipe.fixture.policies)
            .sort((a, b) => Number(a) - Number(b))
            .map((value) => `<option value="${value}">${value}</option>`)
            .join('') +
          '</select></label>'
        : ''
    }</div>
    <p class="note">A hand-authored response demonstrates the contract. No model is called here. Changing confidence applies the recipe’s actual policy to that same response.</p>
    <div class="fixture-columns"><div><p class="fixture-label">Input</p><pre id="fixture-input"></pre></div><div><p class="fixture-label">Result</p><pre id="fixture-result"></pre></div></div>
    <p class="note">Try it locally: <code>npx jev-recipes demo ${recipe.id}</code></p>
    ${workflow ? `<div class="links"><a href="https://github.com/agencyenterprise/jev-recipes/tree/main/examples/${workflow}">Read the ${workflow === 'agent-loop' ? 'agent workflow' : 'customer queue'} example</a></div>` : ''}
    <h3>Where its responsibility ends</h3><ul class="limits">${recipe.limitations.map((limitation) => `<li>${escapeHtml(limitation)}</li>`).join('')}</ul>
    <h3>Related decisions</h3><div class="related">${(recipe.related ?? []).map((related) => `<div class="related-item"><a href="#${related.id}">${escapeHtml(related.id)}</a><p>${escapeHtml(related.reason)}</p><button type="button" class="quiet-button" data-compare="${related.id}">Compare contracts</button></div>`).join('') || '<p class="note">Use the search to explore other bounded decisions.</p>'}</div>
    <div id="comparison" aria-live="polite"></div>`;
  inspector.querySelector('#schemas').textContent = JSON.stringify(
    { input: recipe.inputSchema, result: recipe.resultSchema },
    null,
    2,
  );
  const updateFixture = () => {
    const confidence = inspector.querySelector('#confidence')?.value;
    const input = {
      ...recipe.fixture.input,
      ...(confidence ? { minConfidence: Number(confidence) } : {}),
    };
    inspector.querySelector('#fixture-input').textContent = JSON.stringify(input, null, 2);
    inspector.querySelector('#fixture-result').textContent = JSON.stringify(
      confidence ? recipe.fixture.policies[confidence] : recipe.fixture.result,
      null,
      2,
    );
  };
  inspector.querySelector('#confidence')?.addEventListener('change', updateFixture);
  updateFixture();
  for (const button of inspector.querySelectorAll('[data-compare]'))
    button.addEventListener('click', async () => {
      const target = inspector.querySelector('#comparison');
      try {
        const other = await readDetails(button.dataset.compare);
        if (selectedId !== recipe.id) return;
        target.className = 'comparison';
        target.innerHTML = `<table><thead><tr><th>${escapeHtml(recipe.id)}</th><th>${escapeHtml(other.id)}</th></tr></thead><tbody><tr><td>${escapeHtml(recipe.useWhen)}</td><td>${escapeHtml(other.useWhen)}</td></tr><tr><td>Required: ${escapeHtml((recipe.inputSchema.required ?? []).join(', '))}</td><td>Required: ${escapeHtml((other.inputSchema.required ?? []).join(', '))}</td></tr><tr><td>${escapeHtml(resultFields(recipe.resultSchema).join(', '))}</td><td>${escapeHtml(resultFields(other.resultSchema).join(', '))}</td></tr></tbody></table>`;
      } catch {
        target.textContent = 'The comparison could not load. Try again.';
      }
    });
}

function renderEvidence(recipe) {
  const report = recipe.report;
  if (!report)
    return '<section class="evidence-panel" aria-label="Evaluation evidence"><strong>Fixture only</strong><p>No recorded accuracy measurement is available. Evaluate representative cases before using this decision in your workflow.</p></section>';
  const current = recipe.evidence === 'measured';
  const sample =
    report.evidence?.split === 'held-out'
      ? 'held-out'
      : report.evidence?.split === 'development'
        ? 'development'
        : 'saved';
  const interval = report.accuracyInterval95?.map(percent).join(' to ');
  return `<section class="evidence-panel" aria-label="Evaluation evidence"><strong>${escapeHtml(recipe.evidenceDetails.label)}</strong>
    <p>${escapeHtml(report.model)}${report.evidence?.evaluatedAt ? ' / ' + escapeHtml(report.evidence.evaluatedAt.slice(0, 10)) : ''} / ${report.cases} ${sample} cases</p>
    <div class="metrics"><div class="metric"><span>${percent(report.accuracy)}</span><small>All-case accuracy</small></div><div class="metric"><span>${report.review ?? 'n/a'}</span><small>Sent for review</small></div><div class="metric"><span>${report.failed ?? 'n/a'}</span><small>Failed calls / cases</small></div></div>
    ${report.ready !== undefined ? `<p>${report.ready} ready decisions, with ${percent(report.readyAccuracy)} accuracy among those decisions.</p>` : ''}
    ${interval ? `<p>95% case-level interval: ${interval}. Related synthetic cases are correlated.</p>` : ''}
    ${report.acceptance ? `<p class="${report.acceptance.met ? '' : 'warning'}">${escapeHtml(report.acceptance.label)}</p>` : ''}
    <p>${current ? 'This measures the recorded dataset, not general readiness. Label sources: ' + escapeHtml(recipe.evidenceDetails.measurement.provenance.map((item) => item.method + ': ' + item.source).join('; ')) : 'The recorded recipe version is different or unknown. Rerun the current recipe before treating these numbers as current.'}</p>
    <div class="links"><a href="./reports/${recipe.id}.json">Full report and misses</a><a href="https://github.com/agencyenterprise/jev-recipes/tree/main/evals/${recipe.id}">Dataset and labels</a></div></section>`;
}

function evidenceLabel(recipe) {
  return escapeHtml(
    `${recipe.evidenceDetails.experimental ? 'Experimental / ' : ''}${recipe.evidenceDetails.label}`,
  );
}

function resultFields(schema) {
  return [
    ...new Set([
      ...Object.keys(schema.properties ?? {}),
      ...(schema.anyOf ?? []).flatMap(resultFields),
    ]),
  ];
}

function schemaType(schema) {
  if (schema.enum) return schema.enum.join(' | ');
  if (schema.anyOf) return schema.anyOf.map(schemaType).join(' | ');
  return Array.isArray(schema.type) ? schema.type.join(' | ') : (schema.type ?? 'value');
}

function percent(value) {
  return value === null || value === undefined ? 'n/a' : `${Math.round(value * 100)}%`;
}
function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
}
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load catalog data.');
  return response.json();
}
