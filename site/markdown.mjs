import { Marked } from 'marked';
import { siteDocs } from '../scripts/lib/docs.mjs';
import { source } from './pages.mjs';

const repositoryFile = `${source}/blob/main/`;
const repositoryRaw = 'https://raw.githubusercontent.com/agencyenterprise/jev-recipes/main/';

export function resolveLink(href, sourcePath, { origin = '', image = false } = {}) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) return href;
  const resolved = new URL(href, repositoryFile + sourcePath);
  const repositoryPath = resolved.pathname.slice(new URL(repositoryFile).pathname.length);
  const sitePath = sitePathFor(repositoryPath);
  if (sitePath) return origin + sitePath + resolved.hash;
  if (image) return repositoryRaw + repositoryPath;
  return resolved.href;
}

function sitePathFor(repositoryPath) {
  const recipe = repositoryPath.match(/^recipes\/([a-z0-9-]+)\/README\.md$/);
  if (recipe) return `/recipes/${recipe[1]}/`;
  const doc = repositoryPath.match(/^docs\/([a-z0-9-]+)\.md$/);
  if (doc && siteDocs.includes(doc[1])) return `/docs/${doc[1]}/`;
  return null;
}

export function renderMarkdown(markdown, sourcePath) {
  const marked = new Marked({
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image')
        token.href = resolveLink(token.href, sourcePath, { image: token.type === 'image' });
    },
  });
  return marked.parse(markdown);
}

export function absoluteMarkdown(markdown, sourcePath, origin) {
  return markdown.replace(
    /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
    (_, bang, text, href, title) =>
      `${bang}[${text}](${resolveLink(href, sourcePath, { origin, image: bang === '!' })}${title})`,
  );
}

export function guideSections(readme) {
  const handwritten = readme
    .replace(/<!-- BEGIN GENERATED: [\w-]+ -->[\s\S]*?<!-- END GENERATED: [\w-]+ -->/g, '')
    .replace(/^# .*\n/, '');
  return handwritten
    .split(/^(?=## )/m)
    .map((section) => section.trim())
    .filter((section) => section.replace(/^## .*$/m, '').trim())
    .join('\n\n');
}

export function markdownTitle(markdown) {
  return markdown.match(/^# (.+)$/m)?.[1].trim() ?? '';
}
