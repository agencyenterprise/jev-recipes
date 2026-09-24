import { parseArgs } from 'node:util';
import {
  comparableDecision,
  deepEqual,
  fixtureClient,
  hasReviewAnywhere,
  listRecipeIds,
  loadRecipe,
  mapWithConcurrencyLimit,
  pick,
  requireApiKey,
} from './lib/harness.mjs';

const { values } = parseArgs({
  options: {
    recipe: { type: 'string', multiple: true },
    limit: { type: 'string' },
    concurrency: { type: 'string', default: '4' },
    dry: { type: 'boolean', default: false },
  },
});

if (!values.dry) requireApiKey();
const allIds = values.recipe?.length ? values.recipe : await listRecipeIds();
const ids = values.limit ? allIds.slice(0, Number(values.limit)) : allIds;

const outcomes = await mapWithConcurrencyLimit(ids, Number(values.concurrency), smokeTest);
report(outcomes);

async function smokeTest(id) {
  const { run, fixture } = await loadRecipe(id);
  const expected = await run(fixture.input, { client: fixtureClient(fixture.response) });
  try {
    const live = values.dry
      ? await run(fixture.input, { client: fixtureClient(fixture.response) })
      : await run(fixture.input);
    return { id, ...classify(expected, live) };
  } catch (error) {
    return { id, outcome: 'error', detail: error.message };
  }
}

function classify(expectedResult, liveResult) {
  const expected = comparableDecision(expectedResult);
  const live = comparableDecision(liveResult);
  if (deepEqual(live, expected)) {
    if (liveResult.status === expectedResult.status) return { outcome: 'pass' };
    return {
      outcome: 'deferred',
      detail: `verdict matches but live status is ${liveResult.status}`,
    };
  }
  const liveNonNull = Object.fromEntries(
    Object.entries(live).filter(([, value]) => value !== null),
  );
  if (
    liveResult.status === 'review' &&
    deepEqual(liveNonNull, pick(expected, Object.keys(liveNonNull)))
  ) {
    return { outcome: 'deferred', detail: 'verdict matches but the live call deferred to review' };
  }
  if (hasReviewAnywhere(liveResult)) {
    return {
      outcome: 'deferred',
      detail:
        `verdict differs but the live call flagged review; ` +
        `expected ${JSON.stringify(expected)} but got ${JSON.stringify(live)}`,
    };
  }
  return {
    outcome: 'fail',
    detail: `expected ${JSON.stringify(expected)} but got ${JSON.stringify(live)}`,
  };
}

function report(results) {
  const counts = { pass: 0, deferred: 0, fail: 0, error: 0 };
  for (const result of results) {
    counts[result.outcome] += 1;
    if (result.outcome !== 'pass')
      console.log(`${result.outcome.toUpperCase()} ${result.id}: ${result.detail}`);
  }
  console.log(
    `Smoke evals: ${counts.pass} passed, ${counts.deferred} deferred, ` +
      `${counts.fail} failed, ${counts.error} errored (${results.length} recipes).`,
  );
  if (counts.fail + counts.error > 0) process.exitCode = 1;
}
