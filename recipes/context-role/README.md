# Identify a passage role

What role does passage play in answering question? Classify its contribution without establishing whether its claims are true.

```ts
import { contextRole } from 'jev-recipes/context-role';

const result = await contextRole({
  question: 'How do I reset my password?',
  passage: 'Passwords help protect access to accounts.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `question`      | Non-empty text                               |
| `passage`       | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `direct_evidence` | The passage directly supplies information needed to answer the question.         |
| `background`      | The passage helps interpret the topic but does not directly answer the question. |
| `unrelated`       | The passage contributes neither an answer nor useful background.                 |
| `unclear`         | Its relationship to the question cannot be established.                          |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies a passage contribution. It does not rank sources or prove the answer is supported.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo context-role` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe context-role` shows the input and result schemas.
