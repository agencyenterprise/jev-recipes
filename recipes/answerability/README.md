# Check answerability

Decide whether the supplied evidence can answer an entire question before drafting a response.

```ts
import { answerability } from 'jev-recipes/answerability';

const result = await answerability({
  question: 'How do I reset my password, and when does the link expire?',
  evidence: [
    {
      id: 'reset',
      text: 'Select Forgot password. Reset links expire after 30 minutes.',
    },
  ],
});

console.log(result.canAnswer);
```

## Input

| Field           | Accepts                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| `question`      | Non-empty text containing the question                                       |
| `evidence`      | 1 to 50 `{ id, text }` passages with unique non-empty IDs and non-empty text |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8                                 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Verdict        | Meaning                                                   |
| -------------- | --------------------------------------------------------- |
| `sufficient`   | The evidence answers every material part of the question. |
| `partial`      | Some material parts can be answered, but others cannot.   |
| `insufficient` | No material part can be answered.                         |
| `conflicting`  | Incompatible evidence prevents a consistent answer.       |

`canAnswer` is true only when the verdict is `sufficient` and confidence reaches `minConfidence`. `status` is `ready` at or above that threshold, otherwise `review`. A ready assessment can still describe partial, insufficient, or conflicting evidence. The result includes confidence and all choice probabilities.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared choice helper. This folder owns the evidence-sufficiency criteria and the can-answer decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Handle empty retrieval in application code before calling. This recipe does not establish source truth, draft an answer, or guarantee a later draft uses the evidence correctly. Use verify on drafted claims and answer-coverage on supplied question parts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answerability` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe answerability` to inspect the input and result schemas.
