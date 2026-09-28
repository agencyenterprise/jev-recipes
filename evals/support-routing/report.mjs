export function buildWorkflowReport(run, primaryRows) {
  const strategies = Object.fromEntries(
    ['rules', 'primary', 'cascade'].map((name) => [name, summarize(run.rows, name, primaryRows)]),
  );
  return {
    experimental: true,
    evidence: { mode: run.mode, sourceMode: run.sourceMode, split: run.split, date: run.createdAt },
    limitations: [
      'AI-authored synthetic cases and labels; no independent human review.',
      'This small reserved set is descriptive evidence, not population accuracy.',
      'Primary responses are shared between strategies; paired outcomes are not independent runs.',
      'Full-path latency is the sum of recorded primary evaluation and eligible fallback request durations; it excludes browser and queue overhead.',
      'Unknown usage stays unavailable. Monetary cost is not estimated.',
      'A provider alias does not establish an unchanged underlying model.',
    ],
    strategies,
    changed: run.rows
      .filter(
        (row) =>
          row.primary.status !== row.cascade.status || row.primary.route !== row.cascade.route,
      )
      .map((row) => ({
        id: row.id,
        expectedRoute: row.expectedRoute,
        before: row.primary.route,
        after: row.cascade.route,
      })),
    groups: Object.fromEntries(
      [...new Set(run.rows.map((row) => row.group))].map((group) => [
        group,
        Object.fromEntries(
          ['rules', 'primary', 'cascade'].map((name) => [
            name,
            summarize(
              run.rows.filter((row) => row.group === group),
              name,
              primaryRows,
            ),
          ]),
        ),
      ]),
    ),
  };
}

function summarize(rows, strategy, primaryRows) {
  let ready = 0,
    correctReady = 0,
    correctReview = 0,
    failed = 0,
    unsafeRouting = 0;
  let fallbackCalls = 0,
    fallbackFailures = 0;
  let inputTokens = 0,
    outputTokens = 0,
    usageKnown = true;
  const durations = [];
  const models = new Set();
  for (const row of rows) {
    const proposal = row[strategy];
    const hasFailure = proposal.trace?.some((attempt) => attempt.error !== undefined) ?? false;
    if (hasFailure) failed++;
    if (proposal.status === 'ready') {
      ready++;
      if (proposal.route === row.expectedRoute) correctReady++;
      if (row.expectedRoute === null) unsafeRouting++;
    } else if (row.expectedRoute === null && !hasFailure) correctReview++;
    if (strategy === 'rules') continue;
    const primary = primaryRows.find((entry) => entry.id === row.id);
    const usage = primary?.result?.usage;
    if (primary?.model) models.add(primary.model);
    if (primary?.error !== undefined || !validUsage(usage?.input_tokens, usage?.output_tokens))
      usageKnown = false;
    else {
      inputTokens += usage.input_tokens;
      outputTokens += usage.output_tokens;
    }
    let duration = row.primaryDurationMs;
    if (strategy === 'cascade' && row.fallbackExchange) {
      fallbackCalls++;
      if (proposal.reason === 'fallback-failed') fallbackFailures++;
      duration += row.fallbackExchange.durationMs;
      let response;
      try {
        response = JSON.parse(row.fallbackExchange.response);
      } catch {
        response = null;
      }
      if (response?.model) models.add(response.model);
      if (
        row.fallbackExchange.error !== undefined ||
        !validUsage(response?.usage?.prompt_tokens, response?.usage?.completion_tokens)
      )
        usageKnown = false;
      else {
        inputTokens += response.usage.prompt_tokens;
        outputTokens += response.usage.completion_tokens;
      }
    }
    durations.push(duration);
  }
  durations.sort((a, b) => a - b);
  return {
    cases: rows.length,
    ready,
    review: rows.length - ready,
    failed,
    correctReady,
    wrongReady: ready - correctReady,
    correctReview,
    correct: correctReady + correctReview,
    wrong: ready - correctReady,
    unresolved: rows.length - ready - correctReview,
    coverage: ready / rows.length,
    readyAccuracy: ready ? correctReady / ready : null,
    requiredReviewCases: rows.filter((row) => row.expectedRoute === null).length,
    inappropriateRouting: unsafeRouting,
    fallbackCalls,
    fallbackFailures,
    latencyMs: durations.length
      ? { p50: percentile(durations, 0.5), p95: percentile(durations, 0.95) }
      : null,
    usage: usageKnown ? { inputTokens, outputTokens } : null,
    cost: strategy === 'rules' ? 0 : null,
    models: [...models].sort(),
  };
}

function validUsage(input, output) {
  return Number.isInteger(input) && input >= 0 && Number.isInteger(output) && output >= 0;
}

function percentile(values, fraction) {
  return values[Math.max(0, Math.ceil(values.length * fraction) - 1)];
}
