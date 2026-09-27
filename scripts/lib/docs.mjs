import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'prettier';
import { replaceSection } from './generate.mjs';

const categoryTitles = {
  'answer-quality': 'Answer quality',
  retrieval: 'Retrieval and evidence',
  conversation: 'Conversation',
  workflow: 'Tools and tasks',
  support: 'Customer support',
  memory: 'Memory',
  knowledge: 'Knowledge maintenance',
};

export const collections = [
  {
    tag: 'harness',
    title: 'Agent harness',
    intro:
      'Recipes for the decision points inside an agent loop: gating a tool call before it runs, choosing a model tier per turn, pruning stale context, deciding whether an event should wake a paused agent, screening a diff, and checking a completion claim against evidence. Several ask every question in one request, so the extra checks add no latency.\n\n' +
      'Search with `npx jev-recipes list harness`. Run deterministic rules first and send these recipes the gray-zone cases; the [tool-call-gate guide](tool-call-gate/README.md) shows the pattern.',
  },
  {
    tag: 'psychology',
    title: 'Psychology & behavior',
    intro:
      'Recipes for annotating expressed wording, explanations, and reasons, gathered from the categories above.\n\n' +
      'Search with `npx jev-recipes list psychology`. For research, validate labels against independent human annotations; see the [research guide](../docs/ai-alignment-research.md).',
  },
  {
    tag: 'music',
    title: 'Music & sound',
    intro:
      'Recipes for performance loops, listener steering, and instrument or music-software tooling, gathered from the categories above. Pass musical state as text or JSON; exact theory checks belong in code.\n\n' +
      'Search with `npx jev-recipes list music`.',
  },
];

export async function renderDocs(root, records) {
  const files = new Map();
  const count = records.length;
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  const summary = `${count} focused recipes for JavaScript and TypeScript. Route messages, check evidence, and label model responses with a function call.`;
  const route = records.find((recipe) => recipe.id === 'route');
  let rootReadme = replaceSection(readme, 'summary', summary);
  if (route) {
    const { minConfidence: _minConfidence, ...input } = route.fixture.input;
    const snippet = await format(
      `import { ${route.functionName} } from 'jev-recipes/route';\n\nconst result = await ${route.functionName}(${JSON.stringify(input)});\n\nif (result.status === 'ready') {\n  console.log('Send this message to:', result.route);\n} else {\n  console.log('Needs review: ask for more detail or send to a person.');\n}\n`,
      { parser: 'babel', singleQuote: true },
    );
    rootReadme = replaceSection(rootReadme, 'quickstart', `\`\`\`js\n${snippet.trim()}\n\`\`\``);
    const comparisonPath = 'docs/api-sdk-recipes.md';
    files.set(
      comparisonPath,
      await renderComparison(await readFile(join(root, comparisonPath), 'utf8'), route),
    );
  }
  files.set('README.md', rootReadme);
  const catalog = await readFile(join(root, 'recipes/README.md'), 'utf8');
  const sections = Object.entries(categoryTitles).map(([category, title]) => {
    const matching = records.filter((recipe) => recipe.metadata.category === category);
    if (!matching.length) return '';
    return `## ${title}\n\n${recipeTable(matching)}`;
  });
  for (const { tag, title, intro } of collections) {
    const matching = records.filter((recipe) => recipe.metadata.tags.includes(tag));
    if (matching.length) sections.push(`## ${title}\n\n${intro}\n\n${recipeTable(matching)}`);
  }
  files.set(
    'recipes/README.md',
    replaceSection(
      catalog,
      'catalog',
      `${count} recipes. Each guide includes a working call, input reference, result behavior, and nearby alternatives.\n\n${sections.filter(Boolean).join('\n\n')}`,
    ),
  );
  for (const recipe of records) {
    const path = `recipes/${recipe.id}/README.md`;
    const original = await readFile(join(root, path), 'utf8');
    const code = await format(
      `import { ${recipe.functionName} } from 'jev-recipes/${recipe.id}';\n\nconst result = await ${recipe.functionName}(${JSON.stringify(recipe.fixture.input)});\nconsole.log(result);\n`,
      { parser: 'typescript', singleQuote: true, printWidth: 90 },
    );
    const alternatives = recipe.metadata.related.length
      ? `\n\nRelated recipes:\n\n${recipe.metadata.related.map(({ id, reason }) => `- [\`${id}\`](../${id}/README.md): ${reason}`).join('\n')}`
      : '';
    const usage = `${recipe.metadata.description}\n\nUse when: ${recipe.metadata.useWhen}\n\nInstall \`jev-recipes\` and set \`TYPESAFE_API_KEY\` in your server environment. See the [quick start](../../README.md#use-a-recipe).\n\n\`\`\`ts\n${code.trim()}\n\`\`\`\n\nTry the saved example without an API key: \`npx jev-recipes demo ${recipe.id}\`.\n\n<details>\n<summary>Illustrative result from the offline fixture</summary>\n\n\`\`\`json\n${JSON.stringify(recipe.result, null, 2)}\n\`\`\`\n\nThis saved response illustrates behavior; it is not a model accuracy measurement.\n\n</details>${alternatives}`;
    let updated = replaceSection(original, 'usage', usage);
    updated = replaceSection(updated, 'input', schemaTable(recipe.inputSchema));
    const snapshot = await readSnapshot(root, recipe.id);
    if (snapshot) {
      updated = renderMeasuredAccuracy(recipe.id, updated, snapshot);
    } else if (original.includes('<!-- BEGIN GENERATED: accuracy -->')) {
      updated = replaceSection(
        updated,
        'accuracy',
        `No golden dataset has been run for this recipe yet. Add cases under \`evals/${recipe.id}/cases.jsonl\` and run \`npm run eval -- ${recipe.id}\` to save results and update this guide.`,
      );
    }
    files.set(path, updated);
  }
  return files;
}

