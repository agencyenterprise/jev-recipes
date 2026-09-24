# Label what an official notice states

<!-- BEGIN GENERATED: usage -->

Which of these does notice state: an action the recipient must take, a deadline, the consequence of inaction, a contact for questions, a right to appeal?

Use when: You need several independent checks on a government or institutional notice in one call, to catch letters that tell recipients nothing about what to do, by when, or how to contest a decision before they are sent or when they are received.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { noticeFacets } from 'jev-recipes/notice-facets';

const result = await noticeFacets({
  notice:
    'County Housing Assistance Program\nNotice of Missing Documentation\n\nCase number: HA-2026-44817\n\nDear Ms. Okafor,\n\nWe are reviewing your application for rental assistance. To continue processing it, we need a copy of your most recent 30 days of pay stubs and a signed copy of your current lease.\n\nPlease submit these documents by October 10, 2026. You may upload them through the resident portal or bring them to our office at 300 Civic Center Drive, Suite 110, Monday through Friday, 8:30 AM to 4:30 PM.\n\nIf we do not receive the documents by that date, your application will be closed and you will need to reapply.\n\nIf you have questions, call your case worker, Daniel Ruiz, at (555) 014-2270.\n\nSincerely,\nCounty Housing Assistance Program',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo notice-facets`.

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
  "detected": ["statesAction", "statesDeadline", "statesConsequence", "statesContact"],
  "labels": {
    "statesAction": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.98,
      "confidence": 0.98
    },
    "statesDeadline": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesConsequence": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesContact": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesAppealRight": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.04,
      "confidence": 0.96
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`message-facets`](../message-facets/README.md): Use message-facets for the same presence-check pattern over a general message rather than an official notice.
- [`response-needed`](../response-needed/README.md): Use response-needed to decide whether a message requires a reply at all, rather than which elements a notice states.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `notice`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesAction`, `statesDeadline`, `statesConsequence`, `statesContact`, `statesAppealRight`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Every label is a presence check on the supplied text. A stated deadline or consequence is reported as present even if the date is wrong, the period is too short, or the consequence is not one the agency may impose, so compute dates and check them against program rules in code. Whether a notice must include an appeal right, and in what form, is a legal question for the program's rules, not something the label decides. The recipe does not judge readability or whether the recipient will understand the notice.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo notice-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe notice-facets` to inspect the input and result schemas.
