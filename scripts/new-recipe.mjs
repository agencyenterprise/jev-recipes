import { mkdir, writeFile, access, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';
import { projectRoot, recipeIdPattern } from './lib/recipes.mjs';

export async function scaffoldRecipe(root, id) {
  if (!recipeIdPattern.test(id ?? '') || id === 'catalog')
    throw new Error('Supply a new kebab-case recipe ID: make new RECIPE=my-recipe');
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
  const source = `import { evaluateChoice } from '../../src/decisions.js';
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
`;
  if (ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest).parseDiagnostics.length)
    throw new Error('The recipe ID must produce a valid TypeScript function name.');
  const files = new Map([
    ['index.ts', source],
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
      `import type { RecipeMetadata } from '../../src/schema.js';
export const metadata = {
  id: '${id}', title: '${id.replaceAll('-', ' ')}',
  description: 'Check text against a supplied requirement.', category: 'workflow',
  tags: ['requirement'], useWhen: 'You need to check text against an explicit requirement.',
  related: [], limitations: ['Only evaluates the supplied text and requirement.'],
} satisfies RecipeMetadata;
`,
    ],
    [
      'demo.json',
      JSON.stringify({
        input: { text: 'Please send the invoice.', requirement: 'The text requests an invoice.' },
        response: {
          model: 'demo-fixture',
          answers: {
            decision: {
              type: 'choice',
              choice: 'matched',
              confidence: 0.9,
              probabilities: { matched: 0.9, unmatched: 0.05, unclear: 0.05 },
            },
          },
          usage: { input_tokens: 0, output_tokens: 0 },
        },
      }),
    ],
    [
      'README.md',
      `# ${id.replaceAll('-', ' ')}\n\n<!-- BEGIN GENERATED: usage -->\n<!-- END GENERATED: usage -->\n\n## Input\n\n<!-- BEGIN GENERATED: input -->\n<!-- END GENERATED: input -->\n\n## Result\n\nThe result is ready when confidence meets minConfidence and the verdict is clear. Otherwise it requires review.\n\n## Limits\n\nDescribe the decision boundaries before contributing this recipe.\n`,
    ],
  ]);
  const test = `import { describe, expect, it } from 'vitest';
import { ${functionName} } from '../../recipes/${id}/index.js';
import { createJevClient, choiceAnswer } from './helpers/jev.js';

describe('${id}', () => {
  it('returns a supplied decision without a live call', async () => {
    const client = createJevClient({ decision: choiceAnswer(['matched', 'unmatched', 'unclear'], 'matched', 0.9) });
    const result = await ${functionName}({ text: 'Please send the invoice.', requirement: 'Requests an invoice.' }, { client });
    expect(result.status).toBe('ready');
    expect(result.verdict).toBe('matched');
    expect(client.systemOne).toHaveBeenCalledOnce();
  });
});
`;
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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const id = process.argv[2] ?? process.env.RECIPE;
    await scaffoldRecipe(projectRoot, id);
    console.log(
      `Created recipes/${id}/ and tests/recipe/${id}.test.ts.\nReplace the starter decision, metadata, and fixture; add boundary tests. Then run make docs and make ci.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
