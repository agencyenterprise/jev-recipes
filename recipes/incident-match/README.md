# Match a known incident

Which supplied incident is supported as a match for ticket? Require compatible affected functionality and supplied scope. Shared words alone are insufficient.

```ts
import { incidentMatch } from 'jev-recipes/incident-match';

const result = await incidentMatch({
  ticket: 'Workspace exports fail with EXPORT_TIMEOUT.',
  incidents: [
    {
      id: 'exports',
      text: 'Active incident: workspace exports fail with EXPORT_TIMEOUT.',
    },
    {
      id: 'billing',
      text: 'Active incident: invoices appear with a delay.',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `ticket`        | Non-empty text                               |
| `incidents`     | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`verdict` is `matched`, `none`, or `ambiguous`. A confident match returns the original item ID in `selection`. A low-confidence match keeps that ID only in `suggestedSelection`. `none` returns a null selection and can be `ready`; `ambiguous` always requires review. Probabilities are grouped under `candidates` by your original IDs, plus `none` and `ambiguous`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared candidate-selection helper. This folder owns its selection question and input schema. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Matches only incidents supplied by the caller. Filter incident status, dates, affected regions, and exact versions in code first.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo incident-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe incident-match` shows the input and result schemas.
