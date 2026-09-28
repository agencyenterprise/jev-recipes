import { writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { auditEvidence } from './lib/evidence-audit.mjs';

const { values } = parseArgs({ options: { out: { type: 'string' } } });
globalThis.fetch = () => {
  throw new Error('Evidence audit must stay offline.');
};
const result = await auditEvidence({
  archivesDirectory: 'evals/evidence',
  reportsDirectory: 'evals/results',
});
if (values.out) await writeFile(values.out, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(result.summary, null, 2));
for (const error of result.errors) console.error(`${error.path}: ${error.message}`);
if (result.summary.historicalArchives)
  console.log(
    'Historical files are retained without migration, validation, or replay by the current evaluator.',
  );
if (result.errors.length) process.exitCode = 1;
