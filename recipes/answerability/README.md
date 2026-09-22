# Answerability

Decide whether supplied evidence can answer an entire question before generating a response.

```ts
import { answerability } from 'jev-recipes/answerability';

const result = await answerability({
  question: 'How do I reset my password, and when does the link expire?',
  evidence: [{ id: 'reset', text: 'Select Forgot password. Reset links expire after 30 minutes.' }],
});

if (result.canAnswer) console.log('Evidence is sufficient for drafting.');
```

Provide 1 to 50 passages with unique, non-empty IDs. Handle empty retrieval in your application before calling this recipe. `minConfidence` defaults to `0.8`.

| Verdict        | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| `sufficient`   | Every material part of the question can be answered.    |
| `partial`      | Some material parts can be answered, but others cannot. |
| `insufficient` | No material part can be answered.                       |
| `conflicting`  | Incompatible evidence prevents a consistent answer.     |

`canAnswer` is true only for `sufficient` at or above the confidence threshold. `status: "ready"` means the assessment passed the threshold; it can still describe insufficient or conflicting evidence. Below the threshold, `status` is `review` and `canAnswer` is false.

The result includes the verdict, confidence, all choice probabilities, model, and token usage. The recipe assesses only supplied evidence. It does not verify source truth, generate an answer, or guarantee that a later draft uses the evidence correctly. Use `verify` on that draft's claims.

Run `npm run jev -- demo answerability` for the hand-authored offline [fixture](demo.json). Fixtures exercise decision handling; they do not measure accuracy. Calibrate thresholds with your own labeled examples.
