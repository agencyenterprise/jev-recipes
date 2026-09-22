# Releasing jev-recipes

Publishing is manual. Keep the current package name and existing imports. The Makefile, generation tooling, and tests are contributor tools; users install compiled code from npm.

## What ships

The `files` allowlist in `package.json` includes:

- Compiled recipe and shared runtime JavaScript with TypeScript declarations.
- The CLI and generated catalog metadata, loaders, and schema descriptions.
- Recipe `demo.json` files copied under `dist/recipes/` and required by `demo`, `example`, and `describe`.
- The root README, changelog, license, and package metadata.

The archive excludes tests, coverage, development scripts, the Makefile, source TypeScript, source recipe guides, and standalone examples. Recipe authoring metadata modules are removed from the build after the catalog is generated. Detailed guides stay on GitHub and are linked from the root README.

Zod and the official TypeSafe SDK remain runtime dependencies. Users need no build tools, and installing the published package does not run a build.

## Prepare a release

```sh
make setup
make docs
npm run format
make ci
```

`make ci` checks generated files, formatting, types, recipe coverage, the build, tooling, and the actual archive. Generated source and documentation must already be current; CI reports drift rather than silently updating them.

The archive check uses `npm pack --ignore-scripts` after a clean build. This avoids recursively running publishing hooks. It then:

1. Checks every archive path against the allowed content and rejects tests or development files.
2. Verifies all public export targets, schema descriptions, and demo files are present.
3. Packs the installed runtime dependencies and installs the archives into a separate temporary project, offline and with lifecycle scripts disabled.
4. Exercises all recipe subpath imports, root exports, generated descriptions, TypeScript declarations, and offline CLI commands.
5. Reports compressed size, unpacked size, and file count, then removes temporary files.

Run `make pack-check` to repeat just the generation check, clean build, and archive verification. A source-directory link is not an adequate substitute for an archive installation.

When adding a runtime dependency with transitive dependencies, extend the offline consumer setup to provide those archives too. Missing dependencies fail the installation check rather than falling back to the network.

## Publish

Update the changelog, choose a new version, and review the complete release diff. npm does not permit reusing a published version. Use `npm version patch`, `npm version minor`, or `npm version major` from the intended clean checkout, and let CI pass.

```sh
npm login
npm whoami
npm publish --dry-run
npm publish
npm view jev-recipes version
```

`prepublishOnly` runs the full CI script. `prepack` checks generated files and builds from source. Both use npm scripts directly, so Make is optional. Publishing a previously packed archive does not rerun the checkout's checks; publish from the checked repository directory.

After publishing succeeds, push the version commit and tag and create a GitHub release from the changelog. There is no automatic publishing workflow.

While the project is below 1.0.0, document breaking API changes explicitly. This foundation preserves existing recipe names, inputs, result policies, and import paths. Catalog search gains ranking and an optional result limit.

See npm's [package file rules](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#files) and [lifecycle scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/).
