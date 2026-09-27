import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { diffHazardsInputSchema, diffHazardsResultSchema } from './schema.js';
import type { DiffHazardsInput, DiffHazardsResult } from './schema.js';

export async function diffHazards(
  input: DiffHazardsInput,
  options: RecipeOptions = {},
): Promise<DiffHazardsResult> {
  const { minConfidence = 0.8, ...state } = diffHazardsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      secretLeak: {
        instruction:
          'Does diff add a credential, API key, token, password, private key, or connection string containing a secret? Placeholders such as YOUR_KEY_HERE, environment variable references, and clearly fake example values do not count.',
        criteria: {
          true: 'The diff adds what appears to be a real secret value.',
          false: 'The diff adds no secret value, or only placeholders and references.',
        },
      },
      destructiveCommand: {
        instruction:
          'Does diff add a command or statement that deletes, drops, truncates, overwrites, or force-pushes data or history, such as rm -rf, DROP TABLE, TRUNCATE, git push --force, or a migration that removes columns or rows?',
        criteria: {
          true: 'The diff adds a destructive command or data-removing statement.',
          false: 'The diff adds no destructive command.',
        },
      },
      debugLeftover: {
        instruction:
          'Does diff add debugging artifacts that should not ship, such as print or console.log statements used for tracing, debugger statements, commented-out code blocks, hard-coded test values, or notes like TODO remove or HACK?',
        criteria: {
          true: 'The diff adds debugging or scaffolding leftovers.',
          false: 'The diff adds no debugging leftovers, or only intentional logging.',
        },
      },
      testsWeakened: {
        instruction:
          'Does diff remove or weaken tests, for example by deleting test cases, skipping or disabling tests, removing assertions, loosening expected values, or adding broad exception catches inside tests?',
        criteria: {
          true: 'The diff removes, skips, or weakens tests.',
          false: 'The diff leaves tests as strong as before or strengthens them.',
        },
      },
      dependencyChange: {
        instruction:
          'Does diff add, remove, or change the version of a third-party dependency, for example in package.json, requirements.txt, go.mod, Cargo.toml, a lockfile, or an import of a package that is not already used?',
        criteria: {
          true: "The diff changes the project's third-party dependencies.",
          false: 'The diff does not change dependencies.',
        },
      },
    },
    options,
  );
  return diffHazardsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  diffHazardsInputSchema,
  diffHazardsResultSchema,
  diffHazardsLabelSchema,
} from './schema.js';
export type { DiffHazardsInput, DiffHazardsResult, DiffHazardsLabel } from './schema.js';
