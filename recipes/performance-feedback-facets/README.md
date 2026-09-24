# Label the aspects performance feedback addresses

<!-- BEGIN GENERATED: usage -->

Which aspects of a musical performance does feedback address: rhythm, pitch or intonation, dynamics, technique, and expression or phrasing?

Use when: You are building a practice app or lesson tool and want to know which musical aspects a piece of teacher or automated feedback covers, so you can track what a student hears about over time or flag feedback that neglects an aspect.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { performanceFeedbackFacets } from 'jev-recipes/performance-feedback-facets';

const result = await performanceFeedbackFacets({
  feedback:
    'Good work this week. The dotted eighths in bars 9 to 12 are still rushing, so put the metronome on and count the sixteenth underneath. The high F-sharp in bar 14 was flat every time; check it against the open E before you start. I liked the contrast between the quiet opening and the forte at the return of the theme, keep that.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo performance-feedback-facets`.

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
  "detected": ["mentionsRhythm", "mentionsPitch", "mentionsDynamics"],
  "labels": {
    "mentionsRhythm": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "mentionsPitch": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "mentionsDynamics": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.91,
      "confidence": 0.91
    },
    "mentionsTechnique": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.06,
      "confidence": 0.94
    },
    "mentionsExpression": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.08,
      "confidence": 0.92
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`feedback-actionability`](../feedback-actionability/README.md): Use feedback-actionability to grade whether the feedback tells the student what to do, rather than which aspects it covers.
- [`tone-check`](../tone-check/README.md): Use tone-check to judge whether feedback meets a tone requirement such as encouraging or direct.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `feedback`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `mentionsRhythm`, `mentionsPitch`, `mentionsDynamics`, `mentionsTechnique`, `mentionsExpression`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that an aspect is addressed, not that the comment is right, fair, or helpful: feedback can be wrong about a note being flat and still set the pitch label. The labels are independent and a general remark such as good work sets none of them, so short or vague feedback can come back with every label false. Tracking coverage over a term, deciding which aspects a lesson plan should hit, and evaluating the performance itself belong in application code or with the teacher.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo performance-feedback-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe performance-feedback-facets` to inspect the input and result schemas.
