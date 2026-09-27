import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { projectRoot } from '../../scripts/lib/recipes.mjs';

const execute = promisify(execFile);

test('a normal eval saves the report and replaces the unavailable threshold message', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    const output = await evaluate();
    const report = JSON.parse(await readFile(join(root, 'evals/results/route.json'), 'utf8'));
    const guide = await readFile(join(root, 'recipes/route/README.md'), 'utf8');
    assert.equal(report.thresholdEvaluation, 'recipe-replay');
    assert.equal(report.thresholds.find((row) => row.minConfidence === 0.8).deferRate, 0.12);
    assert.match(guide, /\| 0\.8\s*\| 12%\s*\| 100%\s*\|/);
    assert.doesNotMatch(guide, /withdrawn|not available for this saved run/);
    assert.match(output, /Snapshot written to evals\/results\/route.json/);
    assert.match(output, /Guide updated: recipes\/route\/README.md/);
  });
});

test('--write continues to save results and also refreshes the guide', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route', '--write');
    const guide = await readFile(join(root, 'recipes/route/README.md'), 'utf8');
    assert.match(guide, /\| 0\.8\s*\| 12%\s*\| 100%\s*\|/);
  });
});

test('--check and --no-write leave both the snapshot and guide unchanged', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    const paths = ['evals/results/route.json', 'recipes/route/README.md'];
    const originals = await Promise.all(paths.map((path) => readFile(join(root, path), 'utf8')));
    for (const flag of ['--check', '--no-write']) {
      await evaluate('route', flag);
      for (const [index, path] of paths.entries())
        assert.equal(
          await readFile(join(root, path), 'utf8'),
          originals[index],
          flag + ': ' + path,
        );
    }
  });
});

test('--check rejects a held-out snapshot when evaluating development cases', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    const path = join(root, 'evals/results/route.json');
    const original = await readFile(path, 'utf8');
    await assert.rejects(evaluate('route', '--check'), /different dataset or split/);
    assert.equal(await readFile(path, 'utf8'), original);
  });
});

async function withEvaluationProject(check) {
  const root = await mkdtemp(join(tmpdir(), 'jev-eval-cli-'));
  try {
    await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
    await symlink(join(projectRoot, 'node_modules'), join(root, 'node_modules'), 'dir');
    await symlink(join(projectRoot, 'dist'), join(root, 'dist'), 'dir');
    for (const path of [
      'evals/run.mjs',
      'evals/lib',
      'evals/route',
      'evals/results/route.json',
      'recipes/route/README.md',
      'recipes/route/demo.json',
      'scripts/lib/docs.mjs',
      'scripts/lib/generate.mjs',
    ]) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await cp(join(projectRoot, path), join(root, path), { recursive: true });
    }
    const casesPath = join(root, 'evals/route/cases.jsonl');
    const originalCases = (await readFile(casesPath, 'utf8'))
      .trim()
      .split('\n')
      .map(JSON.parse)
      .filter((entry) => !entry.id.startsWith('featured-'));
    await writeFile(
      casesPath,
      originalCases.map((entry) => JSON.stringify(entry)).join('\n') + '\n',
    );
    const reportPath = join(root, 'evals/results/route.json');
    const previousReport = JSON.parse(await readFile(reportPath, 'utf8'));
    await writeFile(
      reportPath,
      JSON.stringify({
        ...previousReport,
        thresholdEvaluation: 'unavailable',
        thresholds: [],
        suggestedMinConfidence: null,
      }),
    );
    const guidePath = join(root, 'recipes/route/README.md');
    const previousGuide = await readFile(guidePath, 'utf8');
    await writeFile(
      guidePath,
      previousGuide.replace(
        /<!-- BEGIN GENERATED: accuracy -->[\s\S]*?<!-- END GENERATED: accuracy -->/,
        '<!-- BEGIN GENERATED: accuracy -->\n\nConfidence-threshold results are not available for this saved run.\n\n<!-- END GENERATED: accuracy -->',
      ),
    );
    const fixture = join(root, 'provider.mjs');
    await writeFile(
      fixture,
      `
import { readFile } from 'node:fs/promises';
import { TypeSafeClient } from '@typesafe-ai/sdk';
const cases = (await readFile(new URL('./evals/route/cases.jsonl', import.meta.url), 'utf8')).trim().split('\\n').map(JSON.parse);
const expected = new Map(cases.map(entry => [entry.input.request, entry.expected.suggestedRoute]));
TypeSafeClient.prototype.systemOne = async request => {
  const choice = expected.get(request.state.request) ?? '__review__';
  return {
    model: 'offline-cli-test', usage: { input_tokens: 0, output_tokens: 0 },
    answers: { route: { type: 'choice', choice, confidence: 1,
      probabilities: Object.fromEntries(Object.keys(request.questions.route.criteria).map(key => [key, key === choice ? 1 : 0])),
    } },
  };
};
globalThis.fetch = () => { throw new Error('Evaluation CLI tests must stay offline'); };
`,
    );
    await check({
      root,
      evaluate: async (...args) => {
        const { stdout } = await execute(
          process.execPath,
          ['--import', fixture, join(root, 'evals/run.mjs'), ...args],
          {
            cwd: root,
            env: { ...process.env, TYPESAFE_API_KEY: 'offline-cli-test' },
            encoding: 'utf8',
          },
        );
        return stdout;
      },
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
