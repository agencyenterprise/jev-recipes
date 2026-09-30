# Reproduce a package problem

Copy this folder into a separate directory, or download these files from GitHub. It installs the published `jev-recipes@0.9.2`; it needs no repository build or API key. Requires Node.js 22.9 or newer.

```sh
npm ci --ignore-scripts
npm start
```

Installation downloads the package and its dependencies from npm. Running the example is offline: it injects the saved response in `fixture.json`, disables fetch, and never loads `.env`.

The first output line records the installed package version, Node version, and fixture mode. The result should contain `status: "ready"` and `route: "billing"`. This demonstrates package behavior, not live model accuracy.

## Adapt it to your report

1. Install the exact version where you see the problem. For example, `npm install --ignore-scripts --save-exact jev-recipes@0.9.1`. This updates both the manifest and lockfile. Keep both with your reproduction.
2. Replace `fixture.json`'s `input` with the smallest sanitized input that shows the problem. Replace `response` with a saved provider response if available. A recipe result and a provider response have different shapes; do not substitute one for the other.
3. For another recipe, change the import and function call in `run.mjs`, then use that recipe's input and response shapes. Keep the injected client.
4. Run `npm start` and record the actual output or exception, your operating system, and what you expected instead. If sanitizing the case changes the behavior, explain that in the report.
5. Share the source files and lockfile, or paste the small case into the [bug form](https://github.com/agencyenterprise/jev-recipes/issues/new?template=bug-report.yml). Exclude `node_modules`, credentials, and private data. Review all fixture and error content before sharing.

There is no assertion in the example: unexpected outputs and thrown errors are useful evidence. For a malformed-response bug, preserve the malformed part of the saved response rather than repairing it.

## What replay can establish

Replaying a response makes the package's validation and confidence handling repeatable. It does not reproduce authentication, transport errors, provider availability, or how the live model chose its answer. For those problems, include the provider name, error, timing, and sanitized input in the report; you do not need to make another paid call or capture a raw response to ask for help.

Use [Unexpected model decision](https://github.com/agencyenterprise/jev-recipes/issues/new?template=model-decision.yml) for a valid decision you disagree with, or [Ask a usage question](https://github.com/agencyenterprise/jev-recipes/issues/new?template=usage-question.yml) if you are unsure how to use the package.
