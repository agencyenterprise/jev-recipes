const STOPWORDS = new Set(
  'a an the of to in on for and or is are was be it its this that with by as at from does do did which what how when given supplied any one not you your need needs under into than then them their there these those whether about between each per only also'.split(
    ' ',
  ),
);

export function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1 && !STOPWORDS.has(token)),
  );
}

export function jaccard(first, second) {
  const union = new Set([...first, ...second]).size;
  if (union === 0) return 0;
  let intersection = 0;
  for (const token of first) if (second.has(token)) intersection += 1;
  return intersection / union;
}

export function recipeSignature(record) {
  const inputs = Object.keys(record.inputSchema?.properties ?? {})
    .filter((name) => name !== 'minConfidence')
    .sort();
  const outcomes = [...collectEnums(record.resultSchema)].sort();
  return { inputs, outcomes };
}

export function recipeTokens(record) {
  const { title, description, useWhen = '' } = record.metadata;
  return tokenize(`${title} ${description} ${useWhen}`);
}

export function findNearDuplicates(
  records,
  { textThreshold = 0.5, signatureTextThreshold = 0.3 } = {},
) {
  const prepared = records.map((record) => ({
    id: record.id,
    tokens: recipeTokens(record),
    signature: JSON.stringify(recipeSignature(record)),
  }));
  const pairs = [];
  for (let i = 0; i < prepared.length; i += 1) {
    for (let j = i + 1; j < prepared.length; j += 1) {
      const first = prepared[i];
      const second = prepared[j];
      const similarity = jaccard(first.tokens, second.tokens);
      const sameSignature = first.signature === second.signature;
      if (similarity >= textThreshold) {
        pairs.push({ first: first.id, second: second.id, similarity, sameSignature });
      } else if (sameSignature && similarity >= signatureTextThreshold) {
        pairs.push({ first: first.id, second: second.id, similarity, sameSignature });
      }
    }
  }
  return pairs.sort((a, b) => b.similarity - a.similarity);
}

export function assertDistinctRecipes(records, options) {
  const pairs = findNearDuplicates(records, options);
  if (!pairs.length) return;
  const lines = pairs.map(
    (pair) =>
      `  ${pair.first} ~ ${pair.second} (wording similarity ${pair.similarity.toFixed(2)}${pair.sameSignature ? ', identical inputs and outcomes' : ''})`,
  );
  throw new Error(
    `Near-duplicate recipes. Merge them, sharpen their descriptions, or narrow their inputs:\n${lines.join('\n')}`,
  );
}

function collectEnums(schema, found = new Set()) {
  if (!schema || typeof schema !== 'object') return found;
  if (Array.isArray(schema.enum)) for (const value of schema.enum) found.add(String(value));
  for (const value of Object.values(schema)) {
    if (value && typeof value === 'object') collectEnums(value, found);
  }
  return found;
}
