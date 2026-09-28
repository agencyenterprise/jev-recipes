# Static recipe catalog

Run `npm run site:build`, then `npm run site:preview`. The preview listens on all interfaces, port 4173; set `PORT` to choose another port. Open it at `http://127.0.0.1:4173`. No model calls or browser API keys are used.

The builder reads the existing metadata, compiled schemas, demo fixtures, featured collection file, and saved evaluation reports. It executes every displayed fixture and each offered confidence policy offline. The browser uses the same search implementation as the package. Recipe facts are not copied into page templates.

The build also creates a linked catalog at `/recipes/` and a complete HTML guide at
`/recipes/<id>/` for each recipe. These pages include the same contracts, fixtures,
evidence, and limitations without requiring JavaScript. The homepage retains the
interactive explorer and links to the guides.

Canonical URLs, Open Graph metadata, JSON-LD, `robots.txt`, and `sitemap.xml` use
`https://jev-recipes.com` by default. Set `SITE_URL` to another HTTP(S) origin at
build time when deploying elsewhere. Dates are not invented for metadata or the
sitemap. The preview server serves directory index pages and redirects directory
URLs to their trailing-slash form. Other static hosts must support the same
directory-index behavior.

Run `npm run site:build` and `node --test tests/tooling/catalog-site.test.mjs` to
check generated pages and navigation. `aiseo-audit` baselines and recommendations
are in `artifacts/aiseo-audit/`.

Search by task, filter by collection or evidence, inspect the contract and saved result, or compare related recipes. A report is current only when its recipe fingerprint matches the compiled implementation. Missing measurements and older reports remain visible.

`site/dist` is generated and excluded from Git and the npm archive. It can be served by any static host. Deployment is a separate release action.
