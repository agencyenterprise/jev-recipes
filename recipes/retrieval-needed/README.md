# Check whether retrieval is needed

Does request require facts beyond context? A request to transform or summarize supplied material does not need outside facts unless the request explicitly asks for them.

```ts
import { retrievalNeeded } from 'jev-recipes/retrieval-needed';

const result = await retrievalNeeded({
  request: 'Summarize this policy in one sentence.',
  context: 'Customers may cancel their subscription from Account settings.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `request`       | Non-empty text                               |
| `context`       | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `needed`      | Answering the request requires information missing from the supplied context. |
| `unnecessary` | The requested work can be completed using only the supplied context.          |
| `unclear`     | The request is too ambiguous to establish its information needs.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses information needs without searching. A no-retrieval decision does not establish source truth.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo retrieval-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe retrieval-needed` shows the input and result schemas.
