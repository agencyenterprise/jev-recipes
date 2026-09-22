# Check required information

Identify which supplied requirements are present, missing, or ambiguous in a request and its context.

```ts
import { clarify } from 'jev-recipes/clarify';

const result = await clarify({
  request: 'Please cancel it.',
  context: 'The customer has a storage subscription and a pending hardware order.',
  requirements: [
    {
      id: 'target',
      description: 'Which product or order should be changed',
    },
    {
      id: 'action',
      description: 'What change the customer wants',
    },
  ],
});

console.log(result.canProceed);
```

## Input

| Field           | Accepts                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `request`       | Non-empty text containing the request                                                    |
| `context`       | Optional non-empty conversation context or application facts                             |
| `requirements`  | 1 to 50 `{ id, description }` items with unique non-empty IDs and non-empty descriptions |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8                                             |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Verdict     | Meaning                                                                     |
| ----------- | --------------------------------------------------------------------------- |
| `present`   | The required information is explicit or unambiguously implied.              |
| `missing`   | The required information is absent.                                         |
| `ambiguous` | Relevant information has multiple plausible meanings or conflicting values. |

`checks` preserves each requirement ID with its verdict, status, confidence, and probabilities. A check is ready when its confidence reaches `minConfidence`. Overall `status` is `review` if any check falls below the threshold.

`canProceed` is true only when every check is ready and present. `missing` and `ambiguous` contain confidently classified requirement IDs. A confident ambiguity assessment can be ready while `canProceed` remains false. Low-confidence checks also block proceeding, even if both ID lists are empty.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared item-check helper. This folder owns the requirement criteria, follow-up ID lists, and can-proceed decision. All requirement questions are sent in one request. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Your application supplies the requirements and maps their IDs to follow-up questions. The recipe does not discover requirements, generate questions, validate identity, or enforce exact field formats.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo clarify` shows an offline illustration, not an accuracy measurement. Use `npm run jev -- describe clarify` to inspect the input and result schemas.
