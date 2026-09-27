import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';

const count = z.number().int().nonnegative();
const sources = {
  release: {
    url: 'https://registry.npmjs.org/jev-recipes/latest',
    schema: z.object({ name: z.literal('jev-recipes'), version: z.string().min(1) }),
  },
  downloads: {
    url: 'https://api.npmjs.org/downloads/point/last-week/jev-recipes',
    schema: z.object({
      package: z.literal('jev-recipes'),
      downloads: count,
      start: z.string(),
      end: z.string(),
    }),
  },
  repository: {
    url: 'https://api.github.com/repos/agencyenterprise/jev-recipes',
    schema: z.object({
      full_name: z.literal('agencyenterprise/jev-recipes'),
      stargazers_count: count,
      forks_count: count,
    }),
  },
  contributors: {
    url: 'https://api.github.com/repos/agencyenterprise/jev-recipes/contributors?per_page=100',
    schema: z.array(z.object({ login: z.string(), type: z.string(), contributions: count })),
  },
};

export async function collectAdoptionSignals(fetch = globalThis.fetch) {
  const records = await Promise.all(
    Object.entries(sources).map(async ([name, source]) => {
      try {
        const response = await fetch(source.url, {
          headers: { Accept: 'application/json', 'User-Agent': 'jev-recipes-adoption-snapshot' },
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = source.schema.parse(await response.json());
        return [
          name,
          {
            url: source.url,
            fetchedAt: new Date().toISOString(),
            data,
            hasMore: /rel="next"/.test(response.headers.get('link') ?? ''),
          },
        ];
      } catch (error) {
        return [
          name,
          {
            url: source.url,
            fetchedAt: new Date().toISOString(),
            data: null,
            error:
              error instanceof z.ZodError ? 'Unexpected public API response shape' : error.message,
          },
        ];
      }
    }),
  );
  const collected = Object.fromEntries(records);
  const contributors = collected.contributors.data?.filter((person) => person.type === 'User');
  return {
    capturedAt: new Date().toISOString(),
    complete: records.every(([, record]) => record.data !== null),
    signals: {
      publishedVersion: collected.release.data?.version ?? null,
      weeklyDownloads: collected.downloads.data?.downloads ?? null,
      downloadPeriod: collected.downloads.data
        ? { start: collected.downloads.data.start, end: collected.downloads.data.end }
        : null,
      stars: collected.repository.data?.stargazers_count ?? null,
      forks: collected.repository.data?.forks_count ?? null,
      humanContributorsInSample: contributors?.length ?? null,
      humanContributorsWithMultipleCommitsInSample:
        contributors?.filter((person) => person.contributions >= 2).length ?? null,
    },
    limitations: [
      'Downloads count installations, including automation and reinstalls, not unique or retained users.',
      'Stars and forks measure attention, not verified package usage.',
      'Contributors are at most the first 100 GitHub contributor records. Multiple commits include maintainers and do not prove return visits or release-driven retention.',
      'Contributor data can be cached by GitHub. Check hasMore before treating the sample as complete.',
      'Independent integrations and dependent projects require separately checked source evidence; they are not inferred from these signals.',
      'A dated snapshot does not establish that a release caused any change.',
    ],
    sources: collected,
  };
}

async function main() {
  const { values } = parseArgs({ options: { out: { type: 'string' } } });
  if (!values.out)
    throw new Error('Usage: node scripts/adoption-snapshot.mjs --out <new-directory>');
  const directory = resolve(values.out);
  await mkdir(directory);
  const snapshot = await collectAdoptionSignals();
  await writeFile(join(directory, 'snapshot.json'), JSON.stringify(snapshot, null, 2) + '\n', {
    flag: 'wx',
  });
  console.log(
    JSON.stringify({ directory, complete: snapshot.complete, ...snapshot.signals }, null, 2),
  );
  if (!snapshot.complete) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  await main();
