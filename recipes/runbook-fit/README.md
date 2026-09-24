# Check whether a runbook applies to an incident

<!-- BEGIN GENERATED: usage -->

Does runbook address the symptoms and component described in incident?

Use when: You retrieve candidate runbooks for a live incident and need to filter out ones that cover a different component or a different failure mode before surfacing them to the responder.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { runbookFit } from 'jev-recipes/runbook-fit';

const result = await runbookFit({
  incident:
    'Consumer lag on the notifications-worker Kafka group has climbed past 500k messages over the last 20 minutes. Email and push notifications are arriving up to 40 minutes late. No deploys to the worker today.',
  runbook:
    'Runbook: notifications-worker consumer lag. Trigger: consumer lag alert for group notifications-worker, or user reports of delayed email or push. Steps: 1) Check worker pod count and restart counts in the notifications namespace. 2) Check SMTP and APNs error rates on the delivery dashboard. 3) If pods are healthy and downstream is clean, scale the deployment to twice its current replicas. 4) If lag keeps growing, check partition skew on the notifications topic.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo runbook-fit`.

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
  "probability": 0.93,
  "confidence": 0.93,
  "verdict": "applies"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`troubleshooting-fit`](../troubleshooting-fit/README.md): Use troubleshooting-fit for end-user support articles and a customer's described problem, rather than operational runbooks and incidents.
- [`source-applicability`](../source-applicability/README.md): Use source-applicability to check whether a general document applies to a situation, when neither side is an incident or a runbook.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `incident`      | Yes      | string                       |
| `runbook`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `applies` when Jev's yes probability is at least 0.5 and `inapplicable` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `inapplicable` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict says the runbook is about this incident, not that it will fix it. A runbook can match the symptoms and component and still be out of date or list steps that are unsafe for the current architecture. The recipe does not check ownership, last-reviewed dates, or whether the responder has the access the steps require; keep those checks in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo runbook-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe runbook-fit` to inspect the input and result schemas.
