# Label the facets of an instrument repair message

<!-- BEGIN GENERATED: usage -->

Which of these does message state about an instrument problem: the instrument and model, the symptom, when it started, recent changes, and the environment it is kept in?

Use when: You take in repair or support messages from players and want to know which standard intake details are already supplied so you can pre-fill a ticket or ask only for what is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { instrumentReportFacets } from 'jev-recipes/instrument-report-facets';

const result = await instrumentReportFacets({
  message:
    'Hi, I have a Martin D-18 (2019) and the B string has started buzzing on the 2nd and 3rd frets. Open it is fine. This began about ten days ago, right after I changed to a set of light-gauge phosphor bronze strings and lowered the saddle a little myself. I have not changed anything else. Can someone take a look?',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo instrument-report-facets`.

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
  "detected": ["statesInstrument", "statesSymptom", "statesOnset", "statesRecentChanges"],
  "labels": {
    "statesInstrument": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesSymptom": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesOnset": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesRecentChanges": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesEnvironment": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.05,
      "confidence": 0.95
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`symptom-facets`](../symptom-facets/README.md): Use symptom-facets for the analogous intake check on a patient's description of a medical symptom.
- [`bug-report-completeness`](../bug-report-completeness/README.md): Use bug-report-completeness for software bug reports, where the expected parts are reproduction steps, expected and actual behavior, and environment.

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

`labels` holds one check per label: `statesInstrument`, `statesSymptom`, `statesOnset`, `statesRecentChanges`, `statesEnvironment`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that a detail is stated, not that it is correct: a model name can be misremembered, a stated onset can be approximate, and a player may blame the wrong recent change. The labels are independent, so a message can name the instrument and symptom while saying nothing about onset or environment, and a single phrase such as since I changed strings is enough to set the recent-changes label. Diagnosing the cause, deciding whether a message with missing facets is accepted or bounced back with questions, and parsing dates, humidity figures, and model identifiers belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo instrument-report-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe instrument-report-facets` to inspect the input and result schemas.
