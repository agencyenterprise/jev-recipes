# Record adoption evidence

Use dated public observations to distinguish package discovery from actual integration. Run the read-only collector manually from this checkout, choosing a new directory whose parent already exists:

```sh
node scripts/adoption-snapshot.mjs --out /tmp/jev-adoption-observation
```

It queries npm's public registry/download API and GitHub's public repository/contributor API. It makes no model calls, reads no credentials, and changes no remote state. The output retains source URLs, fetch times, reporting periods, parsed source data, and limitations. Existing directories are rejected; unavailable data stays `null` and sets a nonzero exit status. No background monitoring is installed.

| Signal                                        | What it establishes                                                        | What it does not establish                        |
| --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| npm published version                         | Current registry release                                                   | Which version a particular app runs               |
| Weekly npm downloads                          | Install activity within the returned dates                                 | Unique users, retention, or production usage      |
| GitHub stars/forks                            | Public attention                                                           | Package integration                               |
| Human contributors with multiple commits      | Multiple commits in the returned contributor sample, including maintainers | Independent users returning after a release       |
| Public source imports and dependency manifest | A specific project integrates the package at an observed version           | Successful deployment or musical/decision quality |
| Directory listing                             | A discovery route exists                                                   | Endorsement or customer adoption                  |

## Record integrations separately

For each application, record its URL, owner relationship (maintainer, independent, or unknown), checked date, package version from its manifest, exact imported recipes, source evidence, and any runtime checks. Keep private source references in local records. Count one application once even if several directories list it. An unsearched population is unknown, not zero.

[Jevthoven](../examples/jevthoven/README.md) is the first documented maintainer-built example. Its local source can establish package use without establishing independent adoption. Its deployed dependency version requires separate verification.

Developers can use the [integration issue form](https://github.com/agencyenterprise/jev-recipes/issues/new?template=share-integration.yml) once the form is published. Source inspection and public repository searches remain useful when nobody submits a report. Keep evidence of successful integrations separate from requests for help or examples that only mention the package.

Compare snapshots over the same reporting windows and revisit source-backed integrations for continued dependency use. Overlapping download windows are not independent samples. Investigate a repeated integration problem with a reproducer; do not infer a product change from a star count alone.
