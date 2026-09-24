# Classify contract clause kind

<!-- BEGIN GENERATED: usage -->

What does clause primarily do?

Use when: You need to sort contract or policy clauses by what they do so obligations and prohibitions can be tracked separately from rights and definitions.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { clauseKind } from 'jev-recipes/clause-kind';

const result = await clauseKind({
  clause:
    'The Supplier shall deliver the Goods to the Delivery Address no later than thirty (30) days after receipt of a Purchase Order.',
  context: 'Clause 4.2 of a goods supply agreement between a manufacturer and a retailer.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo clause-kind`.

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
  "verdict": "obligation",
  "confidence": 0.92,
  "probabilities": {
    "obligation": 0.92,
    "right": 0.02,
    "prohibition": 0.01,
    "condition": 0.03,
    "definition": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`constraint-strength`](../constraint-strength/README.md): Use constraint-strength to grade how binding a single stated constraint is rather than what kind of clause it is.
- [`document-role`](../document-role/README.md): Use document-role to classify the purpose of a whole document rather than one clause.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `clause`        | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

| Verdict       | Meaning                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `obligation`  | The clause requires a party to do something.                                                                    |
| `right`       | The clause permits or entitles a party to do something.                                                         |
| `prohibition` | The clause forbids a party from doing something.                                                                |
| `condition`   | The clause makes something apply only if a stated circumstance occurs, without itself imposing the requirement. |
| `definition`  | The clause defines a term for use elsewhere in the document.                                                    |
| `unclear`     | The primary effect of the clause is not established by the supplied text.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

The recipe classifies what a clause does as written. It is not legal advice: it does not establish whether the clause is enforceable, which party it favors, or how a court would read it. A clause that mixes effects, such as an obligation with a carve-out, is graded by its primary effect; split compound clauses in code when each part matters. For how binding a single constraint is, use [`constraint-strength`](../constraint-strength/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo clause-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe clause-kind` shows the input and result schemas.
