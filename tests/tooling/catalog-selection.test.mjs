import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

for (const outcome of ['success', 'failure']) {
  for (const completionOrder of ['before', 'after']) {
    test(`an older ${outcome} finishing ${completionOrder} the current selection cannot replace it`, async () => {
      const { selectRecipe, inspector, requests } = await createSelectionScenario();
      const olderSelection = selectRecipe('route');
      const currentSelection = selectRecipe('verify');

      if (completionOrder === 'after') {
        requests.verify.resolve({ id: 'verify' });
        await currentSelection;
      }
      if (outcome === 'success') requests.route.resolve({ id: 'route' });
      else requests.route.reject(new Error('The older request failed.'));
      await olderSelection;

      assert.equal(inspector.textContent, completionOrder === 'after' ? 'verify' : '');
      assert.equal(inspector.busy, completionOrder === 'before');
      if (completionOrder === 'before') {
        requests.verify.resolve({ id: 'verify' });
        await currentSelection;
      }
      assert.equal(inspector.textContent, 'verify');
      assert.equal(inspector.busy, false);
    });
  }
}

test('the current selection still reports a failed request and clears its loading state', async () => {
  const { selectRecipe, inspector, requests } = await createSelectionScenario();
  const selection = selectRecipe('route');
  requests.route.reject(new Error('The current request failed.'));
  await selection;

  assert.equal(inspector.textContent, 'This recipe could not load. Select it again to retry.');
  assert.equal(inspector.busy, false);
});

async function createSelectionScenario() {
  const source = await readFile(new URL('../../site/app.js', import.meta.url), 'utf8');
  const parsed = ts.createSourceFile('app.js', source, ts.ScriptTarget.Latest, true);
  const selectRecipe = parsed.statements.find(
    (statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === 'selectRecipe',
  );
  assert.ok(selectRecipe, 'The catalog must define selectRecipe.');
  const requests = { route: Promise.withResolvers(), verify: Promise.withResolvers() };
  const inspector = {
    textContent: '',
    busy: false,
    setAttribute() {
      this.busy = true;
    },
    removeAttribute() {
      this.busy = false;
    },
  };
  const select = runInNewContext(`${selectRecipe.getText(parsed)}\nselectRecipe`, {
    selectionRequest: 0,
    selectedId: null,
    recipes: [{ id: 'route' }, { id: 'verify' }],
    inspector,
    renderResults() {},
    readDetails: (id) => requests[id].promise,
    renderInspector: (recipe) => {
      inspector.textContent = recipe.id;
    },
  });
  return { selectRecipe: select, inspector, requests };
}
