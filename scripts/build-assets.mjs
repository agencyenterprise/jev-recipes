import { cp, readdir, rm } from 'node:fs/promises';

await cp('catalog/generated/details', 'dist/catalog/generated/details', { recursive: true });
for (const entry of await readdir('dist/recipes', { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  await cp(`recipes/${entry.name}/demo.json`, `dist/recipes/${entry.name}/demo.json`);
  for (const extension of ['js', 'd.ts']) {
    await rm(`dist/recipes/${entry.name}/metadata.${extension}`, { force: true });
  }
}
