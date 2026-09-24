# Grade instruction clarity

<!-- BEGIN GENERATED: usage -->

How unambiguous is instruction for a delegate who has only context, on a five-level rubric?

Use when: You need to grade an instruction before sending it to a sub-agent or teammate, so an orchestrator can rewrite it or ask a question instead of letting the delegate guess.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { instructionClarity } from 'jev-recipes/instruction-clarity';

const result = await instructionClarity({
  instruction: 'Clean up the flaky tests in the payments module and make sure CI is green.',
  context:
    'The payments module has 214 tests across 18 files. Three tests were quarantined last week with a skip marker and a link to issue #882. CI currently fails on main because of an unrelated lint error in the docs build.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo instruction-clarity`.

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
  "score": 1.99,
  "level": 2,
  "confidence": 0.83,
  "probabilities": {
    "0": 0.01,
    "1": 0.08,
    "2": 0.83,
    "3": 0.07,
    "4": 0.01
  },
  "clarity": "gappy"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`query-specificity`](../query-specificity/README.md): Use query-specificity to grade how narrowly a search query pins down what is wanted, rather than how clearly an instruction directs work.
- [`clarify`](../clarify/README.md): Use clarify to list the specific questions a delegate would need answered when the instruction grades below clear.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `instruction`   | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`clarity` is one of `unusable`, `ambiguous`, `gappy`, `clear`, or `precise`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to decide whether to rewrite, ask, or send.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the clarity question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is taken from the delegate's point of view using only `instruction` and `context`. Knowledge the delegate has that is not written into `context` cannot raise the grade, and knowledge it lacks cannot lower it. The recipe reports how clear the instruction is, not whether the work it asks for is sensible or within the delegate's abilities. To enumerate the open questions behind a low grade, follow up with [`clarify`](../clarify/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo instruction-clarity` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe instruction-clarity` to inspect the input and result schemas.
