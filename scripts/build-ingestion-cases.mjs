import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export function extractBlocks(markdown) {
  const blocks = [];
  const lines = markdown.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^```/.test(line)) {
      const start = index;
      const content = [];
      while (++index < lines.length && !/^```/.test(lines[index])) content.push(lines[index]);
      if (content.length && index < lines.length)
        blocks.push({ role: 'code', text: content.join('\n'), line: start + 1 });
      continue;
    }
    const heading = line.match(/^#{1,6} +(.+)/);
    if (heading) {
      blocks.push({ role: 'heading', text: heading[1], line: index + 1 });
      continue;
    }
    if (!/^[A-Z][a-z]/.test(line) || /[|]/.test(line)) continue;
    const start = index;
    const content = [line];
    while (
      index + 1 < lines.length &&
      /^[\w`[(]/.test(lines[index + 1]) &&
      !/[|]/.test(lines[index + 1])
    )
      content.push(lines[++index]);
    const text = content.join(' ');
    if (text.length >= 100 && /[.!?:]$/.test(text))
      blocks.push({ role: 'body', text, line: start + 1 });
  }
  return blocks.filter((block) => block.text.length >= 8 && block.text.length <= 1200);
}

export function buildDocumentCases(document) {
  const blocks = extractBlocks(document.content);
  const split =
    Number.parseInt(createHash('sha256').update(document.name).digest('hex').slice(0, 8), 16) %
      3 ===
    0
      ? 'development'
      : 'held-out';
  const family = `node-v22.20.0-${document.name}`;
  const provenance = {
    method: 'public-dataset',
    source: `${document.url}; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license.`,
  };
  const roles = [];
  const boundaries = [];
  for (const role of ['heading', 'body', 'code']) {
    for (const block of blocks.filter((block) => block.role === role).slice(0, 3)) {
      const position = blocks.indexOf(block);
      const neighbors = {
        ...(blocks[position - 1] ? { before: blocks[position - 1].text } : {}),
        ...(blocks[position + 1] ? { after: blocks[position + 1].text } : {}),
      };
      roles.push({
        id: `${family}-role-${block.line}`,
        family,
        split,
        provenance,
        input: { text: block.text, ...neighbors },
        expected: { verdict: role },
        rationale: `Source line ${block.line} is a Markdown ${role}; heading and fence delimiters are removed.`,
      });
    }
  }
  for (const block of blocks.filter((block) => block.role === 'body').slice(0, 4)) {
    const words = block.text.split(' ');
    const midpoint = Math.floor(words.length / 2);
    boundaries.push({
      id: `${family}-continue-${block.line}`,
      family,
      split,
      provenance,
      input: { left: words.slice(0, midpoint).join(' '), right: words.slice(midpoint).join(' ') },
      expected: { verdict: 'continue' },
      rationale: `One source paragraph at line ${block.line} is hard-wrapped at its middle word; no content is rewritten.`,
    });
  }
  for (const [position, block] of blocks.entries()) {
    if (block.role !== 'heading' || blocks[position + 1]?.role !== 'body') continue;
    boundaries.push({
      id: `${family}-separate-${block.line}`,
      family,
      split,
      provenance,
      input: { left: block.text, right: blocks[position + 1].text },
      expected: { verdict: 'separate' },
      rationale: `Source heading at line ${block.line} and the following body paragraph are separate blocks.`,
    });
    if (boundaries.filter((entry) => entry.expected.verdict === 'separate').length === 4) break;
  }
  return { roles, boundaries };
}

async function main() {
  const manifest = JSON.parse(await readFile('evals/sources/node-v22.20.0/manifest.json', 'utf8'));
  const roles = [];
  const boundaries = [];
  for (const source of manifest.documents) {
    const content = gunzipSync(
      await readFile(`evals/sources/node-v22.20.0/${source.name}.gz`),
    ).toString('utf8');
    if (createHash('sha256').update(content).digest('hex') !== source.sha256)
      throw new Error(`Source hash changed: ${source.name}`);
    const cases = buildDocumentCases({ ...source, content });
    roles.push(...cases.roles);
    boundaries.push(...cases.boundaries);
  }
  for (const [id, cases] of [
    ['text-block-role', roles],
    ['paragraph-boundary', boundaries],
  ]) {
    await mkdir(`evals/${id}`, { recursive: true });
    await writeFile(
      `evals/${id}/cases.jsonl`,
      cases.map((entry) => JSON.stringify(entry)).join('\n') + '\n',
    );
    await writeFile(
      `evals/${id}/dataset.json`,
      JSON.stringify(
        {
          version: 1,
          recipe: id,
          cases: cases.length,
          development: cases.filter((entry) => entry.split === 'development').length,
          heldOut: cases.filter((entry) => entry.split === 'held-out').length,
          provenance:
            'Public Node.js v22.20.0 Markdown; markup-derived labels, not independently reviewed.',
          familySplit:
            'Hash source filename modulo 3; all excerpts and transformations from one document remain together.',
          limitations: [
            'Technical documentation only; does not represent arbitrary OCR or PDFs.',
            'Role data covers heading/body/code only; other roles remain unmeasured.',
            'Correlated excerpts require document-level uncertainty; acceptance sample requirements are not yet met.',
          ],
        },
        null,
        2,
      ) + '\n',
    );
    console.log(`${id}: ${cases.length} cases`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  await main();
