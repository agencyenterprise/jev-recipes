# Match claims to citations

<!-- BEGIN GENERATED: usage -->

Find supplied passages that independently support an entire claim.

Use when: You want to find which supplied passages support an entire claim.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { citationMatch } from 'jev-recipes/citation-match';

const result = await citationMatch({
  claim: 'Reset links expire after 30 minutes.',
  passages: [
    { id: 'reset', text: 'Password reset links expire after 30 minutes.' },
    { id: 'billing', text: 'Invoices are available on the Billing page.' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo citation-match`.

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
  "passageIds": ["reset"],
  "checks": [
    {
      "id": "reset",
      "status": "ready",
      "verdict": "supported",
      "confidence": 0.96,
      "probabilities": {
        "supported": 1,
        "contradicted": 0,
        "unsupported": 0
      }
    },
    {
      "id": "billing",
      "status": "ready",
      "verdict": "unsupported",
      "confidence": 0.96,
      "probabilities": {
        "supported": 0,
        "contradicted": 0,
        "unsupported": 1
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`verify`](../verify/README.md): Use verify when each claim already has its own paired evidence.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `claim`         | Yes      | string                                             |
| `passages`      | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`passageIds` contains every passage that independently supports the entire claim at or above the confidence threshold. `checks` preserves the verification result for each passage. If any passage qualifies, overall status is `ready`, even if other checks need review. With no qualifying passage, uncertainty produces `review`; otherwise a confident no-match returns `ready` with an empty list.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the public [`verify`](../verify/README.md) recipe once, with one claim/evidence pair per passage. It adds selection of confidently supported passage IDs. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Returns passages that independently support the entire claim. Joint support across several individually incomplete passages is not assessed.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo citation-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe citation-match` shows the input and result schemas.
