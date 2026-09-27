import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { extractBlocks, buildDocumentCases } from '../../scripts/build-ingestion-cases.mjs';
import { validateCases, loadEvaluationRecipe } from '../../dist/evaluation/dataset.js';

test('source labels preserve fenced code and distinguish source paragraphs from headings', () => {
  const content =
    '# Overview\n\nThis is a sufficiently long paragraph explaining how a caller should preserve the original document text before making any formatting changes.\n\n```js\nconst value = 1;\n```\n';
  assert.deepEqual(
    extractBlocks(content).map((block) => block.role),
    ['heading', 'body', 'code'],
  );
  const cases = buildDocumentCases({
    name: 'sample.md',
    url: 'https://example.org/sample.md',
    content,
  });
  assert.deepEqual(
    cases.roles.map((entry) => entry.expected.verdict),
    ['heading', 'body', 'code'],
  );
  const join = cases.boundaries.find((entry) => entry.expected.verdict === 'continue');
  assert.equal(join.input.left + ' ' + join.input.right, extractBlocks(content)[1].text);
  assert.equal(new Set([...cases.roles, ...cases.boundaries].map((entry) => entry.split)).size, 1);
});

test('ingestion datasets keep source documents and transformations in one split with explicit provenance', async () => {
  const documents = new Map();
  for (const id of ['text-block-role', 'paragraph-boundary']) {
    const values = (await readFile(`evals/${id}/cases.jsonl`, 'utf8'))
      .trim()
      .split('\n')
      .map(JSON.parse);
    const cases = validateCases(await loadEvaluationRecipe(id), values);
    for (const entry of cases) {
      if (documents.has(entry.family)) assert.equal(documents.get(entry.family), entry.split);
      documents.set(entry.family, entry.split);
      assert.equal(entry.provenance.method, 'public-dataset');
      assert.match(entry.provenance.source, /no independent human review/);
    }
    assert.ok(cases.some((entry) => entry.split === 'held-out'));
    assert.ok(cases.some((entry) => entry.split === 'development'));
  }
});
