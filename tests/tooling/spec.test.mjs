import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  recipeKinds,
  renderRecipe,
  scaffoldFromSpec,
  starterSpec,
} from '../../scripts/new-recipe.mjs';

const spec = {
  id: 'spec-probe',
  kind: 'score',
  title: "Grade a reviewer's tone",
  description: 'How harsh is comment?',
  category: 'workflow',
  tags: ['probe', 'tone', 'review'],
  readme: { limits: ['First sentence.', 'Second sentence.'] },
  useWhen: 'Testing "quotes" and apostrophes.',
  related: [{ id: 'tone-check', reason: 'Caller-defined criteria.' }],
  limitations: ["It's only a probe."],
  inputs: { comment: 'required', context: 'optional' },
  instruction: "How harsh is comment's wording?",
  labelField: 'harshness',
  rubric: [
    { label: 'gentle', description: 'Kind.' },
    { label: 'blunt', description: 'Direct.' },
    { label: 'hostile', description: 'Insulting.' },
  ],
  demoProbabilities: [0.1, 0.8, 0.1],
  demoInput: { comment: 'Read the docs.', context: 'Open-source review.' },
};

test('every starter kind renders a valid spec', () => {
  for (const kind of recipeKinds) {
    const { files, test: testSource } = renderRecipe(starterSpec('sample-kind', kind));
    assert.ok(files.get('index.ts').includes('export async function sampleKind('));
    assert.ok(testSource.includes(`recipes/sample-kind/index.js`));
  }
});

test('a score spec renders exact files with computed demo arithmetic', () => {
  const { files, test: testSource } = renderRecipe(spec);
  const index = files.get('index.ts');
  assert.match(index, /evaluateScore\(state, .How harsh is comment\\?'s wording\?./);
  assert.match(index, /harshness: specProbeVerdictSchema\.options\[decision\.level\]/);
  assert.match(files.get('schema.ts'), /context: nonEmptyText\.optional\(\)/);
  const demo = JSON.parse(files.get('demo.json'));
  assert.deepEqual(demo.input, { ...spec.demoInput, minConfidence: 0.8 });
  assert.equal(demo.response.answers.score.score, 1);
  assert.equal(demo.response.answers.score.confidence, 0.8);
  assert.deepEqual(demo.response.answers.score.probabilities, { 0: 0.1, 1: 0.8, 2: 0.1 });
  assert.match(files.get('README.md'), /`context` is optional/);
  assert.match(files.get('metadata.ts'), /useWhen: 'Testing "quotes" and apostrophes\.'/);
  assert.ok(testSource.includes('testScore(specProbe, {"comment":"Read the docs."}'));
  assert.ok(testSource.includes('\'harshness\', ["context"]'));
});

test('array limits prose, zero-default choice labels, and review-level demo rejection', () => {
  const { files } = renderRecipe(spec);
  assert.match(files.get('README.md'), /First sentence\. Second sentence\./);
  const choice = renderRecipe({
    ...spec,
    kind: 'choice',
    criteria: { a: 'A.', b: 'B.', unclear: 'Unclear.' },
    demoProbabilities: { a: 0.9, unclear: 0.1 },
  });
  assert.deepEqual(
    JSON.parse(choice.files.get('demo.json')).response.answers.decision.probabilities,
    { a: 0.9, b: 0, unclear: 0.1 },
  );
  assert.throws(
    () => renderRecipe({ ...spec, demoProbabilities: [0.3, 0.5, 0.2] }),
    /status review/,
  );
  assert.throws(
    () =>
      renderRecipe({
        ...spec,
        kind: 'gate',
        verdicts: { yes: 'y', no: 'n' },
        criteria: { true: 'Y.', false: 'N.' },
        demoProbability: 0.6,
      }),
    /status review/,
  );
  assert.throws(() => renderRecipe({ ...spec, tags: ['one'] }));
});

test('a selection spec renders the candidate helper and maps demo ids to internal labels', () => {
  const selection = renderRecipe(starterSpec('pick-one', 'selection'));
  assert.match(selection.files.get('index.ts'), /selectCandidate\(state, state\.candidates,/);
  assert.match(selection.files.get('schema.ts'), /candidates: textItemsSchema/);
  const demo = JSON.parse(selection.files.get('demo.json'));
  assert.deepEqual(demo.response.answers.decision.probabilities, {
    candidate_0: 0.94,
    candidate_1: 0.03,
    none: 0.02,
    ambiguous: 0.01,
  });
  assert.equal(demo.response.answers.decision.choice, 'candidate_0');
  assert.match(selection.test, /testSelection\(pickOne, /);
  assert.throws(
    () =>
      renderRecipe({
        ...starterSpec('pick-one', 'selection'),
        demoProbabilities: { nope: 0.9, none: 0.1 },
      }),
    /not a candidate id/,
  );
  assert.throws(() =>
    renderRecipe({ ...starterSpec('pick-one', 'selection'), candidatesField: 'text' }),
  );
});

test('specs with wrong demo probabilities or unknown kinds are rejected', () => {
  assert.throws(() => renderRecipe({ ...spec, demoProbabilities: [0.5, 0.5, 0.5] }), /sum to/);
  assert.throws(
    () => renderRecipe({ ...spec, demoProbabilities: [1, 0] }),
    /one entry per rubric level/,
  );
  assert.throws(() => renderRecipe({ ...spec, kind: 'ranking' }));
  assert.throws(
    () => renderRecipe({ ...spec, inputs: { minConfidence: 'required' } }),
    /minConfidence/,
  );
  assert.throws(
    () =>
      renderRecipe({
        ...spec,
        kind: 'choice',
        criteria: { a: 'A.', b: 'B.', unclear: 'Unclear.' },
        demoProbabilities: { a: 0.9, b: 0.1, zzz: 0 },
      }),
    /unknown labels/,
  );
  assert.throws(
    () =>
      renderRecipe({
        ...spec,
        kind: 'choice',
        criteria: { a: 'A.', b: 'B.' },
        demoProbabilities: { a: 0.9, b: 0.1 },
      }),
    /reviewVerdict must be one of the criteria labels/,
  );
  assert.throws(() => starterSpec('x', 'ranking'), /Unknown recipe kind/);
});

test('scaffoldFromSpec writes the six files and refuses to overwrite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-spec-check-'));
  try {
    const written = await scaffoldFromSpec(root, spec);
    assert.equal(written.id, 'spec-probe');
    for (const name of ['index.ts', 'schema.ts', 'metadata.ts', 'demo.json', 'README.md'])
      assert.ok((await readFile(join(root, 'recipes/spec-probe', name), 'utf8')).length > 0);
    assert.match(
      await readFile(join(root, 'tests/recipe/spec-probe.test.ts'), 'utf8'),
      /testScore/,
    );
    await assert.rejects(scaffoldFromSpec(root, spec), /Already exists/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
