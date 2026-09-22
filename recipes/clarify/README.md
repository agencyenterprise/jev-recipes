# Check required information

<!-- BEGIN GENERATED: usage -->

Identify missing or ambiguous information before proceeding.

Use when: You need to check for missing or ambiguous requirements before proceeding.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { clarify } from 'jev-recipes/clarify';

const result = await clarify({
  request: 'Please cancel it.',
  context: 'The customer has a monthly storage subscription and a pending hardware order.',
  requirements: [
    { id: 'target', description: 'Which product or order should be changed' },
    { id: 'action', description: 'What change the customer wants' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo clarify`.

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
  "canProceed": false,
  "missing": [],
  "ambiguous": ["target"],
  "checks": [
    {
      "id": "target",
      "status": "ready",
      "verdict": "ambiguous",
      "confidence": 0.96,
      "probabilities": {
        "present": 0.015,
        "missing": 0.015,
        "ambiguous": 0.97
      }
    },
    {
      "id": "action",
      "status": "ready",
      "verdict": "present",
      "confidence": 0.96,
      "probabilities": {
        "present": 0.97,
        "missing": 0.015,
        "ambiguous": 0.015
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`query-specificity`](../query-specificity/README.md): Use query-specificity to assess how focused the question is, without a requirements list.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                                     |
| --------------- | -------- | --------------------------------------------------------- |
| `request`       | Yes      | string                                                    |
| `context`       | No       | string                                                    |
| `requirements`  | Yes      | { id, description }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                              |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Verdict     | Meaning                                                                     |
| ----------- | --------------------------------------------------------------------------- |
| `present`   | The required information is explicit or unambiguously implied.              |
| `missing`   | The required information is absent.                                         |
| `ambiguous` | Relevant information has multiple plausible meanings or conflicting values. |

`checks` preserves each requirement ID with its verdict, status, confidence, and probabilities. A check is ready when its confidence reaches `minConfidence`. Overall `status` is `review` if any check falls below the threshold.

`canProceed` is true only when every check is ready and present. `missing` and `ambiguous` contain confidently classified requirement IDs. A confident ambiguity assessment can be ready while `canProceed` remains false. Low-confidence checks also block proceeding, even if both ID lists are empty.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared item-check helper. This folder owns the requirement criteria, follow-up ID lists, and can-proceed decision. All requirement questions are sent in one request. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Your application supplies the requirements and maps their IDs to follow-up questions. The recipe does not discover requirements, generate questions, validate identity, or enforce exact field formats.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo clarify` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe clarify` to inspect the input and result schemas.
