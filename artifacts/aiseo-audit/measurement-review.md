# Measurement review

Verified against the published `aiseo-audit@2.0.2` README, configuration schema, domain-profile detection, factor eligibility, category aggregation, stage calculation, and sitemap implementation. npm still reported 2.0.2 as the current version on 2026-09-28 UTC.

## Correction to the earlier explanation

The statement that getting 100 requires four attributed quotes was incorrect. When there are no attributed quotes, the factor has `status: neutral`. The package excludes neutral, informational, and diagnostic factors from scoring. It also excludes content freshness for this evergreen informational page. Neither missing quotes nor an invented update date is required to improve this score.

The overall score normally averages the percentages of applicable categories using category weights. It is not the raw sum of all displayed factor maxima. Stage weights are an optional alternate overall calculation. This review uses the package defaults without changing weights or removing categories.

## Appropriate profiles

This site provides open-source library documentation and recipe guides. The package's informational profile is appropriate. Its product profile is intended to add checks for price, specifications, availability, and comparisons. Auto detection already selected informational in the previous runs; making it explicit confirms the earlier measurement rather than producing a different score.

Saved profiles:

- `profiles/homepage.json`: informational, generic engine, the same five homepage questions used previously.
- `profiles/route.json`: informational, generic engine, five questions specific to configuring, calling, and interpreting the route recipe.
- `profiles/site.json`: informational, generic engine, no target queries. Used for shared structural/content checks across the sitemap so unrelated recipes are not tested against homepage or support-routing questions.

These query sets describe intended reader tasks inferred from the repository. They are not search-volume or customer-query measurements. Changing them requires a new baseline.

## Results

| Measurement | Result | Scope |
| --- | ---: | --- |
| Homepage, same five questions | 74/100 | Updated local homepage |
| Route guide, five route questions | 62/100 | Updated local guide; new query baseline |
| Sitemap, without target queries | 59/100 average | 250 successful pages, zero failures |

The sitemap score is a separate baseline and is not directly comparable to a single query-aware homepage score. The live deployment has not been changed by this work.

Homepage stages: technical eligibility 96%, retrieval alignment 87%, citation fitness 52%, provenance 33%.

The sitemap report identifies consistent site naming and Organization metadata across all pages, with 0% recognized byline coverage. Site-wide category averages include structural alignment 21%, answerability 23%, grounding signals 42%, and authority context 66%. These results prioritize improvements to the shared recipe templates and source attribution, not just homepage edits.

## Reproduce a page audit

After building and starting the local preview on port 4173:

```sh
npx --yes aiseo-audit@2.0.2 http://127.0.0.1:4173/ \
  --signals-base http://127.0.0.1:4173 \
  --config artifacts/aiseo-audit/profiles/homepage.json \
  --out artifacts/aiseo-audit/reviewed-homepage.html

npx --yes aiseo-audit@2.0.2 http://127.0.0.1:4173/recipes/route/ \
  --signals-base http://127.0.0.1:4173 \
  --config artifacts/aiseo-audit/profiles/route.json \
  --out artifacts/aiseo-audit/reviewed-route.html
```

For this local sitemap run, an audit-only copy of the generated sitemap replaced the production origin with the local preview origin. The package's `analyzeSitemap` API then fetched those 250 local URLs with shared local domain signals. The temporary sitemap was removed afterward. Production canonical tags were unchanged.

After deployment, use the production sitemap directly:

```sh
npx --yes aiseo-audit@2.0.2 \
  --sitemap https://jev-recipes.com/sitemap.xml \
  --signals-base https://jev-recipes.com \
  --config artifacts/aiseo-audit/profiles/site.json \
  --out artifacts/aiseo-audit/deployed-site.html
```

## Package integration observation

The published ESM API failed on Node 24.15.0 during query-aspect coverage with `TypeError: BM25 is not a function`. The documented CommonJS entry point completed the same profiles and the sitemap audit. The CLI used in the earlier runs also works. This is an observed package-entry-point issue, not a site scoring failure.

Reports: `reviewed-homepage.html`, `reviewed-route.html`, and `reviewed-site.html`. Corresponding JSON files retain the measurements.

Documentation: https://github.com/agencyenterprise/aiseo-audit and https://aiseo-audit.com/docs/configuration. Published runtime code takes precedence when cached web documentation describes an older scoring version.
