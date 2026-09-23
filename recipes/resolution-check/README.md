# Check reported resolution

<!-- BEGIN GENERATED: usage -->

Does message establish that the customer reports issue as resolved?

Use when: You need to know whether the customer reports that an issue is resolved.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { resolutionCheck } from 'jev-recipes/resolution-check';

const result = await resolutionCheck({
  issue: 'The customer cannot sign in.',
  message: 'The reset worked. I can sign in now.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo resolution-check`.

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
  "verdict": "resolved",
  "confidence": 0.96,
  "probabilities": {
    "resolved": 1,
    "unresolved": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`issue-recurrence`](../issue-recurrence/README.md): Use issue-recurrence to distinguish a first occurrence, an ongoing issue, and a return after reported recovery.
- [`step-complete`](../step-complete/README.md): Use step-complete to assess evidence against a supplied completion condition.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `issue`         | Yes      | string                       |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `resolved`   | The customer clearly reports this issue is solved or the desired outcome now works. |
| `unresolved` | The customer clearly reports this issue persists or the attempted fix failed.       |
| `unclear`    | The message does not establish whether this issue is resolved.                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets the customer report. It does not verify the system state, close a ticket, or treat courtesy alone as resolution.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo resolution-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe resolution-check` shows the input and result schemas.
