# Check whether an issue returned

<!-- BEGIN GENERATED: usage -->

Label a reported issue as new, ongoing without resolution, or returned after reported recovery.

Use when: You need to distinguish a new problem, one that never stopped, and an issue that came back after recovery.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { issueRecurrence } from 'jev-recipes/issue-recurrence';

const result = await issueRecurrence({
  issue: 'CSV export fails with error E42.',
  message: 'The same E42 error is back when I export a CSV.',
  history:
    'Monday, customer: CSV exports fail with E42. Tuesday, customer: CSV exports work again; E42 is gone.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo issue-recurrence`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "ready",
  "verdict": "returned",
  "confidence": 0.97,
  "probabilities": {
    "new": 0.01,
    "ongoing": 0.01,
    "returned": 0.97,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`resolution-check`](../resolution-check/README.md): Use resolution-check to check whether the current message reports resolution.
- [`ticket-match`](../ticket-match/README.md): Use ticket-match to compare whether two reports concern the same underlying issue.
- [`repeated-attempt`](../repeated-attempt/README.md): Use repeated-attempt to check whether a proposed troubleshooting step repeats an earlier attempt.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `issue`         | Yes      | string                       |
| `message`       | Yes      | string                       |
| `history`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply one `issue` and the latest customer `message`. Optional `history` contains earlier reports, oldest first, with speaker identities and reported outcomes. A timeline already present in the latest message can be sufficient; empty history never establishes a first occurrence.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict    | Meaning                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `new`      | The customer explicitly reports a first occurrence, without conflicting history.                                |
| `ongoing`  | The customer reports that the issue persists and never recovered.                                               |
| `returned` | The same issue is active again after explicit customer-reported recovery.                                       |
| `unclear`  | The supplied reports cannot establish one state, concern a different issue, or do not report a current problem. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence and a zero threshold. `ready` describes the report classification, not verified system health.

## Decision boundaries

These cases document the intended policy, not measured model accuracy. Each concerns the same supplied CSV export error unless stated otherwise.

| Supplied reports                                                                                 | Intended verdict |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| Latest: "This is the first time CSV export has failed." No conflicting history.                  | `new`            |
| Latest: "CSV export is failing." No history.                                                     | `unclear`        |
| Latest: "It still fails. Export has never worked since I reported it."                           | `ongoing`        |
| Earlier customer: "Exports work again." Latest: "The same error is back."                        | `returned`       |
| Latest: "It worked yesterday after the failure, but the same error is back today."               | `returned`       |
| Latest: "It failed again." No evidence of intervening recovery.                                  | `unclear`        |
| Earlier support agent: "We deployed a fix." Latest customer: "It still fails and never stopped." | `ongoing`        |
| Earlier ticket status: closed. Latest: "The error is back." No customer-reported recovery.       | `unclear`        |
| Earlier customer: "Works now." Latest: "I was mistaken; it never stopped failing."               | `ongoing`        |
| Latest: "First time this happened." History reports earlier occurrences with no correction.      | `unclear`        |
| Latest: "Export is working now." No current problem is reported.                                 | `unclear`        |
| Export previously recovered; the latest report concerns a login error.                           | `unclear`        |

## Reuse

Use this when deciding how to describe a customer's current issue in a support workflow. Your application can treat an unresolved issue differently from one that returned after apparent recovery.

Use [resolution-check](../resolution-check/README.md) when the question is whether the latest message reports resolution. Use [ticket-match](../ticket-match/README.md) to compare two reports before assuming they concern the same issue.

Uses the shared choice helper and makes one logical Jev request. It does not fetch ticket history, call another recipe, reopen tickets, or execute troubleshooting steps.

## Limits

- An attempted fix, deployment, closed ticket, provider assurance, or courtesy message does not establish recovery.
- Reports can be incomplete or mistaken. The recipe does not verify system state or prove a shared root cause.
- Supply chronology explicitly. Conflicting or incomplete reports can require review even at high confidence.
