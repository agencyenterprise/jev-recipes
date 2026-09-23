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
    return (
      `## ${title}\n\n| Recipe | Function | Use when |\n| --- | --- | --- |\n` +
      matching
        .map(
          ({ id, functionName, metadata }) =>
            `| [\`${id}\`](${id}/README.md) | \`${functionName}\` | ${cell(metadata.useWhen)} |`,
        )
        .join('\n')
    );
  });
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
    files.set(path, updated);
  }
  return files;
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
