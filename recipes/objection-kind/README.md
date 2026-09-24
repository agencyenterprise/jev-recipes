# Classify sales objection kind

<!-- BEGIN GENERATED: usage -->

What primary sales objection does message raise?

Use when: You need to tag prospect replies by objection so reps get the right playbook and pipeline reports show why deals stall.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { objectionKind } from 'jev-recipes/objection-kind';

const result = await objectionKind({
  message:
    "Thanks for the proposal. Honestly the numbers came in well above what we budgeted for this year, so unless there is room to move on the per-seat rate I don't think we can make it work.",
  context: 'Reply from a prospect after receiving a quote for 25 seats.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo objection-kind`.

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
  "verdict": "price",
  "confidence": 0.9,
  "probabilities": {
    "price": 0.9,
    "timing": 0.05,
    "authority": 0.01,
    "need": 0.01,
    "trust": 0.01,
    "competitor": 0.01,
    "none": 0,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`feedback-kind`](../feedback-kind/README.md): Use feedback-kind to classify general product or service feedback from existing users.
- [`constraint-strength`](../constraint-strength/README.md): Use constraint-strength to grade how binding a stated requirement or limit is.

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

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. `context` is optional and is omitted from the request when absent.

## Result

| Verdict      | Meaning                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `price`      | The sender objects to the cost, budget, or value for money.                                    |
| `timing`     | The sender is not ready to proceed now and cites the timing or other priorities.               |
| `authority`  | The sender says someone else must decide or approve before proceeding.                         |
| `need`       | The sender does not see a need for the product or believes the current approach is sufficient. |
| `trust`      | The sender doubts the vendor, the product, or the claims made about it.                        |
| `competitor` | The sender prefers or is already using an alternative product or vendor.                       |
| `none`       | The message raises no objection to proceeding.                                                 |
| `unclear`    | The primary objection is not established by the supplied text.                                 |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts, including `none`, can be ready.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies the primary objection the message states, not whether it is genuine or surmountable. A reply that mixes objections, such as a price concern that also defers to a manager, is graded by the one it leads with. Stated reasons can mask other reasons, and a `none` verdict means no objection was raised, not that the prospect agreed. Playbook selection and stage changes belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo objection-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe objection-kind` shows the input and result schemas.
