# Recorded comparison: 2026-09-27

**Experimental.** These 48 AI-authored synthetic cases and labels have no independent human review. Development and reserved held-out families were separated before live calls. The policy was unchanged between the two runs. This is a small demonstration, not an estimate of support-traffic accuracy.

| Split                 | Strategy                | Correct ready | Wrong ready | Correct review | Unresolved | Failures | Fallback calls |
| --------------------- | ----------------------- | ------------: | ----------: | -------------: | ---------: | -------: | -------------: |
| Development, 24 cases | Keyword rules           |            11 |           0 |              6 |          7 |        0 |              0 |
| Development, 24 cases | Jev                     |            18 |           0 |              6 |          0 |        0 |              0 |
| Development, 24 cases | Jev + eligible fallback |            18 |           0 |              6 |          0 |        0 |              0 |
| Held-out, 24 cases    | Keyword rules           |             4 |           1 |              5 |         14 |        0 |              0 |
| Held-out, 24 cases    | Jev                     |            18 |           0 |              6 |          0 |        0 |              0 |
| Held-out, 24 cases    | Jev + eligible fallback |            18 |           0 |              6 |          0 |        0 |              0 |

Jev had 75% ready coverage in each split and matched every authored label. No low-confidence suggestion triggered fallback. The two model strategies therefore have identical outcomes and timings. These results do not show a benefit from fallback, and do not justify treating Jev as universally accurate. The keyword rules were fixed before evaluation; they are a small baseline, not an optimized classifier.

Held-out primary latency was p50 258.53 ms and p95 350.28 ms; development was p50 240.61 ms and p95 665.17 ms. These are evaluator request durations, not browser latency or service guarantees. Held-out usage was 10,585 input and 1,140 output tokens. Monetary cost is unavailable; no savings are claimed.

## Retained evidence

- [Development report](development/report.json), [workflow and policy](development/workflow.json), [primary requests and responses](development/primary/run.json).
- [Held-out report](held-out/report.json), [workflow and policy](held-out/workflow.json), [primary requests and responses](held-out/primary/run.json).
- [Fallback ready check](fallback-smoke/ready.json) and [fallback review check](fallback-smoke/review.json), including raw chat responses.

Both primary runs requested and returned `typesafe-ai/jev` through Vercel Gateway. The archive records package version `0.8.3`, recipe fingerprint, dataset fingerprint, workflow hash, and policy. The model alias does not pin a backend version. Development completed at `2026-09-27T23:57:15.268Z`; held-out at `2026-09-27T23:58:01.513Z`. These are UTC timestamps.

The fallback smoke checks used a deliberately low-confidence **fixture primary** and a **live fallback** requesting and returning `google/gemini-2.5-flash-lite`. The invoice-only request returned billing; the independent invoice-and-crash request returned review. These two calls establish that this transport and schema worked for these inputs. They are excluded from the comparison and say nothing about natural fallback frequency or accuracy.

Replay the public held-out archive without credentials:

```sh
node evals/support-routing/run.mjs --replay evals/support-routing/evidence/2026-09-27/held-out
```

To rerun the separate fallback smoke check into a new directory:

```sh
node --env-file=.env evals/support-routing/smoke-fallback.mjs --live --out evals/runs/support-fallback-smoke
```

The local original archives also retain per-case checkpoint files. Public archives include the complete final primary and workflow records needed for replay, with integrity checksums. Labels, policies, response bodies, and input text are retained. Further policy development needs fresh held-out cases; keep these as regression evidence.
