# Jev recipes AI SEO audit

Audited https://jev-recipes.com/ on 2026-09-28 UTC with `aiseo-audit@2.0.2` and five assumed target queries. Overall score: **55/100 (F)**. The local build produced the same overall and stage scores.

| Stage                 | Score |
| --------------------- | ----: |
| Technical eligibility |   96% |
| Retrieval alignment   |   56% |
| Citation fitness      |   41% |
| Provenance            |    0% |

## Recommended priorities

1. Generate HTML recipe pages with ordinary links. The audit extracted only 176 words from the homepage. Source inspection confirms that the catalog and recipe details load from JSON through JavaScript, with hash navigation. The 248 recipes are not present in the fetched HTML. Static pages would expose their descriptions, contracts, examples, and evidence without requiring JavaScript execution.
2. Add a clear introduction and useful answers about TypeScript installation, support routing, evidence reranking, and evaluation. Use descriptive titles and headings matching the actual content. Keep the existing evidence limitations and uncertainty language accurate.
3. Add verified maintainer/project attribution, relevant source links next to factual claims, suitable JSON-LD, and Open Graph metadata. The fetched homepage has no JSON-LD or Open Graph tags and the tool detected no author attribution.
4. Publish a sitemap once recipe HTML routes exist. A separate live request returned HTTP 404 for `/sitemap.xml`.

## Interpretation and limits

This is a homepage audit, not an audit of 248 individual recipe pages. The five target queries are analyst assumptions, not measured search demand. The score is a heuristic readiness measure, not a prediction of rankings, citations, or traffic.

The report's crawler factor says “All major AI crawlers allowed,” but its raw data lists every crawler as unknown. A separate live request returned HTTP 200 for `/robots.txt`, containing only comments about content signals and no crawler directives. Treat production bot access as unverified; these requests do not test bot-specific firewall behavior.

Some suggestions are generic pattern checks. In particular, do not remove honest uncertainty language or add irrelevant entities, statistics, FAQ markup, or citations merely to increase the score.

No application source or dependencies were changed. The package ran from a temporary npm cache. Reports were rendered from the saved JSON using the package's own renderer.

## Files

- `live-report.html`: package-generated interactive HTML report.
- `live-report.md`: package-generated Markdown report.
- `live-baseline.json`: live-site baseline for future comparisons.
- `local-baseline.json`: local build baseline.
- `robots.txt`: separately retrieved live robots response.
- `robots-headers.txt` and `sitemap-headers.txt`: response evidence.

## Repeat

```sh
npx --yes aiseo-audit@2.0.2 https://jev-recipes.com/ \
  --query 'What is Jev recipes?' \
  --query 'How do I use Jev recipes in TypeScript?' \
  --query 'How can I route support requests with Jev?' \
  --query 'How can I rerank evidence with Jev?' \
  --query 'How can I evaluate Jev recipe accuracy?' \
  --json --out artifacts/aiseo-audit/live-baseline.json
```

Package documentation: https://aiseo-audit.com/docs/cli
