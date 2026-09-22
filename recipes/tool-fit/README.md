# Check a tool fit

<!-- BEGIN GENERATED: usage -->

Can the capabilities explicitly described in tool perform task?

Use when: You need to check whether a tool has the stated capability to perform a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { toolFit } from 'jev-recipes/tool-fit';

const result = await toolFit({
  task: 'Read the current incident status.',
  tool: 'Status reader: retrieves active incidents. It cannot create or modify incidents.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo tool-fit`.

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
  "verdict": "fits",
  "confidence": 0.96,
  "probabilities": {
    "fits": 1,
    "does_not_fit": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`argument-fit`](../argument-fit/README.md): Use argument-fit to validate the meaning of a proposed tool argument.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `tool`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict        | Meaning                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `fits`         | The described capabilities can perform the requested task.                 |
| `does_not_fit` | The described capabilities do not cover the task or explicitly exclude it. |
| `unclear`      | The capability description lacks facts needed to decide.                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied capability description. It does not discover tools, validate credentials, or grant permission.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo tool-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe tool-fit` shows the input and result schemas.
