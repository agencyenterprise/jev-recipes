# Check new evidence

Does passage add material information relevant to question beyond existingEvidence? New information may conflict with existing evidence; novelty alone is not correctness.

```ts
import { evidenceNovelty } from 'jev-recipes/evidence-novelty';

const result = await evidenceNovelty({
  question: 'How do I reset my password and when does the link expire?',
  passage: 'Reset links expire after 30 minutes.',
  existingEvidence: [
    {
      id: 'steps',
      text: 'Select Forgot password to receive a reset link.',
    },
  ],
});

console.log(result.status, result.verdict);
```

## Input

| Field              | Accepts                                      |
| ------------------ | -------------------------------------------- |
| `passage`          | Non-empty text                               |
| `existingEvidence` | 1 to 50 `{ id, text }` items with unique IDs |
| `question`         | Non-empty text                               |
| `minConfidence`    | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict               | Meaning                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `adds_information`    | The passage adds a material relevant fact or distinction not already represented. |
| `repeats_information` | It only repeats information already represented.                                  |
| `irrelevant`          | It contributes no information relevant to the question.                           |
| `unclear`             | Its contribution cannot be determined from the supplied material.                 |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses novelty within the supplied set. It does not establish correctness or decide when retrieval must stop.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo evidence-novelty` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe evidence-novelty` shows the input and result schemas.
