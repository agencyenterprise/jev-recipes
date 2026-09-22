# Check troubleshooting applicability

Does procedure address symptoms under the described circumstances? Match the procedure's stated purpose and prerequisites, without inventing a diagnosis.

```ts
import { troubleshootingFit } from 'jev-recipes/troubleshooting-fit';

const result = await troubleshootingFit({
  symptoms: 'The customer forgot their password and cannot sign in.',
  procedure: 'For forgotten passwords, use Forgot password on the sign-in page.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `symptoms`      | Non-empty text                               |
| `procedure`     | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                           |
| ------------ | --------------------------------------------------------------------------------- |
| `applicable` | The procedure covers the described symptoms and its stated prerequisites are met. |
| `unsuitable` | The procedure concerns different symptoms or incompatible prerequisites.          |
| `unclear`    | The symptoms or prerequisites are insufficiently specified.                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied procedure; it does not diagnose a root cause, generate steps, or execute them.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo troubleshooting-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe troubleshooting-fit` shows the input and result schemas.
