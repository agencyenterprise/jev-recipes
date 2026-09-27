import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectAdoptionSignals } from '../../scripts/adoption-snapshot.mjs';

function publicResponses(url) {
  if (url.includes('registry.npmjs'))
    return new Response(JSON.stringify({ name: 'jev-recipes', version: '0.8.2' }));
  if (url.includes('downloads'))
    return new Response(
      JSON.stringify({
        package: 'jev-recipes',
        downloads: 42,
        start: '2026-09-20',
        end: '2026-09-26',
      }),
    );
  if (url.includes('/contributors'))
    return new Response(
      JSON.stringify([
        { login: 'maintainer', type: 'User', contributions: 12 },
        { login: 'new-contributor', type: 'User', contributions: 1 },
        { login: 'automation[bot]', type: 'Bot', contributions: 100 },
      ]),
      { headers: { link: '<https://api.github.com/page2>; rel="next"' } },
    );
  return new Response(
    JSON.stringify({
      full_name: 'agencyenterprise/jev-recipes',
      stargazers_count: 10,
      forks_count: 2,
    }),
  );
}

test('public signals retain their periods and sample limits without counting bots as human contributors', async () => {
  const snapshot = await collectAdoptionSignals(async (url, options) => {
    assert.equal(options.headers.Authorization, undefined);
    return publicResponses(url);
  });
  assert.equal(snapshot.complete, true);
  assert.equal(snapshot.signals.weeklyDownloads, 42);
  assert.deepEqual(snapshot.signals.downloadPeriod, { start: '2026-09-20', end: '2026-09-26' });
  assert.equal(snapshot.signals.humanContributorsInSample, 2);
  assert.equal(snapshot.signals.humanContributorsWithMultipleCommitsInSample, 1);
  assert.equal(snapshot.sources.contributors.hasMore, true);
});

test('unavailable or malformed public data stays unknown rather than becoming zero adoption', async () => {
  const snapshot = await collectAdoptionSignals(async (url) => {
    if (url.includes('downloads')) return new Response('{}', { status: 429 });
    if (url.includes('/contributors')) return new Response(JSON.stringify({ unexpected: true }));
    return publicResponses(url);
  });
  assert.equal(snapshot.complete, false);
  assert.equal(snapshot.signals.weeklyDownloads, null);
  assert.equal(snapshot.signals.humanContributorsInSample, null);
  assert.equal(snapshot.sources.downloads.error, 'HTTP 429');
  assert.equal(snapshot.sources.contributors.error, 'Unexpected public API response shape');
  assert.equal(snapshot.signals.publishedVersion, '0.8.2');
});
