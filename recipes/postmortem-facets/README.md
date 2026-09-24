# Label the facets of a postmortem

<!-- BEGIN GENERATED: usage -->

Which of these does postmortem include: a timeline, a root cause, customer impact, contributing factors, action items?

Use when: You need to check an incident postmortem for the sections a review process expects before accepting it, or to tell the author which parts are missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { postmortemFacets } from 'jev-recipes/postmortem-facets';

const result = await postmortemFacets({
  postmortem:
    'Incident 2026-09-18: checkout failures. 10:12 UTC: alert on checkout 5xx rate fired. 10:15: on-call acknowledged and confirmed failures in the order-confirmation step. 10:31: deploy of order-service 3.8.0 identified as the trigger and rolled back. 10:36: error rate returned to baseline. Impact: for 24 minutes, roughly 18% of checkout attempts failed at confirmation, affecting all regions. Root cause: 3.8.0 changed the idempotency key format, and the confirmation step rejected keys written by 3.7.x instances still running during the rolling deploy. Action items: (1) add a compatibility test for mixed-version idempotency keys; (2) add a canary stage to the order-service pipeline; (3) document the key format in the service contract.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo postmortem-facets`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "ready",
  "detected": ["statesTimeline", "statesRootCause", "statesImpact", "statesActionItems"],
  "labels": {
    "statesTimeline": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesRootCause": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.92,
      "confidence": 0.92
    },
    "statesImpact": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.9,
      "confidence": 0.9
    },
    "statesContributingFactors": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    },
    "statesActionItems": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`report-facets`](../report-facets/README.md): Use report-facets for agent progress reports, where the expected parts are an outcome, evidence, blockers, and next steps.
- [`summary-coverage`](../summary-coverage/README.md): Use summary-coverage to check whether a summary covers a source document, rather than whether a document contains expected sections.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `postmortem`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesTimeline`, `statesRootCause`, `statesImpact`, `statesContributingFactors`, `statesActionItems`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that a facet is present, not that it is right. A postmortem can name a confident root cause that later proves wrong, and an action item counts even when it has no owner or due date. The labels are independent, so the result can show a timeline without impact or action items without a cause. Section headings, templates, and required owners are structure to enforce in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo postmortem-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe postmortem-facets` to inspect the input and result schemas.
