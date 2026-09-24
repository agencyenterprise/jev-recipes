# Identify a persuasion technique

<!-- BEGIN GENERATED: usage -->

Which persuasion technique, if any, does the wording of message primarily use?

Use when: You need to annotate or flag how a message tries to persuade, for moderation, research, or review of outgoing drafts.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { persuasionTechnique } from 'jev-recipes/persuasion-technique';

const result = await persuasionTechnique({
  message:
    'Only 3 seats left at this price, and the offer closes at midnight tonight. Book now before they are gone.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo persuasion-technique`.

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
  "verdict": "scarcity",
  "confidence": 0.91,
  "probabilities": {
    "authority": 0,
    "scarcity": 0.91,
    "social_proof": 0.02,
    "reciprocity": 0,
    "emotional_appeal": 0.04,
    "none": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`motivation-source`](../motivation-source/README.md): Use motivation-source to classify a stated reason for acting rather than a technique aimed at a reader.
- [`question-leading`](../question-leading/README.md): Use question-leading to detect a question that steers toward a particular answer.

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

| Verdict            | Meaning                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `authority`        | The wording appeals to experts, credentials, official status, or institutional endorsement. |
| `scarcity`         | The wording stresses limited supply, limited time, or exclusivity.                          |
| `social_proof`     | The wording points to what many others do, choose, or approve of.                           |
| `reciprocity`      | The wording offers or recalls a favor, gift, or concession to prompt something in return.   |
| `emotional_appeal` | The wording relies on evoking fear, guilt, hope, pride, or another feeling.                 |
| `none`             | The wording informs or requests plainly without a persuasion technique.                     |
| `unclear`          | The wording is ambiguous between techniques or depends on context that is not supplied.     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including `none`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Labels expressed wording, not the writer's intent, honesty, or the effect on readers. A technique label is not a finding that the message is manipulative or false; citing a real expert is `authority` whether or not the claim holds. Messages that combine several techniques collapse to the dominant one or to `unclear`; the recipe does not return several labels. Use [`question-leading`](../question-leading/README.md) when the concern is a question that steers its answer.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo persuasion-technique` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe persuasion-technique` shows the input and result schemas.
