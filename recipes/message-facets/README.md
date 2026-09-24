# Label the facets of a message

<!-- BEGIN GENERATED: usage -->

Which of these does message do: ask a question, report a problem, request an action, state a deadline, reference prior contact?

Use when: You need several independent yes/no labels on an incoming message in one call, for triage rules or form pre-fill.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { messageFacets } from 'jev-recipes/message-facets';

const result = await messageFacets({
  message:
    'Following up on ticket 4821: the export still fails with a timeout. Can you escalate this? We need it working before our board meeting on Friday.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo message-facets`.

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
  "detected": [
    "asksQuestion",
    "reportsProblem",
    "requestsAction",
    "statesDeadline",
    "referencesPriorContact"
  ],
  "labels": {
    "asksQuestion": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.86,
      "confidence": 0.86
    },
    "reportsProblem": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "requestsAction": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesDeadline": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "referencesPriorContact": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent when you need the single primary purpose of a message.
- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to detect an explicit request for urgent attention.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`labels` holds one check per facet: `asksQuestion`, `reportsProblem`, `requestsAction`, `statesDeadline`, and `referencesPriorContact`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present facets in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per facet in a single Jev request. This folder owns the five questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet is judged independently, so combinations are expected. `statesDeadline` reports that a time constraint is present; extract the actual date in application code. `referencesPriorContact` detects a reference to earlier contact, not whether that contact exists in your system. For the single dominant purpose of a message use [`turn-intent`](../turn-intent/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo message-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe message-facets` to inspect the input and result schemas.
