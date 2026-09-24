# Label the statements in a privacy notice

<!-- BEGIN GENERATED: usage -->

Which of these does notice state: what data is collected, why it is used, how long it is kept, who it is shared with, how to contact the controller?

Use when: You need several independent yes/no checks on a privacy notice in one call, to spot missing statements before a review or publication.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { privacyNoticeFacets } from 'jev-recipes/privacy-notice-facets';

const result = await privacyNoticeFacets({
  notice:
    'When you create an account we collect your name, email address, and billing details. We use this information to provide the service, process payments, and send account notices. We share billing details with our payment processor and do not sell your data. Questions about your data can be sent to privacy@example.com.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo privacy-notice-facets`.

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
  "detected": ["statesDataCollected", "statesPurpose", "statesSharing", "statesContact"],
  "labels": {
    "statesDataCollected": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesPurpose": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesRetention": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.04,
      "confidence": 0.96
    },
    "statesSharing": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesContact": {
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

- [`clarify`](../clarify/README.md): Use clarify to decide whether a request about the notice is too ambiguous to answer, rather than what the notice states.
- [`pii-presence`](../pii-presence/README.md): Use pii-presence to detect personal data in a text rather than statements about how personal data is handled.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `notice`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per statement: `statesDataCollected`, `statesPurpose`, `statesRetention`, `statesSharing`, and `statesContact`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present statements in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per statement in a single Jev request. This folder owns the five questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that a statement is present, not that it is adequate. A notice can name a purpose that is too vague to satisfy a regulator, give a retention rule that is never applied, or list a contact address that no one reads; judging adequacy against a specific law belongs to a compliance reviewer. Labels are independent, so a notice can carry several or none. To find personal data inside a text rather than statements about it, use [`pii-presence`](../pii-presence/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo privacy-notice-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe privacy-notice-facets` to inspect the input and result schemas.
