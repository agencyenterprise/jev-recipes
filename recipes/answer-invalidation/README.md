# Check an answer after a source change

<!-- BEGIN GENERATED: usage -->

Does updatedEvidence still support the entire claim that was based on previousEvidence?

Use when: You need to check whether updated evidence still supports a previously supported claim.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerInvalidation } from 'jev-recipes/answer-invalidation';

const result = await answerInvalidation({
  claim: 'Guests can export reports.',
  previousEvidence: 'Guests can export reports.',
  updatedEvidence: 'Exporting reports is restricted to workspace owners. Guests cannot export.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-invalidation`.

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
  "verdict": "invalidated",
  "confidence": 0.96,
  "probabilities": {
    "still_supported": 0,
    "invalidated": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`cache-match`](../cache-match/README.md): Use cache-match to check reuse for a new question when evidence has not changed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field              | Required | Shape                        |
| ------------------ | -------- | ---------------------------- |
| `claim`            | Yes      | string                       |
| `previousEvidence` | Yes      | string                       |
| `updatedEvidence`  | Yes      | string                       |
| `minConfidence`    | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `still_supported` | The updated evidence supports the entire claim.                                                                 |
| `invalidated`     | The previous evidence supported the claim, but the updated evidence contradicts it or removes required support. |
| `unclear`         | Previous support or the effect of the new evidence cannot be established.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses one supplied claim and source revision. It does not monitor changes, compare release dates, or invalidate a cache automatically.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-invalidation` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-invalidation` shows the input and result schemas.
