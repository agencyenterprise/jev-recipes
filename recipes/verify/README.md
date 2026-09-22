# Verify claims

Check whether each supplied claim is supported by its paired evidence. Every pair is evaluated independently.

```ts
import { verify } from 'jev-recipes/verify';

const result = await verify({
  claims: [
    {
      id: 'guest-export',
      claim: 'Guests can export reports.',
      evidence: 'Only workspace owners can export reports. Guests cannot export.',
    },
  ],
});

console.log(result.checks);
```

## Input

| Field           | Accepts                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `claims`        | 1 to 100 `{ id, claim, evidence }` items with unique non-empty IDs and non-empty claim and evidence text |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8                                                             |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`checks` preserves each claim ID and returns its verdict, status, confidence, and choice probabilities.

| Verdict        | Meaning                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `supported`    | The paired evidence supports the entire claim.                                 |
| `contradicted` | The paired evidence establishes something incompatible with the claim.         |
| `unsupported`  | The paired evidence is insufficient to support or contradict the entire claim. |

Each check is `ready` at or above `minConfidence`, otherwise `review`. A ready check can still be contradicted or unsupported. `allSupported` is true only when every check is ready and supported. Read individual check statuses; the result has no top-level status.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared item-check helper. This folder owns the evidence criteria and the all-supported decision. All claim questions are sent in one request. The citation-match recipe calls this public function to select supporting passages. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Checks only supplied claim/evidence pairs. It does not extract claims, retrieve sources, establish source truth, or check whether an answer addresses every requested point. Exact arithmetic and date comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo verify` shows an offline illustration, not an accuracy measurement. Use `npm run jev -- describe verify` to inspect the input and result schemas.
