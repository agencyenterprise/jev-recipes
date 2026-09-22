# Check workaround fit

<!-- BEGIN GENERATED: usage -->

Can workaround address issue without violating constraints?

Use when: You need to check whether a workaround addresses an issue within the stated constraints.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { workaroundFit } from 'jev-recipes/workaround-fit';

const result = await workaroundFit({
  issue: 'The desktop application cannot open a report.',
  workaround: 'Open the report in the web application.',
  constraints: 'The customer has web access and needs only to view the report.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo workaround-fit`.

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
    "conflicts": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`troubleshooting-fit`](../troubleshooting-fit/README.md): Use troubleshooting-fit to assess a diagnostic procedure rather than a workaround.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `issue`         | Yes      | string                       |
| `workaround`    | Yes      | string                       |
| `constraints`   | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                               |
| ----------- | ------------------------------------------------------------------------------------- |
| `fits`      | The described workaround addresses the issue and satisfies the stated constraints.    |
| `conflicts` | The workaround contradicts a stated constraint or cannot address the described issue. |
| `unclear`   | A needed prerequisite or effect is not established.                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses described compatibility. It does not establish operational safety, execute a workaround, or grant access.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo workaround-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe workaround-fit` shows the input and result schemas.
