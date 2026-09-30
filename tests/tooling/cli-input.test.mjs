import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

// The consumer check copies this dependency-free test beside an installed archive.
const cliPath =
  process.env.JEV_CLI_TEST_PATH ??
  fileURLToPath(new URL('../../dist/cli/index.js', import.meta.url));

test('CLI run reads international text without changing it', async (t) => {
  const runRecipe = await createOfflineCli(t);
  const multilingualInput = {
    request: '¿Dónde está mi reembolso? 日本語 العربية 🌍 e\u0301 inside\ufefftext',
    routes: { 請求: 'Pagos y reembolsos', soporte: 'المساعدة التقنية' },
  };
  const json = JSON.stringify(multilingualInput);
  const encodedInputs = {
    'UTF-8 without a BOM': Buffer.from(json),
    'UTF-8 with a BOM': Buffer.from('\ufeff' + json),
    'UTF-16 little-endian with a BOM': Buffer.from('\ufeff' + json, 'utf16le'),
    'UTF-16 big-endian with a BOM': Buffer.from('\ufeff' + json, 'utf16le').swap16(),
  };

  for (const [encoding, inputBytes] of Object.entries(encodedInputs)) {
    for (const source of ['file', 'stdin']) {
      await t.test(`preserves ${encoding} from ${source}`, async () => {
        const execution = await runRecipe(source, inputBytes);

        assert.equal(execution.status, 0, execution.stderr);
        assert.equal(execution.stderr, '');
        assert.deepEqual(execution.providerRequest.state, { request: multilingualInput.request });
        for (const [routeName, description] of Object.entries(multilingualInput.routes)) {
          assert.equal(execution.providerRequest.questions.route.criteria[routeName], description);
        }
        const output = JSON.parse(execution.stdout);
        assert.equal(output.mode, 'live');
        assert.equal(output.result.route, '請求');
        assert.equal(output.result.model, 'offline-test');
      });
    }
  }
});

test('CLI run rejects invalid input before contacting the provider', async (t) => {
  const runRecipe = await createOfflineCli(t);
  const encodingError = /Input must be UTF-8 or UTF-16 with a byte-order mark/;
  const invalidInputs = [
    { name: 'malformed JSON', bytes: Buffer.from('\ufeff{"request":'), error: /JSON/ },
    {
      name: 'invalid UTF-8',
      bytes: Buffer.concat([Buffer.from('{"request":"'), Buffer.from([0xff]), Buffer.from('"}')]),
      error: encodingError,
    },
    { name: 'truncated UTF-16', bytes: Buffer.from([0xff, 0xfe, 0x7b]), error: encodingError },
    {
      name: 'an unpaired UTF-16 surrogate',
      bytes: Buffer.from('\ufeff{"request":"\ud800"}', 'utf16le'),
      error: encodingError,
    },
  ];

  for (const { name, bytes, error } of invalidInputs) {
    for (const source of ['file', 'stdin']) {
      await t.test(`rejects ${name} from ${source}`, async () => {
        const execution = await runRecipe(source, bytes);

        assert.equal(execution.status, 1, execution.stderr);
        assert.equal(execution.stdout, '');
        assert.match(execution.stderr, error);
        assert.equal(execution.providerRequest, null);
      });
    }
  }
});

async function createOfflineCli(t) {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'jev-cli-input-'));
  t.after(() => rm(temporaryDirectory, { recursive: true, force: true }));
  const preloadPath = join(temporaryDirectory, 'offline-provider.mjs');
  const providerRequestPath = join(temporaryDirectory, 'provider-request.json');
  const inputPath = join(temporaryDirectory, 'input.json');
  await writeFile(
    preloadPath,
    `import { writeFileSync } from 'node:fs';
globalThis.fetch = async (_url, options) => {
  writeFileSync(${JSON.stringify(providerRequestPath)}, options.body);
  return Response.json({
    model: 'offline-test',
    answers: { route: {
      type: 'choice', choice: '請求', confidence: 0.95,
      probabilities: { '請求': 0.95, soporte: 0.02, __review__: 0.03 },
    } },
    usage: { input_tokens: 0, output_tokens: 0 },
  });
};
`,
  );

  return async function runRecipe(source, inputBytes) {
    await rm(providerRequestPath, { force: true });
    if (source === 'file') await writeFile(inputPath, inputBytes);
    const execution = spawnSync(
      process.execPath,
      [
        '--import',
        pathToFileURL(preloadPath).href,
        cliPath,
        'run',
        'route',
        source === 'file' ? inputPath : '-',
      ],
      {
        env: { ...process.env, TYPESAFE_API_KEY: 'offline-test-key' },
        input: source === 'stdin' ? inputBytes : undefined,
        encoding: 'utf8',
        timeout: 10_000,
      },
    );
    assert.ifError(execution.error);
    const providerRequest = await readFile(providerRequestPath, 'utf8')
      .then(JSON.parse)
      .catch((error) => {
        if (error.code === 'ENOENT') return null;
        throw error;
      });
    return { ...execution, providerRequest };
  };
}
