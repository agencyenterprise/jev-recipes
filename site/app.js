import { addCopyButtons } from './ui.js';
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
let heroRequest = 0;
const featured = ['route', 'tool-call-gate', 'rerank', 'verify', 'model-route'];
const initialParams = new URLSearchParams(location.search);
search.value = initialParams.get('q') ?? '';
collection.value = initialParams.get('collection') ?? '';
function rememberFilters() {
  const url = new URL(location.href);
  for (const [key, value] of [
    ['q', search.value],
    ['collection', collection.value],
    ['evidence', evidence.value],
  ]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  history.replaceState(null, '', url);
}
function showResults() {
  history.replaceState(null, '', `${location.pathname}${location.search}#explorer`);
  document.querySelector('.workspace').classList.remove('show-detail');
  document.querySelector('#explorer').scrollIntoView({ block: 'start' });
  search.focus({ preventScroll: true });
}
async function activateRecipe(id) {
  if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  await selectRecipe(id);
  if (selectedId !== id) return;
  if (matchMedia('(max-width: 760px)').matches) {
    document.querySelector('.workspace').classList.add('show-detail');
    inspector.scrollIntoView({ block: 'start' });
  }
  inspector.focus({ preventScroll: true });
}
for (const button of document.querySelectorAll('[data-start]'))
  button.addEventListener('click', () => {
    search.value = button.dataset.start;
    collection.value = '';
    evidence.value = '';
    resetFind();
    rememberFilters();
    activateRecipe(button.dataset.start);
  });

const evidenceNames = {
  measured: 'Current measurements',
  earlier: 'Earlier measurements',
  fixture: 'Fixture only',
  unknown: 'Unknown response origin',
};

try {
  const catalog = await fetchJson('./catalog.json');
  recipes = catalog.recipes;
  offerAvailableEvidence();
  evidence.value = initialParams.get('evidence') ?? '';
  renderResults();
  await selectRecipe(selectedId);
  if (location.hash && !isPageAnchor(location.hash.slice(1))) await activateRecipe(selectedId);
  await renderHero('route');
} catch {
  count.textContent = 'The catalog could not load. Refresh this page to try again.';
}

for (const control of [search, collection, evidence])
  control.addEventListener('input', () => {
    resetFind();
    rememberFilters();
    document.querySelector('.workspace').classList.remove('show-detail');
    results.scrollTop = 0;
    renderResults();
  });
findReset.addEventListener('click', () => {
  resetFind();
  renderResults();
});
findForm.addEventListener('submit', findWithJev);

function offerAvailableEvidence() {
  const counts = new Map();
  for (const recipe of recipes) counts.set(recipe.evidence, (counts.get(recipe.evidence) ?? 0) + 1);
  for (const [value, name] of Object.entries(evidenceNames)) {
    if (!counts.has(value)) continue;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${name} (${counts.get(value)})`;
    evidence.append(option);
  }
}

function resetFind() {
  findRequest++;
  findController?.abort();
  liveResult = null;
  findSubmit.disabled = false;
  findSubmit.textContent = 'Match with Jev';
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
    rememberFilters();
    findStatus.textContent =
      result.status === 'review'
        ? 'No strong match. Try describing the decision more specifically.'
        : `Jev found ${result.items.length} matching recipes across the full catalog.`;
    document.querySelector('#find-explanation').textContent =
      `The rerank recipe evaluated ${result.evaluated} recipes in ${result.batches} batches in ${(result.elapsedMs / 1000).toFixed(1)} seconds. Minimum relevance: ${Math.round(result.minRelevance * 100)}%. Scores are model relevance estimates, not measured accuracy. Scores from separate batches may differ in calibration.`;
    renderResults();
    if (result.items[0]) await activateRecipe(result.items[0].id);
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
      findSubmit.textContent = 'Match with Jev';
      results.removeAttribute('aria-busy');
    }
  }
}
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (id && !isPageAnchor(id)) activateRecipe(id);
  else if (!id || id === 'explorer') showResults();
});

function renderResults() {
  let ranked = liveResult
    ? liveResult.items
        .map((item) => recipes.find((recipe) => recipe.id === item.id))
        .filter(Boolean)
    : searchRecipes(recipes, { query: search.value });
  const browsing = !liveResult && !search.value.trim();
  if (browsing)
    ranked = [...ranked].sort((a, b) => {
      const priority = (id) => (featured.includes(id) ? featured.indexOf(id) : featured.length);
      return priority(a.id) - priority(b.id);
    });
  document.querySelector('#list-mode').textContent = liveResult
    ? 'AI matches'
    : browsing
      ? 'Suggested first'
      : 'Keyword matches';
  const matches = ranked.filter(
    (recipe) =>
      (!collection.value || recipe.collection === collection.value) &&
      (!evidence.value || recipe.evidence === evidence.value),
  );
  const scrollTop = results.scrollTop;
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
    button.addEventListener('click', () => activateRecipe(recipe.id));
    results.append(button);
  }
  results.scrollTop = scrollTop;
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
        `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(schemaType(schema))}</td><td>${required.has(name) ? 'Required' : 'Optional'}</td></tr>`,
    )
    .join('');
  const policies = Object.keys(recipe.fixture.policies).sort((a, b) => Number(a) - Number(b));
  const tabs = [
    ['example', 'Example'],
    ['contract', 'Inputs & outputs'],
    ['evidence', 'Evidence'],
    ['related', 'Related'],
  ];
  inspector.innerHTML = `
    <div class="inspector-actions"><button type="button" class="back-results quiet-button">Back to results</button><a class="note" href="./recipes/${recipe.id}/">Full guide</a></div>
    <div class="recipe-heading"><h2>${escapeHtml(recipe.title)}</h2></div>
    <p class="purpose">${escapeHtml(recipe.useWhen)}</p>
    <p class="evidence-status ${recipe.evidence === 'earlier' ? 'historical' : ''}">${evidenceLabel(recipe)}</p>
    <div class="recipe-tabs" role="tablist" aria-label="Recipe details">${tabs.map(([id, label], i) => `<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}</div>
    <section id="panel-example" role="tabpanel" aria-labelledby="tab-example" tabindex="0">
      <div class="fixture-toolbar"><h3>Explore a saved example</h3>${policies.length ? `<label>Minimum confidence<select id="confidence"><option value="">Recipe default</option>${policies.map((value) => `<option value="${value}">${Math.round(Number(value) * 100)}%</option>`).join('')}</select></label>` : ''}</div>
      <p class="note">A hand-authored response, not a live model call. Changing confidence applies the recipe’s policy to the same saved response.</p>
      <div id="decision-summary" class="decision-summary" aria-live="polite"></div>
      <div class="fixture-columns"><div><p class="fixture-label">Input</p><pre id="fixture-input"></pre></div><div><p class="fixture-label">Result</p><pre id="fixture-result"></pre></div></div>
      <h3>Use it in your project</h3><p class="note">Live calls require a server-side TYPESAFE_API_KEY and use API quota. Handle review decisions and provider failures in your application.</p><pre id="usage-code"></pre>
      <p class="note">Run the saved example offline:</p><pre><code>npx jev-recipes demo ${recipe.id}</code></pre>
      <a href="./docs/getting-started/">Installation and error handling</a>
    </section>
    <section id="panel-contract" role="tabpanel" aria-labelledby="tab-contract" tabindex="0" hidden><h3>Input contract</h3><div class="table-scroll"><table class="contract-table"><thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Needed</th></tr></thead><tbody>${fields}</tbody></table></div>
      <h3>Result fields</h3><p class="result-fields">${resultFields(recipe.resultSchema)
        .map((field) => `<code>${escapeHtml(field)}</code>`)
        .join(' ')}</p>
      <details><summary>Full input and result schemas</summary><pre id="schemas"></pre></details>
      <h3>Where its responsibility ends</h3><ul class="limits">${recipe.limitations.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul><a href="https://github.com/agencyenterprise/jev-recipes/tree/main/recipes/${recipe.id}">View implementation</a>
    </section>
    <section id="panel-evidence" role="tabpanel" aria-labelledby="tab-evidence" tabindex="0" hidden><h3>What has been measured?</h3>${renderEvidence(recipe)}<a href="./docs/evaluation/">Evaluate on your own cases</a></section>
    <section id="panel-related" role="tabpanel" aria-labelledby="tab-related" tabindex="0" hidden><h3>Nearby decisions</h3><div class="related">${(recipe.related ?? []).map((related) => `<div class="related-item"><a href="#${related.id}">${escapeHtml(recipes.find((r) => r.id === related.id)?.title ?? related.id)}</a><p>${escapeHtml(related.reason)}</p><button type="button" class="quiet-button" data-compare="${related.id}">Compare contracts</button></div>`).join('') || '<p>Search the catalog for more decisions.</p>'}</div><div id="comparison" aria-live="polite"></div></section>`;
  inspector.querySelector('.back-results').addEventListener('click', showResults);
  const tabButtons = [...inspector.querySelectorAll('[role="tab"]')];
  const selectTab = (button) => {
    for (const tab of tabButtons) {
      const active = tab === button;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      inspector.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden = !active;
    }
  };
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectTab(button));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
      if (event.key === 'ArrowLeft') next = (index + tabButtons.length - 1) % tabButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabButtons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabButtons[next]);
      tabButtons[next].focus();
    });
  });
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
    const result = confidence ? recipe.fixture.policies[confidence] : recipe.fixture.result;
    inspector.querySelector('#fixture-input').textContent = JSON.stringify(input, null, 2);
    inspector.querySelector('#fixture-result').textContent = JSON.stringify(result, null, 2);
    inspector.querySelector('#usage-code').textContent =
      `import { ${recipe.functionName} } from 'jev-recipes/${recipe.id}';\n\nconst result = await ${recipe.functionName}(${JSON.stringify(input, null, 2)});\nconsole.log(result);`;
    const summary = inspector.querySelector('#decision-summary');
    const status =
      result.status ??
      (result.checks?.some((check) => check.status === 'review') ? 'review' : null);
    summary.innerHTML = `${status ? `<span class="decision-badge ${status === 'review' ? 'review' : 'ready'}">${status === 'review' ? 'Needs review' : 'Ready decision'}</span>` : '<span class="subtle-badge">Saved result</span>'}<span>${escapeHtml(result.route ?? result.action ?? result.verdict ?? (result.items ? `${result.items.length} selected items` : 'Inspect the structured result below'))}</span>`;
  };
  inspector.querySelector('#confidence')?.addEventListener('change', updateFixture);
  updateFixture();
  addCopyButtons(inspector);
  for (const button of inspector.querySelectorAll('[data-compare]'))
    button.addEventListener('click', async () => {
      const target = inspector.querySelector('#comparison');
      try {
        const other = await readDetails(button.dataset.compare);
        if (selectedId !== recipe.id) return;
        target.className = 'comparison';
        target.innerHTML = `<table><thead><tr><th>${escapeHtml(recipe.title)}</th><th>${escapeHtml(other.title)}</th></tr></thead><tbody><tr><td>${escapeHtml(recipe.useWhen)}</td><td>${escapeHtml(other.useWhen)}</td></tr><tr><td>Required: ${escapeHtml((recipe.inputSchema.required ?? []).join(', '))}</td><td>Required: ${escapeHtml((other.inputSchema.required ?? []).join(', '))}</td></tr><tr><td>${escapeHtml(resultFields(recipe.resultSchema).join(', '))}</td><td>${escapeHtml(resultFields(other.resultSchema).join(', '))}</td></tr></tbody></table>`;
      } catch {
        target.textContent = 'The comparison could not load. Try again.';
      }
    });
}

