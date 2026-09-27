export function classifyWithRules(recipe, input) {
  if (recipe === 'paragraph-boundary') {
    const headingBeforeProse = input.left.split(/\s+/).length <= 8 && /^[A-Z]/.test(input.right);
    return /[.!?:]$/.test(input.left.trim()) || headingBeforeProse ? 'separate' : 'continue';
  }
  if (/\b(const|let|function|import|require)\b|[{};]/.test(input.text)) return 'code';
  if (input.text.length < 80 && !/[.!?:]$/.test(input.text.trim())) return 'heading';
  return 'body';
}

export function ingestionMetrics(run) {
  const cases = new Map(run.cases.map((entry) => [entry.id, entry]));
  const rows = run.rows.map((row) => ({
    ...row,
    family: cases.get(row.id).family,
    baselineCorrect:
      classifyWithRules(run.recipe, cases.get(row.id).input) === row.expected.verdict,
  }));
  const families = [...new Set(rows.map((row) => row.family))];
  const labels =
    run.recipe === 'text-block-role'
      ? ['heading', 'body', 'list_item', 'code', 'table', 'caption', 'formula', 'other']
      : ['continue', 'separate'];
  const perLabel = labels.map((label) => {
    const expected = rows.filter((row) => row.expected.verdict === label);
    const predicted = rows.filter((row) => row.actual?.verdict === label);
    const correct = expected.filter((row) => row.actual?.verdict === label).length;
    return {
      label,
      cases: expected.length,
      precision: predicted.length ? correct / predicted.length : 0,
      recall: expected.length ? correct / expected.length : 0,
      f1:
        expected.length + predicted.length
          ? (2 * correct) / (expected.length + predicted.length)
          : 0,
    };
  });
  const accepted = rows.filter(
    (row) =>
      row.ready && (run.recipe !== 'paragraph-boundary' || row.actual?.verdict === 'continue'),
  );
  const precision = (sample) => {
    const ready = sample.filter(
      (row) =>
        row.ready && (run.recipe !== 'paragraph-boundary' || row.actual?.verdict === 'continue'),
    );
    return ready.length ? ready.filter((row) => row.correct).length / ready.length : null;
  };
  const improvement = (sample) =>
    sample.reduce((sum, row) => sum + Number(row.correct) - Number(row.baselineCorrect), 0) /
    sample.length;
  const interval = bootstrapDocuments(rows, families, precision);
  const baselineImprovementInterval95 = bootstrapDocuments(rows, families, improvement);
  const continuation = perLabel.find((entry) => entry.label === 'continue');
  const acceptedContinuationRecall = continuation?.cases
    ? rows.filter((row) => row.ready && row.correct && row.expected.verdict === 'continue').length /
      continuation.cases
    : null;
  return {
    baseline: 'Frozen syntax/punctuation rules in evals/lib/ingestion-metrics.mjs',
    baselineAccuracy: rows.filter((row) => row.baselineCorrect).length / rows.length,
    documentCount: families.length,
    perLabel,
    macroF1: perLabel.reduce((sum, entry) => sum + entry.f1, 0) / perLabel.length,
    readyCoverage: rows.filter((row) => row.ready).length / rows.length,
    acceptedDecisions: accepted.length,
    acceptedDocuments: new Set(accepted.map((row) => row.family)).size,
    acceptedPrecision: precision(rows),
    acceptedPrecisionInterval95: interval,
    acceptedContinuationRecall,
    baselineImprovementInterval95,
    intervalMethod:
      'Deterministic percentile bootstrap of whole source documents, 2000 replicates. Sparse/all-correct samples can yield degenerate intervals; these are descriptive, not guarantees.',
  };
}

function bootstrapDocuments(rows, families, metric) {
  const groups = families.map((family) => rows.filter((row) => row.family === family));
  let seed = 72931;
  const values = [];
  for (let replicate = 0; replicate < 2000; replicate++) {
    const sample = [];
    for (let index = 0; index < groups.length; index++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      sample.push(...groups[Math.floor((seed / 2 ** 32) * groups.length)]);
    }
    const value = metric(sample);
    if (value !== null) values.push(value);
  }
  values.sort((a, b) => a - b);
  return values.length
    ? [
        values[Math.floor(values.length * 0.025)],
        values[Math.min(values.length - 1, Math.floor(values.length * 0.975))],
      ]
    : null;
}
