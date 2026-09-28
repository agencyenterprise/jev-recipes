import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { evaluate } from '../../dist/evaluation/index.js';
import { auditEvidence } from '../../scripts/lib/evidence-audit.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

test('offline evidence audit distinguishes damaged archives, stale recipes and unverifiable legacy summaries', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-audit-'));
  const archivesDirectory = join(root, 'archives');
  const reportsDirectory = join(root, 'reports');
  try {
    await mkdir(reportsDirectory);
    const run = await evaluate(
      'route',
      [
        {
          id: 'invoice',
          input: { request: 'Invoice', routes: { billing: 'Invoices' } },
          expected: { suggestedRoute: 'billing' },
          rationale: 'Authored regression fixture.',
        },
      ],
      {
        mode: 'fixture',
        out: join(archivesDirectory, 'run'),
        client: { systemOne: fixture({ route: 'billing' }) },
      },
    );
    const archivePath = join(archivesDirectory, 'run', 'run.json');
    const reportPath = join(reportsDirectory, 'route.json');
    await writeFile(reportPath, JSON.stringify(run.report));
    const options = { archivesDirectory, reportsDirectory };
    const clean = await auditEvidence(options);
    assert.deepEqual(clean.errors, []);
    assert.equal(clean.summary.replayed, 1);
    const original = await readFile(archivePath, 'utf8');
    const stale = structuredClone(run);
    stale.recipeFingerprint = stale.report.evidence.recipeFingerprint = 'older-implementation';
    await writeFile(archivePath, JSON.stringify(stale));
    await writeFile(reportPath, JSON.stringify(stale.report));
    const older = await auditEvidence(options);
    assert.deepEqual(older.errors, []);
    assert.equal(older.summary.stale, 1);
    assert.equal(older.summary.replayed, 0);
    await writeFile(archivePath, original);
    await writeFile(reportPath, JSON.stringify({ recipe: 'route', cases: 1, accuracy: 1 }));
    const legacy = await auditEvidence(options);
    assert.equal(legacy.summary.historicalReports, 1);
    assert.equal(legacy.reports[0].kind, 'unknown');
    await writeFile(reportPath, JSON.stringify({ ...run.report, correct: 9 }));
    assert.match((await auditEvidence(options)).errors[0].message, /correct disagrees/);
    await writeFile(reportPath, JSON.stringify(run.report));
    const damaged = structuredClone(run);
    delete damaged.rows[0].exchanges[0].response;
    await writeFile(archivePath, JSON.stringify(damaged));
    assert.ok(
      (await auditEvidence(options)).errors.some((error) =>
        /exactly one response or error/.test(error.message),
      ),
    );
    await writeFile(archivePath, original);
    await auditEvidence(options);
    assert.equal(
      await readFile(archivePath, 'utf8'),
      original,
      'Audit never rewrites retained archives',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
