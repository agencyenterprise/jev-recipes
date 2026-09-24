# Label the symptom facets a patient message states

<!-- BEGIN GENERATED: usage -->

Which of these does message state about a symptom: when it began, how bad it is, how long it has lasted, what makes it better or worse, what the patient has already tried?

Use when: You need to know which standard intake details a patient message already supplies so you can pre-fill a form or ask only for what is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { symptomFacets } from 'jev-recipes/symptom-facets';

const result = await symptomFacets({
  message:
    'My lower back started hurting on Saturday after I moved some boxes, so it has been about five days now. It gets worse when I sit for a long time and eases up when I walk around. I have been taking ibuprofen twice a day and using a heating pad at night, but it is not really improving. Should I come in?',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo symptom-facets`.

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
  "detected": ["statesOnset", "statesDuration", "statesModifiers", "statesPriorTreatment"],
  "labels": {
    "statesOnset": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesSeverity": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    },
    "statesDuration": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesModifiers": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesPriorTreatment": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`message-facets`](../message-facets/README.md): Use message-facets for the general communicative facets of a message, such as questions, deadlines, and requests.
- [`clarify`](../clarify/README.md): Use clarify to decide whether to ask the patient a follow-up question about the facets this recipe finds missing.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesOnset`, `statesSeverity`, `statesDuration`, `statesModifiers`, `statesPriorTreatment`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet reports only that the patient's wording states it; a message that says "since Tuesday" counts as stating onset whether or not that date is plausible. The recipe makes no clinical judgment: it does not assess what the symptoms suggest, whether the stated severity is concerning, or whether the prior treatment was appropriate. Parse the actual dates, durations, and doses in application code, and route any clinical decision through your clinical protocol. To decide whether to ask the patient about a missing facet, use [`clarify`](../clarify/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo symptom-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe symptom-facets` to inspect the input and result schemas.
