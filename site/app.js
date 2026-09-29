import { searchRecipes } from './search.js';
import { renderEvidence, evidenceLabel, resultFields, schemaType, escapeHtml } from './render.js';

const search = document.querySelector('#search');
const collection = document.querySelector('#collection');
const evidence = document.querySelector('#evidence');
const results = document.querySelector('#results');
const inspector = document.querySelector('#inspector');
const count = document.querySelector('#result-count');
const findForm = document.querySelector('#find-form');
const findSubmit = document.querySelector('#find-submit');
const findReset = document.querySelector('#find-reset');
const findStatus = document.querySelector('#find-status');
const findDetails = document.querySelector('#find-details');
let liveResult = null;
let findRequest = 0;
let findController;
const details = new Map();
let recipes = [];
const isPageAnchor = (id) => Boolean(id && document.getElementById(id));
let selectedId = isPageAnchor(location.hash.slice(1)) ? 'route' : location.hash.slice(1) || 'route';
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
  control.addEventListener('input', () => {
    resetFind();
    renderResults();
  });
findReset.addEventListener('click', () => {
  resetFind();
  renderResults();
});
findForm.addEventListener('submit', findWithJev);

function resetFind() {
  findRequest++;
  findController?.abort();
  liveResult = null;
  findSubmit.disabled = false;
  findSubmit.textContent = 'Find with Jev';
  findReset.hidden = true;
  findDetails.hidden = true;
  findStatus.textContent = '';
  results.removeAttribute('aria-busy');
}

async function findWithJev(event) {
  event.preventDefault();
  resetFind();
  const query = search.value.trim();
  if (query.length < 3) {
    findStatus.textContent = 'Describe your decision in at least 3 characters.';
    return;
  }
  const request = findRequest;
  findController = new AbortController();
  const controller = findController;
  const timer = setTimeout(() => controller.abort(), 30_000);
  findSubmit.disabled = true;
  findSubmit.textContent = 'Finding recipes…';
  findStatus.textContent = `Jev is evaluating ${recipes.length} recipes. Keyword matches remain below while you wait.`;
  results.setAttribute('aria-busy', 'true');
  renderResults();
  let failureMessage = 'Could not reach Jev matching. Check your connection or try again.';
  try {
    const response = await fetch('./api/find', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: findController.signal,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      failureMessage =
        typeof error?.error === 'string'
          ? error.error
          : `Jev matching is unavailable (HTTP ${response.status}).`;
      throw new Error('Matching unavailable');
    }
    const result = await response.json();
    if (request !== findRequest) return;
    liveResult = result;
    findReset.hidden = false;
    findDetails.hidden = false;
    // Live discovery searches the full catalog; clear filters rather than hiding matches.
    collection.value = '';
    evidence.value = '';
    findStatus.textContent =
      result.status === 'review'
        ? 'No strong match. Try describing the decision more specifically.'
        : `Jev found ${result.items.length} matching recipes across the full catalog.`;
    document.querySelector('#find-explanation').textContent =
      `The rerank recipe evaluated ${result.evaluated} recipes in ${result.batches} batches in ${(result.elapsedMs / 1000).toFixed(1)} seconds. Minimum relevance: ${Math.round(result.minRelevance * 100)}%. Scores are model relevance estimates, not measured accuracy. Scores from separate batches may differ in calibration.`;
    renderResults();
    if (result.items[0]) await selectRecipe(result.items[0].id);
  } catch {
    if (request !== findRequest) return;
    if (controller.signal.aborted)
      failureMessage = 'Jev took too long to respond. Please try again.';
    findStatus.textContent = `${failureMessage} Showing keyword results.`;
    renderResults();
  } finally {
    clearTimeout(timer);
    if (request === findRequest) {
      findSubmit.disabled = false;
      findSubmit.textContent = 'Find with Jev';
      results.removeAttribute('aria-busy');
    }
  }
}
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (!isPageAnchor(id)) selectRecipe(id || 'route');
});

function renderResults() {
  const ranked = liveResult
    ? liveResult.items
        .map((item) => recipes.find((recipe) => recipe.id === item.id))
        .filter(Boolean)
    : searchRecipes(recipes, { query: search.value });
  const matches = ranked.filter(
    (recipe) =>
      (!collection.value || recipe.collection === collection.value) &&
      (!evidence.value || recipe.evidence === evidence.value),
  );
  count.textContent = `${matches.length} ${matches.length === 1 ? 'recipe' : 'recipes'}`;
  results.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = liveResult
      ? 'No recipe met the relevance threshold. Refine your description or return to keyword search.'
      : 'No recipes match these filters. Try a shorter task description or choose all collections.';
    results.append(empty);
  }
  for (const recipe of matches) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recipe-row';
    button.setAttribute('aria-pressed', String(recipe.id === selectedId));
    button.innerHTML = `<strong>${escapeHtml(recipe.title)}</strong><p>${escapeHtml(recipe.description)}</p><span class="evidence-label ${recipe.evidence === 'measured' ? 'current' : ''}">${evidenceLabel(recipe)}</span>`;
    if (liveResult) {
      const match = liveResult.items.find((item) => item.id === recipe.id);
      const relevance = document.createElement('p');
      relevance.className = 'match-relevance';
      relevance.textContent = `Jev relevance: ${Math.round(match.relevance * 100)}% · ${recipe.useWhen}`;
      button.append(relevance);
    }
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
    <p><a href="./recipes/${recipe.id}/">Open recipe guide</a></p>
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

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load catalog data.');
  return response.json();
}
