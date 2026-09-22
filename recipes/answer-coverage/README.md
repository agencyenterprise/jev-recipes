# Check answer coverage

Check whether a draft answers each supplied question.

```ts
import { answerCoverage } from 'jev-recipes/answer-coverage';

const result = await answerCoverage({
  draft: 'Select Forgot password on the sign-in page.',
  questions: [
    {
      id: 'reset',
      text: 'How do I reset my password?',
    },
    {
      id: 'expiry',
      text: 'When does the link expire?',
    },
  ],
});

console.log(result.status, result.checks);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `draft`         | Non-empty text                               |
| `questions`     | 1 to 50 `{ id, text }` items with unique IDs |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allAnswered` is true only when every check is ready and has verdict `answered`. Any uncertain check makes overall status `review`.

| Verdict    | Meaning                                                  |
| ---------- | -------------------------------------------------------- |
| `answered` | Every material part of this question is answered.        |
| `partial`  | Some material parts are answered but others are missing. |
| `missing`  | No substantive answer to this question appears.          |
| `unclear`  | The wording prevents a reliable coverage decision.       |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks supplied question IDs only. It does not extract questions or verify the draft against sources.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-coverage` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-coverage` shows the input and result schemas.
