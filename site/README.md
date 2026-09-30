# Recipe catalog and live finder

Run `npm run site:build`, then `npm run site:preview`. The preview listens on all interfaces, port 4173; set `PORT` to choose another port. Open it at `http://127.0.0.1:4173`. The preview loads `.env` when present. Set `TYPESAFE_API_KEY` on the server to enable **Match with Jev**. Building pages, typing in keyword search, and exploring saved fixtures make no model calls.

The builder reads the existing metadata, compiled schemas, demo fixtures, featured collection file, and saved evaluation reports. It executes every displayed fixture and each offered confidence policy offline. The browser uses the same search implementation as the package. Recipe facts are not copied into page templates.

The build also creates a linked catalog at `/recipes/` and a complete HTML guide at
`/recipes/<id>/` for each recipe. These pages include the same contracts, fixtures,
evidence, and limitations without requiring JavaScript. The homepage retains the
interactive explorer and links to the guides.

Each recipe guide embeds the hand-written sections of `recipes/<id>/README.md`
and has a Markdown sibling at `/recipes/<id>/index.md` with absolute links. The
guides in `docs/` listed in `scripts/lib/docs.mjs` are published at
`/docs/<name>/` with a Markdown sibling at `/docs/<name>.md`. `/llms.txt` indexes
these files and `/llms-full.txt` concatenates every recipe guide.

`site/updated.json` records, for each recipe and published doc, a content hash
and the date that content last changed. `npm run docs` refreshes it: an entry
keeps its date while its hash is unchanged and receives the current date when
the content differs. Pages use these dates for `dateModified`, a visible "Last
updated" line, and sitemap `lastmod`; nothing is dated from the build clock.

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

`site/dist` is generated and excluded from Git and the npm archive. Its pages and keyword search can be served by any static host; live matching requires the Node endpoint below. Deployment is a separate release action.

## Match with Jev

Submitting a description calls `POST /api/find`. The server uses the library's
actual `rerank` recipe on all catalog entries in batches of up to 25 (currently
ten requests, at most three in flight per search). It merges the top five results with relevance at least 0.6.
Scores are model estimates, not measured accuracy; scores across batches may
have different calibration. No generated explanations are shown. Descriptions
and “use when” text come from catalog metadata.

The browser displays live results separately from keyword fallback and exposes
the recipe, evaluated count, threshold, and elapsed time. Editing the query or
filters cancels the request and returns to keyword search. A failed batch makes
the whole search fall back rather than presenting incomplete coverage.

Configuration at server startup:

- `TYPESAFE_API_KEY`: required for matching; never copied to `site/dist`.
- `SITE_URL`: public origin, such as `https://jev-recipes.com`, for origin checks
  behind an HTTPS proxy. Defaults to `https://jev-recipes.com`, matching the
  canonical URL default. Loopback previews also accept their own exact origin
  when the request comes from a loopback socket. Set this at build time too for
  canonical URLs.
- `JEV_FIND_ENABLED=false`: disable model calls.
- `JEV_FIND_HOURLY_LIMIT=60`: maximum submitted searches per fixed hourly
  window per process (starting with server startup); zero disables
  calls. Each submission uses up to ten provider requests, with retries off.
- `JEV_FIND_TRUST_FORWARDED=true`: key the per-visitor limit on the first
  `x-forwarded-for` address instead of the socket address. Set this only when
  a trusted reverse proxy such as Railway sits in front of the server;
  otherwise the header is spoofable.

Limits also include two concurrent searches, five submissions per minute per
visitor address, 1,000 characters per query, a 4 KB body, and a 25-second model
request deadline. These are in-memory limits and reset on restart. Forwarded IP
headers are ignored by default, so clients behind a reverse proxy share the
socket-address limit until `JEV_FIND_TRUST_FORWARDED` is enabled. Before
scaling to multiple instances, use a shared quota store. The hourly limit caps
request count, not dollar spend.

The preview server sends `cache-control: public, max-age=300,
stale-while-revalidate=86400` for built files and `no-store` for `/api/find`
and error responses. Every response carries a `default-src 'self'` content
security policy, `x-content-type-options: nosniff`, and a strict referrer
policy. Missing paths return the built `404.html` with the site navigation.

The application does not persist descriptions or log provider responses. Submitted
descriptions are sent to TypeSafe; its retention policy applies independently.

For a Node deployment, build from the repository root with `npm ci && npm run
site:build`, then start `npm run site:preview` with `PORT`, `SITE_URL`, and the key
configured as server environment variables. Ship the compiled root `dist/`,
`site/`, and runtime dependencies. A host publishing only `site/dist` still serves
the catalog but needs a separate same-origin `/api/find` backend for live matching.
Railway production is configured to build with `npm run site:build` and start with
`npm run site:preview`. `SITE_URL=https://jev-recipes.com` is configured; HTTPS
browser matching was verified after correcting that setting.

Run `node --test tests/tooling/site-find.test.mjs tests/tooling/catalog-site.test.mjs`
after building. Live quality and latency should be sampled with representative
queries before increasing the usage cap. Deployment remains a separate action.

Live checks found unrelated high scores in 50- and 100-item batches for a tool-permission query. The finder uses 25-item batches based on that observation; this is an initial quality check, not a calibrated benchmark.

Deployment checklist: production API key presence, build/start commands, and `SITE_URL=https://jev-recipes.com` verified in Railway. A production browser search returned `tool-call-gate` for the tool-permission example.

## Interface and local verification

The homepage puts saved decision examples above keyword search and optional live matching.
Suggested starting recipes appear first when the search is empty. Query and filter values
are retained in the URL. Recipe details use keyboard-accessible tabs, copyable examples,
and a mobile back-to-results control. Evidence remains labeled independently of demo outcomes.

The extended introduction is published from `docs/getting-started.md`. Static guides include
an on-page contents menu and shared copy controls from `site/ui.js`; their content and
navigation remain available without JavaScript. IBM Plex Sans and Mono are served locally
from `site/fonts/` under the included SIL Open Font License.

For offline UI review, run `JEV_FIND_ENABLED=false npm run site:preview`. Verify the saved
routing threshold at 80% and 95%, both hero scenarios, keyword filters, matching failure
fallback, all four inspector tabs (including arrow keys), comparison, copy controls, and
mobile selection/back navigation. No live provider calls are needed for these checks.
