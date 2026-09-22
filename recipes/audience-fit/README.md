# Check audience fit

Does the level of explanation in document fit the knowledge and needs explicitly described in audience? Do not infer ability from demographic traits.

```ts
import { audienceFit } from 'jev-recipes/audience-fit';

const result = await audienceFit({
  document: 'Rotate the OAuth refresh token and invalidate the active session grant.',
  audience:
    'A customer unfamiliar with authentication terminology who wants to sign out of all devices.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `document`      | Non-empty text                               |
| `audience`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `appropriate`   | The terminology and explanation suit the described knowledge and needs.                          |
| `too_technical` | The document assumes knowledge the supplied audience description says is absent.                 |
| `too_basic`     | The document spends its explanation below the stated needs without supplying the required depth. |
| `unclear`       | The audience or explanation is not specified enough to judge.                                    |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Uses only the supplied audience description. It does not infer ability from identity or rewrite the document.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo audience-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe audience-fit` shows the input and result schemas.
