# Check summary coverage

Check whether a summary preserves each supplied point.

```ts
import { summaryCoverage } from 'jev-recipes/summary-coverage';

const result = await summaryCoverage({
  summary: 'We agreed to keep the API unchanged.',
  points: [
    {
      id: 'api',
      text: 'Keep the public API unchanged.',
    },
    {
      id: 'docs',
      text: 'Update the installation instructions.',
    },
  ],
});

console.log(result.status, result.checks);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `summary`       | Non-empty text                               |
| `points`        | 1 to 50 `{ id, text }` items with unique IDs |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allPreserved` is true only when every check is ready and has verdict `preserved`. Any uncertain check makes overall status `review`.

| Verdict     | Meaning                                                                  |
| ----------- | ------------------------------------------------------------------------ |
| `preserved` | The full material meaning of this point is retained.                     |
| `partial`   | Some meaning is retained but a material detail or constraint is missing. |
| `missing`   | This point is absent or its meaning is reversed.                         |
| `unclear`   | The summary is too ambiguous to establish coverage.                      |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks the points you supply. It does not select important points from a transcript or detect unrelated invented statements.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo summary-coverage` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe summary-coverage` shows the input and result schemas.
