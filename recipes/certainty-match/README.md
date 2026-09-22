# Check certainty wording

Does the certainty expressed in draft match assessment? Treat assessment as the supplied evidence assessment and do not independently re-evaluate its truth.

```ts
import { certaintyMatch } from 'jev-recipes/certainty-match';

const result = await certaintyMatch({
  draft: 'The outage was definitely caused by the deploy.',
  assessment: 'The deploy is one possible cause; the cause has not been established.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `draft`         | Non-empty text                               |
| `assessment`    | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `overstated`  | The draft expresses stronger certainty than the assessment supports.          |
| `appropriate` | The draft expresses a degree of certainty consistent with the assessment.     |
| `understated` | The draft expresses materially weaker certainty than the assessment supports. |
| `unclear`     | The certainty levels cannot be compared from the supplied wording.            |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares wording with a supplied assessment. It does not calibrate probabilities or establish the assessment itself.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo certainty-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe certainty-match` shows the input and result schemas.