export function renderMeasuredAccuracy(id, guide, report) {
  if (!guide.includes('<!-- BEGIN GENERATED: accuracy -->'))
    throw new Error(
      `recipes/${id}/README.md: evals/results/${id}.json exists, so add a "## Measured accuracy" heading with accuracy markers.`,
    );
  return replaceSection(guide, 'accuracy', accuracySection(id, report));
}

async function readSnapshot(root, id) {
  try {
    return JSON.parse(await readFile(join(root, 'evals/results', `${id}.json`), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

const REPORTED_THRESHOLDS = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95];

function accuracySection(id, snapshot) {
  const pct = (value) =>
    value === null || value === undefined ? 'n/a' : `${Math.round(value * 100)}%`;
  const breakdown = [
    snapshot.contestedAccuracy === null ? '' : `contested cases ${pct(snapshot.contestedAccuracy)}`,
    snapshot.adversarialAccuracy === null
      ? ''
      : `adversarial cases ${pct(snapshot.adversarialAccuracy)}`,
  ]
    .filter(Boolean)
    .join(', ');
  const lines = [
    `Measured on ${snapshot.cases} golden cases against \`${snapshot.model}\`: **${pct(snapshot.accuracy)} accurate** overall${breakdown ? ` (${breakdown})` : ''}.`,
  ];
  if (snapshot.evidence) {
    const evidence = snapshot.evidence;
    lines.push(
      '',
      `Recorded ${evidence.evaluatedAt.slice(0, 10)} with package ${evidence.packageVersion}, on the **${evidence.split}** split. Recipe fingerprint: \`${evidence.recipeFingerprint}\`.`,
      '',
      `${snapshot.correct}/${snapshot.cases} cases correct; ${snapshot.ready} ready, ${snapshot.review} review, ${snapshot.failed} failed. Accuracy among ready cases: ${pct(snapshot.readyAccuracy)}.`,
      '',
      `Latency: p50 ${snapshot.latencyMs.p50} ms, p95 ${snapshot.latencyMs.p95} ms. Usage: ${snapshot.usage.input_tokens} input tokens and ${snapshot.usage.output_tokens} output tokens across ${snapshot.usage.requests} logical requests.`,
      '',
      `Labels: ${evidence.provenance.map((entry) => `${entry.method} (${entry.cases} cases): ${entry.source}`).join(' ')}`,
      '',
      'These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.',
    );
    if (snapshot.accuracyInterval95)
      lines.push(
        '',
        `95% case-level accuracy interval: ${snapshot.accuracyInterval95.map(pct).join(' to ')}.`,
      );
    if (snapshot.acceptance) lines.push('', `**${snapshot.acceptance.label}.**`);
  }
  if (snapshot.itemAccuracy !== undefined) {
    lines.push(
      '',
      `A case counts as correct only when every item in it is right. Across the ${snapshot.items} individual items, **${pct(snapshot.itemAccuracy)}** were judged correctly.`,
    );
  }
  const rows = snapshot.thresholds.filter((entry) =>
    REPORTED_THRESHOLDS.includes(entry.minConfidence),
  );
  if (snapshot.thresholdEvaluation === 'recipe-replay') {
    lines.push(
      '',
      '| `minConfidence` | Deferred to review | Accuracy of ready results |',
      '| --- | --- | --- |',
      ...rows.map(
        (entry) =>
          `| ${entry.minConfidence} | ${pct(entry.deferRate)} | ${pct(entry.readyAccuracy)} |`,
      ),
      '',
      snapshot.suggestedMinConfidence === null
        ? 'No threshold reaches 95% accuracy on ready results in this dataset.'
        : `The lowest threshold reaching 95% accuracy on ready results is ${snapshot.suggestedMinConfidence}.`,
    );
  } else if (snapshot.thresholdEvaluation === 'frozen-policy') {
    lines.push(
      '',
      `Evaluated with the policy frozen on development data: minConfidence ${snapshot.evidence.policy.minConfidence ?? 'from the case or recipe default'}. No threshold search was performed on held-out cases.`,
    );
  } else if (snapshot.thresholdEvaluation === 'not-applicable') {
    lines.push(
      '',
      'This recipe has no minConfidence setting, so no confidence-threshold table is reported.',
    );
  } else {
    lines.push('', 'Confidence-threshold results are not available for this saved run.');
  }
  lines.push(
    '',
    `Run \`npm run eval -- ${id}\` to save new results and update this guide. The full report, including misses, is in [evals/results/${id}.json](../../evals/results/${id}.json). Accuracy on your own data may differ.`,
  );
  return lines.join('\n');
}

function recipeTable(records) {
  return (
    '| Recipe | Function | Use when |\n| --- | --- | --- |\n' +
    records
      .map(
        ({ id, functionName, metadata }) =>
          `| [\`${id}\`](${id}/README.md) | \`${functionName}\` | ${cell(metadata.useWhen)} |`,
      )
      .join('\n')
  );
}

async function renderComparison(original, route) {
  if (route.requests.length !== 1 || route.requests[0].questions.route?.type !== 'choice') {
    throw new Error('The API/SDK comparison expects one route choice request.');
  }
  const { request, routes, minConfidence = 0.8 } = route.fixture.input;
  const question = route.requests[0].questions.route;
  const instructions = JSON.stringify(question.instructions);
  const criteria = `{ ...routes, __review__: ${JSON.stringify(question.criteria.__review__)} }`;
  const interpret = `const answer = response.answers.route;
const needsReview = answer.choice === '__review__' || answer.confidence < minConfidence;
const result = {
  status: needsReview ? 'review' : 'ready',
  route: needsReview ? null : answer.choice,
  confidence: answer.confidence,
};
console.log(result);`;
  const snippets = {
    'comparison-input': `const request = ${JSON.stringify(request)};
const routes = ${JSON.stringify(routes)};
const minConfidence = ${minConfidence};
const model = 'jev-latest';`,
    'comparison-api': `const apiKey = process.env.TYPESAFE_API_KEY;
if (!apiKey) throw new Error('Set TYPESAFE_API_KEY before running this example.');
const http = await fetch('https://api.typesafe.ai/v1/systemone', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
  signal: AbortSignal.timeout(30_000),
  body: JSON.stringify({
    model,
    state: { request },
    questions: {
      route: { type: 'choice', instructions: ${instructions}, criteria: ${criteria} },
    },
  }),
});
if (!http.ok) throw new Error('TypeSafe request failed: HTTP ' + http.status);
const response = await http.json();
${interpret}`,
    'comparison-sdk': `import { TypeSafeClient, choice } from '@typesafe-ai/sdk';
const client = new TypeSafeClient({ timeout: 30_000 });
const response = await client.systemOne({
  model,
  state: { request },
  questions: { route: choice(${instructions}, ${criteria}) },
});
${interpret}`,
    'comparison-recipe': `import { ${route.functionName} } from 'jev-recipes/route';
const result = await ${route.functionName}({ request, routes, minConfidence }, { model });
console.log({ status: result.status, route: result.route, confidence: result.confidence });`,
  };
  let updated = original;
  for (const [marker, source] of Object.entries(snippets)) {
    const code = await format(source, { parser: 'babel', singleQuote: true, printWidth: 90 });
    updated = replaceSection(updated, marker, `\`\`\`js\n${code.trim()}\n\`\`\``);
  }
  const { status, route: selection, confidence } = route.result;
  return replaceSection(
    updated,
    'comparison-result',
    `\`\`\`json\n${JSON.stringify({ status, route: selection, confidence }, null, 2)}\n\`\`\``,
  );
}

function schemaTable(schema) {
  const required = new Set(schema.required ?? []);
  return (
    '| Field | Required | Shape |\n| --- | --- | --- |\n' +
    Object.entries(schema.properties ?? {})
      .map(
        ([name, value]) =>
          `| \`${name}\` | ${required.has(name) ? 'Yes' : 'No'} | ${cell(describeShape(value))} |`,
      )
      .join('\n') +
    '\n\nThis table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.'
  );
}

function describeShape(schema) {
  if (schema.enum) return schema.enum.map((value) => `\`${value}\``).join(', ');
  if (schema.anyOf) return schema.anyOf.map(describeShape).join(' or ');
  let shape = Array.isArray(schema.type) ? schema.type.join(' or ') : (schema.type ?? 'value');
  if (schema.type === 'array') shape = `${describeShape(schema.items ?? {})}[]`;
  if (schema.properties) shape = `{ ${Object.keys(schema.properties).join(', ')} }`;
  const rules = [];
  if (schema.minItems !== undefined) rules.push(`at least ${schema.minItems} items`);
  if (schema.maxItems !== undefined) rules.push(`at most ${schema.maxItems} items`);
  if (schema.minimum !== undefined) rules.push(`minimum ${schema.minimum}`);
  if (schema.maximum !== undefined) rules.push(`maximum ${schema.maximum}`);
  if (schema.default !== undefined) rules.push(`default ${JSON.stringify(schema.default)}`);
  return shape + (rules.length ? `; ${rules.join('; ')}` : '');
}

function cell(text) {
  return text.replaceAll('|', '\\|').replaceAll('\n', ' ');
}
