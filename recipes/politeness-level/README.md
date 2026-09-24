# Grade expressed politeness

<!-- BEGIN GENERATED: usage -->

How polite is the wording of message toward its recipient, on a five-level rubric?

Use when: You need a graded politeness signal to adapt reply tone, flag hostile messages, or audit outgoing drafts.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { politenessLevel } from 'jev-recipes/politeness-level';

const result = await politenessLevel({
  message:
    'Hi Priya, thanks for turning this around so quickly. When you have a moment, could you also attach the updated invoice? No rush at all.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo politeness-level`.

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
  "score": 3.13,
  "level": 3,
  "confidence": 0.81,
  "probabilities": {
    "0": 0,
    "1": 0,
    "2": 0.03,
    "3": 0.81,
    "4": 0.16
  },
  "politeness": "courteous"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tone-check`](../tone-check/README.md): Use tone-check to verify a draft matches a specified tone rather than grading politeness.
- [`frustration-signal`](../frustration-signal/README.md): Use frustration-signal for a categorical read on expressed frustration.

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

`politeness` is one of `hostile`, `curt`, `neutral`, `courteous`, or `deferential`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to trend tone across a thread or to flag drafts below a threshold.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the politeness question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reads the wording of one message toward its recipient. It does not know the writer's attitude, the relationship between the parties, or how the recipient will take it. Politeness norms vary by culture, language, and register, and the rubric reflects general written conventions, so a terse message between close colleagues can grade `curt` without being rude in practice. Supply `context` to describe the setting. Use [`tone-check`](../tone-check/README.md) when you need to verify a draft against a specified tone.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo politeness-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe politeness-level` to inspect the input and result schemas.
