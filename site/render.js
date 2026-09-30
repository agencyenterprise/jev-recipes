export function renderEvidence(recipe, base = './') {
  const report = recipe.report;
  if (!report || !recipe.evidenceDetails.measurement)
    return `<section class="evidence-panel" aria-label="Evaluation evidence"><strong>${escapeHtml(recipe.evidenceDetails.label)}</strong><p>No verified live accuracy measurement is available. Evaluate representative cases before using this decision in your workflow.</p></section>`;
  const current = recipe.evidence === 'measured';
  const sample =
    report.evidence?.split === 'held-out'
      ? 'held-out'
      : report.evidence?.split === 'development'
        ? 'development'
        : 'saved';
  const interval = report.accuracyInterval95?.map(percent).join(' to ');
  return `<section class="evidence-panel ${current ? 'current' : 'historical'}" aria-label="Evaluation evidence"><strong>${escapeHtml(recipe.evidenceDetails.label)}</strong>
    ${!current ? '<p class="evidence-caveat">Historical evidence. These scores do not measure the current recipe and evaluator.</p>' : ''}
    <p>${escapeHtml(report.model)}${report.evidence?.evaluatedAt ? ' / ' + escapeHtml(report.evidence.evaluatedAt.slice(0, 10)) : ''} / ${report.cases} ${sample} cases</p>
    <p>Scoring revision ${recipe.evidenceDetails.measurement.scoringRevision}.${recipe.evidenceDetails.measurement.replayedAt ? ' Replayed ' + escapeHtml(recipe.evidenceDetails.measurement.replayedAt) + '; measurements retain the original response date.' : ''}</p>
    <div class="metrics"><div class="metric"><span>${percent(report.accuracy)}</span><small>All-case accuracy</small></div><div class="metric"><span>${report.review ?? 'n/a'}</span><small>Sent for review</small></div><div class="metric"><span>${report.failed ?? 'n/a'}</span><small>Failed calls / cases</small></div></div>
    ${report.ready !== undefined ? `<p>${report.ready} ready decisions, with ${percent(report.readyAccuracy)} accuracy among those decisions.</p>` : ''}
    ${interval ? `<p>95% case-level interval: ${interval}. Related synthetic cases are correlated.</p>` : ''}
    ${report.acceptance ? `<p class="${report.acceptance.met ? '' : 'warning'}">${escapeHtml(report.acceptance.label)}</p>` : ''}
    <p>${current ? 'This measures the recorded dataset, not general readiness. Label sources: ' + escapeHtml(recipe.evidenceDetails.measurement.provenance.map((item) => item.method + ': ' + item.source).join('; ')) : 'This measurement uses an earlier or unverified recipe or evaluator version. Rerun with the current recipe and evaluator before treating these numbers as current.'}</p>
    <div class="links"><a href="${base}reports/${recipe.id}.json">Full report and misses</a><a href="https://github.com/agencyenterprise/jev-recipes/tree/main/evals/${recipe.id}">Dataset and labels</a></div></section>`;
}

export function evidenceLabel(recipe) {
  return escapeHtml(
    `${recipe.evidenceDetails.experimental ? 'Experimental / ' : ''}${recipe.evidenceDetails.label}`,
  );
}

export function resultFields(schema) {
  return [
    ...new Set([
      ...Object.keys(schema.properties ?? {}),
      ...(schema.anyOf ?? []).flatMap(resultFields),
    ]),
  ];
}

export function schemaType(schema) {
  if (schema.enum) return schema.enum.join(' | ');
  if (schema.anyOf) return schema.anyOf.map(schemaType).join(' | ');
  return Array.isArray(schema.type) ? schema.type.join(' | ') : (schema.type ?? 'value');
}

export function percent(value) {
  return value === null || value === undefined ? 'n/a' : `${Math.round(value * 100)}%`;
}
export function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
}
