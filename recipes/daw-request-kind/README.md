# Classify a request to a music program

<!-- BEGIN GENERATED: usage -->

What does request ask a DAW or music program to do: record, edit, mix, apply an effect, arrange, export, or unclear?

Use when: You are building voice or chat control for a DAW, notation program, or recording app and need to route each spoken or typed request to the handler that owns that kind of operation.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { dawRequestKind } from 'jev-recipes/daw-request-kind';

const result = await dawRequestKind({
  request:
    'Quantize the drum track to sixteenth notes from bar 9 to bar 24, but leave the hi-hat lane alone.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo daw-request-kind`.

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
  "verdict": "edit",
  "confidence": 0.9,
  "probabilities": {
    "record": 0.01,
    "edit": 0.9,
    "mix": 0.02,
    "effect": 0.01,
    "arrange": 0.03,
    "export": 0,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route when the destinations are your own caller-defined list rather than this fixed set of music production operations.
- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify the conversational role of a turn, such as a question or a correction, rather than which production operation it asks for.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `record`, `edit`, `mix`, `effect`, `arrange`, `export`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label names the kind of operation, not its parameters: track names, bar ranges, values, and file formats still have to be extracted by a separate step before anything runs. Compound requests are classified by the operation pressed most, so a request to quantize and then bounce lands on one label and should be split in code when both steps matter. Whether the operation is possible in the current project, needs confirmation, or should be undoable is decided by the application, not by this label.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo daw-request-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe daw-request-kind` to inspect the input and result schemas.
