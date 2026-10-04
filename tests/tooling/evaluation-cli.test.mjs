import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { projectRoot } from '../../scripts/lib/recipes.mjs';
import { auditEvidence } from '../../scripts/lib/evidence-audit.mjs';
import { readRun } from '../../dist/evaluation/index.js';

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
    assert.deepEqual(
      JSON.parse(await readFile(join(root, 'evals/baselines/route.json'), 'utf8')),
      report,
    );
    const audit = await auditEvidence({
      archivesDirectory: join(root, 'evals/evidence'),
      reportsDirectory: join(root, 'evals/results'),
    });
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.summary.replayed, 1);
    const archive = join(root, 'evals/evidence/route', `development-${report.evidence.runId}`);
    assert.deepEqual(JSON.parse(JSON.stringify((await readRun(archive)).report)), report);
    const original = await readFile(join(archive, 'run.json.gz'));
    await evaluate('route');
    assert.deepEqual(await readFile(join(archive, 'run.json.gz')), original);
  });
});

test('--write continues to save results and also refreshes the guide', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route', '--write');
    const guide = await readFile(join(root, 'recipes/route/README.md'), 'utf8');
    assert.match(guide, /\| 0\.8\s*\| 12%\s*\| 100%\s*\|/);
  });
});

test('an archive write failure leaves the report, baseline and guide unchanged', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    const paths = ['evals/results/route.json', 'recipes/route/README.md'];
    const originals = await Promise.all(paths.map((path) => readFile(join(root, path), 'utf8')));
    await writeFile(join(root, 'evals/evidence'), 'Block archive creation.');
    await assert.rejects(evaluate('route'), /ENOTDIR/);
    for (const [index, path] of paths.entries())
      assert.equal(await readFile(join(root, path), 'utf8'), originals[index]);
    await assert.rejects(readFile(join(root, 'evals/baselines/route.json')), { code: 'ENOENT' });
  });
});

test('--check and --no-write leave both the snapshot and guide unchanged', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    const paths = [
      'evals/results/route.json',
      'evals/baselines/route.json',
      'recipes/route/README.md',
    ];
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
    await assert.rejects(readFile(join(root, 'provider-calls.jsonl')), { code: 'ENOENT' });
  });
});

test('featured checks use development baselines while preserving held-out reports', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    const reportPath = join(root, 'evals/results/route.json');
    const heldOut = await readFile(reportPath, 'utf8');
    await evaluate('route');
    await writeFile(reportPath, heldOut);
    await writeFile(join(root, 'evals/featured.json'), JSON.stringify({ featured: ['route'] }));
    await writeFile(join(root, 'provider-calls.jsonl'), '');
    const output = await evaluate('--featured', '--check');
    assert.doesNotMatch(output, /REGRESSION/);
    assert.equal(await readFile(reportPath, 'utf8'), heldOut);
    const calls = (await readFile(join(root, 'provider-calls.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .map(JSON.parse);
    assert.equal(calls.length, 50);
    assert.ok(calls.every((request) => request.model === 'offline-cli-test'));
  });
});

test('all baselines are checked before the first recipe spends quota', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    await cp(join(projectRoot, 'evals/model-route'), join(root, 'evals/model-route'), {
      recursive: true,
    });
    await writeFile(join(root, 'provider-calls.jsonl'), '');
    await assert.rejects(evaluate('route', 'model-route', '--check'), /Cannot compare model-route/);
    assert.equal(await readFile(join(root, 'provider-calls.jsonl'), 'utf8'), '');
  });
});

test('a changed scoring revision rejects a baseline before any provider call', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    const path = join(root, 'evals/baselines/route.json');
    const report = JSON.parse(await readFile(path, 'utf8'));
    delete report.evidence.scoringRevision;
    await writeFile(path, JSON.stringify(report));
    await writeFile(join(root, 'provider-calls.jsonl'), '');
    await assert.rejects(evaluate('route', '--check'), /different scoring revision/);
    assert.equal(await readFile(join(root, 'provider-calls.jsonl'), 'utf8'), '');
  });
});

