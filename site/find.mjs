import { rerank } from '../dist/recipes/rerank/index.js';
import { createClient } from '../dist/src/client.js';

export const MIN_RELEVANCE = 0.6;
export const BATCH_SIZE = 25;

export async function findRecipes(recipes, query, { run = rerank, signal, client } = {}) {
  const started = performance.now();
  const batches = [];
  for (let offset = 0; offset < recipes.length; offset += BATCH_SIZE) {
    batches.push(
      recipes.slice(offset, offset + BATCH_SIZE).map((recipe) => ({
        id: recipe.id,
        text: `${recipe.title}. ${recipe.description} Use when: ${recipe.useWhen}. Tags: ${recipe.tags.join(', ')}.`,
      })),
    );
  }
  const controller = new AbortController();
  const combinedSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
  const responses = [];
  let nextBatch = 0;
  // Smaller batches reduced irrelevant high scores in live checks. Limit provider concurrency.
  const worker = async () => {
    while (nextBatch < batches.length) {
      combinedSignal.throwIfAborted();
      const items = batches[nextBatch++];
      responses.push(
        await run(
          {
            query: `Which Jev recipe directly implements the application's requested decision? Decision: ${query}`,
            items,
            topK: 5,
            minRelevance: MIN_RELEVANCE,
          },
          { signal: combinedSignal, client },
        ),
      );
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.min(3, batches.length) }, worker));
  } catch (error) {
    controller.abort();
    throw error;
  }
  const knownIds = new Set(recipes.map((recipe) => recipe.id));
  const items = responses
    .flatMap((result) => result.items)
    .filter(
      (item) =>
        knownIds.has(item.id) &&
        Number.isFinite(item.relevance) &&
        item.relevance >= MIN_RELEVANCE &&
        item.relevance <= 1,
    )
    .sort((a, b) => b.relevance - a.relevance || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map(({ id, relevance }) => ({ id, relevance }));
  return {
    status: items.length ? 'ready' : 'review',
    items,
    recipe: 'rerank',
    evaluated: recipes.length,
    batches: batches.length,
    minRelevance: MIN_RELEVANCE,
    elapsedMs: Math.round(performance.now() - started),
  };
}

export function createFindHandler({
  recipes,
  env = process.env,
  run = rerank,
  now = Date.now,
  timeoutMs = 25_000,
}) {
  const hourlyLimit = Number(env.JEV_FIND_HOURLY_LIMIT ?? 60);
  if (!Number.isInteger(hourlyLimit) || hourlyLimit < 0)
    throw new Error('JEV_FIND_HOURLY_LIMIT must be a nonnegative integer.');
  const enabled = env.JEV_FIND_ENABLED !== 'false' && Boolean(env.TYPESAFE_API_KEY?.trim());
  const client = enabled
    ? createClient({ apiKey: env.TYPESAFE_API_KEY, retry: { maxRetries: 0 } })
    : undefined;
  let active = 0;
  let windowStart = now();
  let used = 0;
  const peers = new Map();
  return async (request, response) => {
    const reply = (status, body) => {
      response.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        ...(status === 429 ? { 'retry-after': '60' } : {}),
      });
      response.end(JSON.stringify(body));
    };
    if (request.method !== 'POST') return reply(405, { error: 'Use POST.' });
    if (request.headers.origin) {
      const allowed = env.SITE_URL
        ? new URL(env.SITE_URL).origin
        : `http://${request.headers.host}`;
      if (request.headers.origin !== allowed) return reply(403, { error: 'Origin not allowed.' });
    }
    if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json')
      return reply(415, { error: 'Use application/json.' });
    if (!enabled)
      return reply(503, {
        error: 'Jev matching is unavailable. Keyword search is still available.',
      });
    let query;
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of request.iterator({ destroyOnReturn: false })) {
        size += Buffer.byteLength(chunk);
        if (size > 4096) {
          response.setHeader('connection', 'close');
          return reply(413, { error: 'Description is too long.' });
        }
        chunks.push(chunk);
      }
      const body = JSON.parse(
        Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString('utf8'),
      );
      query = typeof body?.query === 'string' ? body.query.trim() : '';
      if (query.length < 3 || query.length > 1000)
        return reply(400, { error: 'Use 3 to 1,000 characters.' });
    } catch {
      return reply(400, { error: 'Invalid request.' });
    }
    const time = now();
    if (time - windowStart >= 3_600_000) {
      windowStart = time;
      used = 0;
    }
    for (const [key, peer] of peers) if (time - peer.start >= 60_000) peers.delete(key);
    // Do not trust spoofable forwarding headers. A reverse proxy shares this quota.
    const address = request.socket.remoteAddress ?? 'unknown';
    const peer = peers.get(address) ?? { start: time, used: 0 };
    if (
      active >= 2 ||
      used >= hourlyLimit ||
      peer.used >= 5 ||
      (!peers.has(address) && peers.size >= 1000)
    )
      return reply(429, {
        error:
          'Jev matching is busy or has reached its usage limit. Use keyword search or try later.',
      });
    peer.used++;
    peers.set(address, peer);
    used++;
    active++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const disconnected = () => {
      if (!response.writableEnded) controller.abort();
    };
    response.on('close', disconnected);
    try {
      const result = await findRecipes(recipes, query, { run, client, signal: controller.signal });
      if (!controller.signal.aborted) reply(200, result);
      else if (!response.destroyed)
        reply(504, { error: 'Jev took too long. Keyword search is still available.' });
    } catch {
      controller.abort();
      if (!response.destroyed)
        reply(503, { error: 'Jev matching is unavailable. Keyword search is still available.' });
    } finally {
      clearTimeout(timer);
      response.off('close', disconnected);
      active--;
    }
  };
}
