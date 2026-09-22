# Check a cached answer

Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion? Do not assume freshness, access, tenant, or product compatibility beyond the supplied facts.

```ts
import { cacheMatch } from 'jev-recipes/cache-match';

const result = await cacheMatch({
  question: 'Where can I get my invoices?',
  originalQuestion: 'How do I download invoices?',
  cachedAnswer: 'Open Billing and select Download invoice.',
});

console.log(result.status, result.verdict);
```

## Input

| Field              | Accepts                                      |
| ------------------ | -------------------------------------------- |
| `question`         | Non-empty text                               |
| `originalQuestion` | Non-empty text                               |
| `cachedAnswer`     | Non-empty text                               |
| `context`          | Optional non-empty text                      |
| `minConfidence`    | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `reusable`   | The cached answer addresses the new question without a material mismatch in meaning or stated conditions. |
| `unsuitable` | The cached answer leaves a material part unanswered or applies to a different stated condition.           |
| `unclear`    | Missing or ambiguous conditions prevent establishing a match.                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Enforce tenant, permissions, version, and freshness checks in code before calling. A semantic match does not verify the cached answer.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo cache-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe cache-match` shows the input and result schemas.
