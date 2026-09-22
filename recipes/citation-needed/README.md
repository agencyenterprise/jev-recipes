# Check citation requirements

Do citationRules require evidence for statement? Apply the supplied rules rather than an unstated citation policy.

```ts
import { citationNeeded } from 'jev-recipes/citation-needed';

const result = await citationNeeded({
  statement: 'Reset links expire after 30 minutes.',
  citationRules:
    'Cite documentation for claims about product behavior. Greetings need no citations.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `statement`     | Non-empty text                               |
| `citationRules` | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `needed`      | The statement falls within a category requiring citation under the supplied rules.               |
| `unnecessary` | The supplied rules explicitly exempt this statement or clearly do not require a citation for it. |
| `unclear`     | The rules or statement do not establish whether a citation is required.                          |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied citation policy; does not find sources or determine whether a statement is true.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo citation-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe citation-needed` shows the input and result schemas.