async function renderHero(id) {
  const request = ++heroRequest;
  const target = document.querySelector('#hero-demo');
  try {
    const recipe = await readDetails(id);
    if (request !== heroRequest) return;
    const input = recipe.fixture.input;
    target.innerHTML = `<p class="demo-input">“${escapeHtml(input.request ?? input.query)}”</p>
      <div class="decision-path"><span>${escapeHtml(recipe.functionName)}()</span><span aria-hidden="true" class="path-line"></span><span id="hero-outcome" class="decision-badge ready"></span></div>
      ${
        id === 'route'
          ? `<label class="hero-policy">Minimum confidence<select id="hero-confidence">${Object.keys(
              recipe.fixture.policies,
            )
              .sort((a, b) => Number(a) - Number(b))
              .map(
                (value) =>
                  `<option value="${value}" ${Number(value) === input.minConfidence ? 'selected' : ''}>${Math.round(Number(value) * 100)}%</option>`,
              )
              .join('')}</select></label>`
          : ''
      }
      <div id="hero-result" class="hero-result" aria-live="polite"></div>`;
    const update = () => {
      const threshold = target.querySelector('#hero-confidence')?.value;
      const result = threshold ? recipe.fixture.policies[threshold] : recipe.fixture.result;
      const outcome = target.querySelector('#hero-outcome');
      outcome.className = `decision-badge ${result.status === 'review' ? 'review' : 'ready'}`;
      outcome.textContent =
        result.status === 'review'
          ? 'Needs review'
          : (result.route ?? `${result.items.length} relevant passage`);
      target.querySelector('#hero-result').innerHTML =
        id === 'route'
          ? `<div><span>Saved confidence</span><strong>${Math.round(result.confidence * 100)}%</strong></div><p>${result.status === 'review' ? 'The saved confidence falls below your threshold. Your app sends this decision to review.' : 'The saved confidence meets your threshold. Your app can route this request to billing.'}</p>`
          : `<p>${escapeHtml(result.items[0]?.text ?? 'No passage selected.')}</p><span class="note">${result.evaluated} passages checked · ${Math.round(result.items[0]?.relevance * 100)}% model relevance</span>`;
    };
    target.querySelector('#hero-confidence')?.addEventListener('change', update);
    update();
  } catch {
    if (request === heroRequest)
      target.innerHTML = '<p>The saved example could not load. Refresh to try again.</p>';
  }
}
for (const button of document.querySelectorAll('[data-scenario]'))
  button.addEventListener('click', () => {
    for (const item of document.querySelectorAll('[data-scenario]'))
      item.setAttribute('aria-pressed', String(item === button));
    renderHero(button.dataset.scenario);
  });

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load catalog data.');
  return response.json();
}
