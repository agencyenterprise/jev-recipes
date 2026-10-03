export function meetsReadyAccuracy(rows, minimumAccuracy) {
  const readyCases = rows.filter((row) => row.error === undefined && row.ready);
  if (!readyCases.length) return false;
  const correctReadyCases = readyCases.filter((row) => row.correct).length;
  return correctReadyCases / readyCases.length >= minimumAccuracy;
}
