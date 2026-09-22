# Check new evidence

<!-- BEGIN GENERATED: usage -->

Does passage add material information relevant to question beyond existingEvidence?

Use when: You need to decide whether a new passage adds useful information to existing evidence.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { evidenceNovelty } from 'jev-recipes/evidence-novelty';

const result = await evidenceNovelty({
  question: 'How do I reset my password and when does the link expire?',
  passage: 'Reset links expire after 30 minutes.',
  existingEvidence: [{ id: 'steps', text: 'Select Forgot password to receive a reset link.' }],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo evidence-novelty`.

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
  "verdict": "adds_information",
  "confidence": 0.96,
  "probabilities": {
    "adds_information": 1,
    "repeats_information": 0,
    "irrelevant": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`passage-duplicate`](../passage-duplicate/README.md): Use passage-duplicate to compare overlap between two passages.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field              | Required | Shape                                              |
| ------------------ | -------- | -------------------------------------------------- |
| `passage`          | Yes      | string                                             |
| `existingEvidence` | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `question`         | Yes      | string                                             |
| `minConfidence`    | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict               | Meaning                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `adds_information`    | The passage adds a material relevant fact or distinction not already represented. |
| `repeats_information` | It only repeats information already represented.                                  |
| `irrelevant`          | It contributes no information relevant to the question.                           |
| `unclear`             | Its contribution cannot be determined from the supplied material.                 |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses novelty within the supplied set. It does not establish correctness or decide when retrieval must stop.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo evidence-novelty` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe evidence-novelty` shows the input and result schemas.