test('a run in which every case fails retains its responses but saves nothing', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    const paths = [
      'evals/results/route.json',
      'evals/baselines/route.json',
      'recipes/route/README.md',
    ];
    const originals = await Promise.all(paths.map((path) => readFile(join(root, path), 'utf8')));
    await writeFile(join(root, 'provider-failures.json'), JSON.stringify('all'));
    await assert.rejects(evaluate('route'), /NOT SAVED route: every case failed/);
    for (const [index, path] of paths.entries())
      assert.equal(await readFile(join(root, path), 'utf8'), originals[index], path);
    assert.equal((await readdir(join(root, 'evals/evidence/route'))).length, 1);
    assert.equal((await readdir(join(root, 'evals/runs'))).length, 2);
  });
});

test('partial provider failures are saved only with --allow-failures', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    const paths = ['evals/results/route.json', 'recipes/route/README.md'];
    const originals = await Promise.all(paths.map((path) => readFile(join(root, path), 'utf8')));
    const cases = (await readFile(join(root, 'evals/route/cases.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .map(JSON.parse);
    await writeFile(join(root, 'provider-failures.json'), JSON.stringify([cases[0].input.request]));
    await assert.rejects(
      evaluate('route'),
      new RegExp(`NOT SAVED route: 1 of ${cases.length} cases failed`),
    );
    for (const [index, path] of paths.entries())
      assert.equal(await readFile(join(root, path), 'utf8'), originals[index], path);
    const output = await evaluate('route', '--allow-failures');
    assert.match(output, /Snapshot written to evals\/results\/route.json/);
    const report = JSON.parse(await readFile(join(root, 'evals/results/route.json'), 'utf8'));
    assert.equal(report.failed, 1);
  });
});

test('a development run keeps a held-out summary unless asked to replace it', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    const reportPath = join(root, 'evals/results/route.json');
    const guidePath = join(root, 'recipes/route/README.md');
    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    report.evidence.split = 'held-out';
    report.acceptance = { met: true, label: 'Measured on these synthetic cases' };
    const heldOut = JSON.stringify(report);
    await writeFile(reportPath, heldOut);
    const guide = await readFile(guidePath, 'utf8');
    const output = await evaluate('route');
    assert.match(output, /Kept the held-out summary in evals\/results\/route.json/);
    assert.equal(await readFile(reportPath, 'utf8'), heldOut);
    assert.equal(await readFile(guidePath, 'utf8'), guide);
    const baseline = JSON.parse(await readFile(join(root, 'evals/baselines/route.json'), 'utf8'));
    assert.equal(baseline.evidence.split, 'development');
    await evaluate('route', '--replace-held-out');
    const replaced = JSON.parse(await readFile(reportPath, 'utf8'));
    assert.equal(replaced.evidence.split, 'development');
    assert.equal(replaced.acceptance, undefined);
    assert.notEqual(await readFile(guidePath, 'utf8'), guide);
  });
});

test('a real accuracy drop fails the development regression check', async () => {
  await withEvaluationProject(async ({ root, evaluate }) => {
    await evaluate('route');
    await writeFile(join(root, 'provider-choice.json'), JSON.stringify('__review__'));
    await assert.rejects(
      evaluate('route', '--check'),
      /REGRESSION route: accuracy fell from 1 to 0.12/,
    );
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
      'scripts/lib/package-exports.mjs',
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
import { appendFile, readFile } from 'node:fs/promises';
import { TypeSafeClient } from '@typesafe-ai/sdk';
const cases = (await readFile(new URL('./evals/route/cases.jsonl', import.meta.url), 'utf8')).trim().split('\\n').map(JSON.parse);
const expected = new Map(cases.map(entry => [entry.input.request, entry.expected.suggestedRoute]));
const readSetting = name => readFile(new URL(name, import.meta.url), 'utf8').then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
const forcedChoice = await readSetting('./provider-choice.json');
const failures = await readSetting('./provider-failures.json');
TypeSafeClient.prototype.systemOne = async request => {
  await appendFile(new URL('./provider-calls.jsonl', import.meta.url), JSON.stringify(request) + '\\n');
  if (failures === 'all' || failures?.includes(request.state.request)) throw new Error('Simulated provider outage.');
  const choice = forcedChoice ?? expected.get(request.state.request) ?? '__review__';
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
