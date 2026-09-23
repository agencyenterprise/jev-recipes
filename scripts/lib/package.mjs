export function parsePackedArchive(output, expectedName) {
  const parsed = JSON.parse(output);
  // npm 12 keys pack reports by package name; earlier versions return an array.
  const reports = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
  const report = reports[0];
  if (
    reports.length !== 1 ||
    report?.name !== expectedName ||
    typeof report.filename !== 'string' ||
    !report.filename ||
    !Array.isArray(report.files)
  ) {
    throw new Error(`Expected one npm pack report for ${expectedName}.`);
  }
  return report;
}

export function checkPackageContents(files, recipeIds, exports) {
  const paths = new Set(files.map((file) => (typeof file === 'string' ? file : file.path)));
  const ids = new Set(recipeIds);
  for (const path of paths) {
    if (
      /(^|\/)(tests?|__tests__|coverage|node_modules|scripts|examples|\.github)(\/|$)/i.test(
        path,
      ) ||
      /(^|\/)\.env(?:\.|$)/i.test(path) ||
      /\.(test|spec)\./i.test(path)
    ) {
      throw new Error(`Unnecessary file in npm archive: ${path}`);
    }
    const root = ['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md'].includes(path);
    const compiled =
      /^dist\/(src|cli|catalog|recipes)\/.+\.(js|d\.ts)$/.test(path) &&
      !/^dist\/recipes\/[^/]+\/metadata\./.test(path);
    const detail = /^dist\/catalog\/generated\/details\/([^/]+)\.json$/.exec(path);
    const demo = /^dist\/recipes\/([^/]+)\/demo\.json$/.exec(path);
    if (!(root || compiled || (detail && ids.has(detail[1])) || (demo && ids.has(demo[1])))) {
      throw new Error(`File is not on the npm allowlist: ${path}`);
    }
  }
  const required = ['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md', 'dist/cli/index.js'];
  for (const value of Object.values(exports)) {
    for (const path of typeof value === 'string' ? [value] : Object.values(value))
      required.push(path.replace(/^\.\//, ''));
  }
  for (const id of ids)
    required.push(`dist/recipes/${id}/demo.json`, `dist/catalog/generated/details/${id}.json`);
  for (const path of required) {
    if (!paths.has(path)) throw new Error(`Required file missing from npm archive: ${path}`);
  }
}
