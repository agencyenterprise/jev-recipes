# Compare support tickets

<!-- BEGIN GENERATED: usage -->

Do firstTicket and secondTicket describe the same underlying reported issue?

Use when: You want to check whether two tickets describe the same underlying issue.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { ticketMatch } from 'jev-recipes/ticket-match';

const result = await ticketMatch({
  firstTicket: 'My workspace export fails with error EXPORT_TIMEOUT.',
  secondTicket: 'Exports also time out with EXPORT_TIMEOUT in another workspace.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo ticket-match`.

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
  "verdict": "related",
  "confidence": 0.96,
  "probabilities": {
    "same_issue": 0,
    "related": 1,
    "different": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`incident-match`](../incident-match/README.md): Use incident-match to select a known incident for one ticket.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstTicket`   | Yes      | string                       |
| `secondTicket`  | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                            |
| ------------ | ---------------------------------------------------------------------------------- |
| `same_issue` | The reports contain enough shared identifying context to establish the same issue. |
| `related`    | The reports share symptoms or a subject but do not establish the same issue.       |
| `different`  | The reports describe materially different issues.                                  |
| `unclear`    | The descriptions are insufficient to establish even their relationship.            |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not merge tickets or establish a shared root cause from similar symptoms alone. Compare exact identifiers in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo ticket-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe ticket-match` shows the input and result schemas.
