# Static recipe catalog

Run `npm run site:build`, then `npm run site:preview`. The preview binds to localhost on port 4173; set `PORT` to choose another port. No model calls or browser API keys are used.

The builder reads the existing metadata, compiled schemas, demo fixtures, featured collection file, and saved evaluation reports. It executes every displayed fixture and each offered confidence policy offline. The browser uses the same search implementation as the package. Recipe facts are not copied into page templates.

Search by task, filter by collection or evidence, inspect the contract and saved result, or compare related recipes. A report is current only when its recipe fingerprint matches the compiled implementation. Missing measurements and older reports remain visible.

`site/dist` is generated and excluded from Git and the npm archive. It can be served by any static host. Deployment is a separate release action.
