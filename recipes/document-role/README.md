# Identify document purpose

What is the primary purpose of document? Judge the actual content rather than a title alone. Choose unclear if several purposes are equally central.

```ts
import { documentRole } from 'jev-recipes/document-role';

const result = await documentRole({
  document:
    'New in this release: workspace exports now include archived reports. Fixed an invoice download error.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `document`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                        |
| ----------------- | -------------------------------------------------------------- |
| `policy`          | Defines rules, permissions, requirements, or allowed behavior. |
| `tutorial`        | Teaches a task through a guided sequence.                      |
| `reference`       | Describes interfaces, features, or facts for lookup.           |
| `troubleshooting` | Helps diagnose or resolve a described problem.                 |
| `release_note`    | Describes changes in a release or update.                      |
| `other`           | Has a clear purpose outside the listed roles.                  |
| `unclear`         | The primary role cannot be established.                        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Returns one primary role from the supplied text. It does not read files, split mixed documents, or create an index.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo document-role` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe document-role` shows the input and result schemas.
