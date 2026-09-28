# Local finder verification

- Uses the actual compiled `rerank` recipe and TypeSafe service. No production deployment performed.
- Five exploratory prompts are saved in `live-checks.json`: tool approval, a paraphrase, support routing, passage selection, and an unrelated request. The intended recipe ranked first in the four matching cases; the unrelated request returned review. This is not a held-out accuracy benchmark.
- Initial 50- and 100-item batch checks produced unrelated high scores for tool approval. The implementation uses 25-item batches, covers all 248 recipes in ten calls, and limits provider concurrency to three calls per search.
- Browser verification: live cards, automatic inspector selection, explanation disclosure, keyword reset, no-match response, and rate-limit fallback. Browser live matching also took 3.7 seconds in one observed run; the five saved API checks took 0.55–0.73 seconds. Latency varies.
- Seven automated tests pass across `site-find.test.mjs` and `catalog-site.test.mjs`. Build, formatting, JavaScript syntax, and diff checks pass. No configured API key appears in the public build.
- `homepage-audit.json`: aiseo-audit 2.0.2, unchanged informational/generic profile and five homepage queries, default weights, score 100/100. Local homepage only.
- Production API keys are configured in Railway, as confirmed by the maintainer. Railway start/build commands and production endpoint behavior have not been verified.

Run from the repository root: `npm run site:build`, then `npm run site:preview`.
See `site/README.md` for runtime environment and quota settings.
