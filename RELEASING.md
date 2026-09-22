# Releasing jev-recipes

Publishing is manual. Choose a new version for each release; npm does not allow reusing a published version. The README badge reads the published version from npm, while package.json records the checkout version. GitHub CI checks the project without publishing it.

## What ships

```text
TypeScript source
  npm run build
JavaScript modules and TypeScript declarations in dist/
  npm pack
jev-recipes-VERSION.tgz
  npm publish
npm registry
```

The package uses native ESM. TypeScript compiles each module to JavaScript and generates `.d.ts` declarations. The build clears `dist/` first so deleted source files cannot survive in a later package.

The `files` list in `package.json` includes the compiled modules, recipe demo JSON, recipe READMEs, the complete recipe catalog guide, the support example fixture and README, root README, changelog, and license. npm includes `package.json` as well. Source files, development configuration, `.env` files, and `node_modules` are excluded.

Zod and the official TypeSafe SDK remain runtime dependencies. npm installs them for consumers. Consumers do not need TypeScript, Prettier, or the repository's build tools, and installation does not run a build.

The CLI's version comes from the installed `package.json`. Its demo command reads the packaged `recipes/<name>/demo.json` files. Both paths resolve relative to the installed CLI, so it works from another directory.

## Prepare the checkout

Use Node.js 22.9 or newer. From the repository:

```sh
npm ci
npm run ci
npm run pack:check
```

`npm run ci` checks formatting, type-checks the source, makes a clean build, and runs every registered offline demo and the support example. `npm run pack:check` previews the exact files npm would include.

If formatting needs attention, run `npm run format`. The demos use saved responses; they confirm that the examples run, not that Jev makes accurate decisions. No test suite is configured.

## Try the packaged artifact

From the repository, create the same archive npm will distribute:

```sh
npm pack
```

This creates `jev-recipes-VERSION.tgz`, with `VERSION` taken from package.json. Replace `VERSION` in the commands below with that value. In a separate empty folder, install that file using its absolute path:

```sh
npm init -y
npm install /absolute/path/to/jev-recipes/jev-recipes-VERSION.tgz
npx --no -- jev-recipes --version
npx --no -- jev-recipes list
npx --no -- jev-recipes demo all
npx --no -- jev-recipes describe answerability
node node_modules/jev-recipes/dist/examples/support/index.js
```

The installed version should match the packed checkout's package.json. An unchanged version number does not imply an unchanged archive; uncommitted additions are included when packing. Demos should report `mode: "demo"` and `model: "demo-fixture"`.

Use the same tarball in an existing TypeScript app to try the library exports:

```ts
import { rerank, rerankInputSchema } from 'jev-recipes';
import { route } from 'jev-recipes/route';
import { verify } from 'jev-recipes/verify';
```

Installing the tarball checks the files consumers receive. Installing the repository folder directly can create a local link and hide missing package files.

## Try live Jev calls

In the separate folder where you installed the tarball:

```sh
npx --no -- jev-recipes example rerank > input.json
```

Edit `input.json` with your own query and passages. Create a local `.env` containing `TYPESAFE_API_KEY`, then run:

```sh
node --env-file=.env node_modules/jev-recipes/dist/cli/index.js run rerank input.json
```

A live run sends the input to TypeSafe and uses API quota. Inspect the selected passages and review status against the outcome you expect. Repeat with the other recipes to evaluate their behavior. To run the support example with live decisions and a saved draft, use `node --env-file=.env node_modules/jev-recipes/dist/examples/support/index.js --live`. Keep private inputs and credentials out of the repository.

## Publish the next version

Update the catalog documentation and move the changelog's `Unreleased` content under the chosen version with the actual release date. Commit the intended changes and choose a new version with `npm version patch`, `npm version minor`, or `npm version major` from a clean working tree. npm updates the manifest and lockfile and creates a commit and tag. Repeat the checks and packaged installation with the new tarball, then let GitHub CI pass.

From the repository:

```sh
npm login
npm whoami
npm publish --dry-run
```

The dry run runs the publish checks and prints the package contents without uploading. Review those results, then publish when ready:

```sh
npm publish
npm view jev-recipes version
```

`prepublishOnly` runs `npm run ci` before a directory-based publish. `prepack` makes a clean build before packing or publishing. These hooks require development dependencies to be installed. Publishing a previously packed tarball does not rerun the checkout's checks, so use the repository command above for the documented workflow.

After publishing succeeds, push the version commit and its tag, then create a GitHub release with the changelog notes. No workflow publishes on push, tag creation, or release creation.

While the project is below 1.0.0, document breaking API changes explicitly. Treat 0.x releases as evolving APIs.

See npm's [package lifecycle documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/) and [package file rules](https://docs.npmjs.com/cli/v11/commands/npm-publish/#files-included-in-package) for the underlying behavior.
