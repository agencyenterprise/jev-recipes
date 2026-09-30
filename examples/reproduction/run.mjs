import { readFile } from 'node:fs/promises';
import { route } from 'jev-recipes/route';

// This example only replays a saved response. An accidental fetch must fail.
globalThis.fetch = async () => {
  throw new Error('This reproduction is offline; network calls are disabled.');
};

const { version } = JSON.parse(
  await readFile(new URL(import.meta.resolve('jev-recipes/package.json')), 'utf8'),
);
const fixture = JSON.parse(await readFile(new URL('./fixture.json', import.meta.url), 'utf8'));
console.log(
  JSON.stringify({ package: 'jev-recipes', version, node: process.version, mode: 'fixture' }),
);

const result = await route(fixture.input, {
  client: { systemOne: async () => structuredClone(fixture.response) },
});
console.log(JSON.stringify({ result }, null, 2));
