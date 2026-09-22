# Assess reported issue impact

What practical impact does message explicitly describe? Use the customer's described ability to work, not emotional intensity or the volume of complaints.

```ts
import { issueImpact } from 'jev-recipes/issue-impact';

const result = await issueImpact({
  message: 'I cannot sign in, so I cannot access any of my reports.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict    | Meaning                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `blocked`  | The customer reports being unable to perform the intended task with no described working alternative. |
| `degraded` | The task remains possible but with a meaningful limitation or workaround.                             |
| `cosmetic` | The reported problem concerns appearance without a described functional limitation.                   |
| `unclear`  | The practical impact is not established by the supplied report.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses reported impact, not verified system severity. Service commitments and escalation thresholds remain application rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo issue-impact` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe issue-impact` shows the input and result schemas.
