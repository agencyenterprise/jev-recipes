import { mkdir, writeFile, access, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';
import { projectRoot, recipeIdPattern } from './lib/recipes.mjs';

export const recipeKinds = ['choice', 'score', 'gate'];

export async function scaffoldRecipe(root, id, kind = 'choice') {
  if (!recipeIdPattern.test(id ?? '') || id === 'catalog')
    throw new Error('Supply a new kebab-case recipe ID: make new RECIPE=my-recipe');
  if (!recipeKinds.includes(kind))
    throw new Error(`Unknown recipe kind "${kind}". Use one of: ${recipeKinds.join(', ')}.`);
  const functionName = id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
  const typeName = functionName[0].toUpperCase() + functionName.slice(1);
  const directory = join(root, 'recipes', id);
  const testPath = join(root, 'tests/recipe', `${id}.test.ts`);
  for (const path of [directory, testPath]) {
    try {
      await access(path);
      throw new Error(`Already exists: ${path}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const names = { id, functionName, typeName };
  const { files, test } = templates[kind](names);
  const source = files.get('index.ts');
  if (ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest).parseDiagnostics.length)
    throw new Error('The recipe ID must produce a valid TypeScript function name.');
  await mkdir(join(root, 'recipes'), { recursive: true });
  await mkdir(directory);
  try {
    for (const [name, content] of files)
      await writeFile(
        join(directory, name),
        await format(content, { filepath: name, singleQuote: true, printWidth: 100 }),
        { flag: 'wx' },
      );
    await mkdir(join(root, 'tests/recipe'), { recursive: true });
    await writeFile(
      testPath,
      await format(test, { filepath: testPath, singleQuote: true, printWidth: 100 }),
      { flag: 'wx' },
    );
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

function readme(id, result) {
  return `# ${id.replaceAll('-', ' ')}\n\n<!-- BEGIN GENERATED: usage -->\n<!-- END GENERATED: usage -->\n\n## Input\n\n<!-- BEGIN GENERATED: input -->\n<!-- END GENERATED: input -->\n\n## Result\n\n${result}\n\n## Limits\n\nDescribe the decision boundaries before contributing this recipe.\n`;
}

function metadata(id, description, useWhen, tags) {
  return `import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: '${id}', title: '${id.replaceAll('-', ' ')}',
  description: '${description}', category: 'workflow',
  tags: [${tags.map((tag) => `'${tag}'`).join(', ')}], useWhen: '${useWhen}',
  related: [], limitations: ['Only evaluates the supplied input.'],
} satisfies RecipeMetadata;
`;
}

function demo(input, answers) {
  return JSON.stringify({
    input,
    response: { model: 'demo-fixture', answers, usage: { input_tokens: 0, output_tokens: 0 } },
  });
}

const templates = {
  choice({ id, functionName, typeName }) {
    const files = new Map([
      [
        'index.ts',
        `import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${functionName}InputSchema, ${functionName}ResultSchema } from './schema.js';
import type { ${typeName}Input, ${typeName}Result } from './schema.js';

export async function ${functionName}(input: ${typeName}Input, options: RecipeOptions = {}): Promise<${typeName}Result> {
  const { minConfidence = 0.8, ...state } = ${functionName}InputSchema.parse(input);
  const decision = await evaluateChoice(state, 'Does text meet the supplied requirement?', {
    matched: 'The text meets the requirement.',
    unmatched: 'The text does not meet the requirement.',
    unclear: 'The supplied facts do not establish a decision.',
  }, options);
  return ${functionName}ResultSchema.parse({ ...decision, status: decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready' });
}
export { ${functionName}InputSchema, ${functionName}ResultSchema } from './schema.js';
export type { ${typeName}Input, ${typeName}Result } from './schema.js';
`,
      ],
      [
        'schema.ts',
        `import { z } from 'zod';
import { nonEmptyText, probability, decisionStatusSchema, resultMetadataSchema } from '../../src/schema.js';
const verdicts = z.enum(['matched', 'unmatched', 'unclear']);
export const ${functionName}InputSchema = z.object({ text: nonEmptyText, requirement: nonEmptyText, minConfidence: probability.optional() });
export const ${functionName}ResultSchema = resultMetadataSchema.extend({ verdict: verdicts, status: decisionStatusSchema, confidence: probability, probabilities: z.record(verdicts, probability) });
export type ${typeName}Input = z.infer<typeof ${functionName}InputSchema>;
export type ${typeName}Result = z.infer<typeof ${functionName}ResultSchema>;
`,
      ],
      [
        'metadata.ts',
        metadata(
          id,
          'Check text against a supplied requirement.',
          'You need to check text against an explicit requirement.',
          ['requirement'],
        ),
      ],
      [
        'demo.json',
        demo(
          { text: 'Please send the invoice.', requirement: 'The text requests an invoice.' },
          {
            decision: {
              type: 'choice',
              choice: 'matched',
              confidence: 0.9,
              probabilities: { matched: 0.9, unmatched: 0.05, unclear: 0.05 },
            },
          },
        ),
      ],
      [
        'README.md',
        readme(
          id,
          'The result is ready when confidence meets minConfidence and the verdict is clear. Otherwise it requires review.',
        ),
      ],
    ]);
    const test = `import { ${functionName} } from '../../recipes/${id}/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  ${functionName},
  { text: 'Please send the invoice.', requirement: 'Requests an invoice.' },
  ['matched', 'unmatched', 'unclear'],
);
`;
    return { files, test };
  },

  score({ id, functionName, typeName }) {
    const files = new Map([
      [
        'index.ts',
        `import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${functionName}InputSchema, ${functionName}ResultSchema, ${functionName}VerdictSchema } from './schema.js';
import type { ${typeName}Input, ${typeName}Result } from './schema.js';

export async function ${functionName}(input: ${typeName}Input, options: RecipeOptions = {}): Promise<${typeName}Result> {
  const { minConfidence = 0.8, ...state } = ${functionName}InputSchema.parse(input);
  const decision = await evaluateScore(state, 'How well does text meet the supplied requirement?', [
    'The text does not address the requirement.',
    'The text partly addresses the requirement with major gaps.',
    'The text fully addresses the requirement.',
  ], options);
  return ${functionName}ResultSchema.parse({
    ...decision,
    grade: ${functionName}VerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}
export { ${functionName}InputSchema, ${functionName}ResultSchema, ${functionName}VerdictSchema } from './schema.js';
export type { ${typeName}Input, ${typeName}Result, ${typeName}Verdict } from './schema.js';
`,
      ],
      [
        'schema.ts',
        `import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';
export const ${functionName}VerdictSchema = z.enum(['none', 'partial', 'full']);
export const ${functionName}InputSchema = z.object({ text: nonEmptyText, requirement: nonEmptyText, minConfidence: probability.optional() });
export const ${functionName}ResultSchema = scoreResultSchema.extend({ grade: ${functionName}VerdictSchema });
export type ${typeName}Verdict = z.infer<typeof ${functionName}VerdictSchema>;
export type ${typeName}Input = z.infer<typeof ${functionName}InputSchema>;
export type ${typeName}Result = z.infer<typeof ${functionName}ResultSchema>;
`,
      ],
      [
        'metadata.ts',
        metadata(
          id,
          'How well does text meet a supplied requirement, on a three-level rubric?',
          'You need a graded result rather than a single label.',
          ['requirement', 'rubric', 'score'],
        ),
      ],
      [
        'demo.json',
        demo(
          { text: 'Please send the invoice.', requirement: 'The text requests an invoice.' },
          {
            score: {
              type: 'score',
              score: 1.85,
              confidence: 0.9,
              probabilities: { 0: 0.05, 1: 0.05, 2: 0.9 },
            },
          },
        ),
      ],
      [
        'README.md',
        readme(
          id,
          'grade names the most likely rubric level, level is its index, and score is the expected value across the rubric. The result is ready when confidence meets minConfidence.',
        ),
      ],
    ]);
    const test = `import { ${functionName} } from '../../recipes/${id}/index.js';
import { testScore } from './helpers/score.js';

testScore(
  ${functionName},
  { text: 'Please send the invoice.', requirement: 'Requests an invoice.' },
  ['none', 'partial', 'full'],
  'grade',
);
`;
    return { files, test };
  },

  gate({ id, functionName, typeName }) {
    const files = new Map([
      [
        'index.ts',
        `import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${functionName}InputSchema, ${functionName}ResultSchema } from './schema.js';
import type { ${typeName}Input, ${typeName}Result } from './schema.js';

export async function ${functionName}(input: ${typeName}Input, options: RecipeOptions = {}): Promise<${typeName}Result> {
  const { minConfidence = 0.8, ...state } = ${functionName}InputSchema.parse(input);
  const decision = await evaluateGate(state, 'Does text meet the supplied requirement?', {
    true: 'The text meets the requirement.',
    false: 'The text does not meet the requirement.',
  }, options);
  return ${functionName}ResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'present' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}
export { ${functionName}InputSchema, ${functionName}ResultSchema, ${functionName}VerdictSchema } from './schema.js';
export type { ${typeName}Input, ${typeName}Result, ${typeName}Verdict } from './schema.js';
`,
      ],
      [
        'schema.ts',
        `import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';
export const ${functionName}VerdictSchema = z.enum(['present', 'absent']);
export const ${functionName}InputSchema = z.object({ text: nonEmptyText, requirement: nonEmptyText, minConfidence: probability.optional() });
export const ${functionName}ResultSchema = gateResultSchema.extend({ verdict: ${functionName}VerdictSchema });
export type ${typeName}Verdict = z.infer<typeof ${functionName}VerdictSchema>;
export type ${typeName}Input = z.infer<typeof ${functionName}InputSchema>;
export type ${typeName}Result = z.infer<typeof ${functionName}ResultSchema>;
`,
      ],
      [
        'metadata.ts',
        metadata(id, 'Does text meet a supplied requirement?', 'You need a yes/no gate on text.', [
          'requirement',
          'gate',
        ]),
      ],
      [
        'demo.json',
        demo(
          { text: 'Please send the invoice.', requirement: 'The text requests an invoice.' },
          { gate: { type: 'noul', noul: 0.93 } },
        ),
      ],
      [
        'README.md',
        readme(
          id,
          'verdict is present when the yes probability is at least 0.5 and absent otherwise. confidence is the probability of the chosen side. The result is ready when confidence meets minConfidence.',
        ),
      ],
    ]);
    const test = `import { ${functionName} } from '../../recipes/${id}/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  ${functionName},
  { text: 'Please send the invoice.', requirement: 'Requests an invoice.' },
  ['present', 'absent'],
);
`;
    return { files, test };
  },
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const id = process.argv[2] ?? process.env.RECIPE;
    const kind = process.argv[3] ?? process.env.KIND ?? 'choice';
    await scaffoldRecipe(projectRoot, id, kind);
    console.log(
      `Created recipes/${id}/ (${kind}) and tests/recipe/${id}.test.ts.\nReplace the starter decision, metadata, and fixture; add boundary tests. Then run make docs and make ci.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
