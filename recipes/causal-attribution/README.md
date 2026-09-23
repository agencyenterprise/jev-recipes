# Identify personal and situational explanations

<!-- BEGIN GENERATED: usage -->

Label whether an explanation attributes a specified behavior to the person, circumstances, both, or gives no cause.

Use when: You need to label whether an explanation points to the person, the situation, or both.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { causalAttribution } from 'jev-recipes/causal-attribution';

const result = await causalAttribution({
  behavior: 'Alex arrived late to the meeting.',
  explanation: 'Alex arrived late because the train was cancelled.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo causal-attribution`.

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
  "verdict": "situational",
  "confidence": 0.96,
  "probabilities": {
    "personal": 0.01,
    "situational": 0.96,
    "mixed": 0.01,
    "none": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`attribution-match`](../attribution-match/README.md): Use attribution-match to check who made or endorsed a statement, rather than what kind of cause it gives.
- [`motivation-source`](../motivation-source/README.md): Use motivation-source to distinguish enjoyment of an activity from pursuing a separate outcome in a stated reason.
- [`verify`](../verify/README.md): Use verify to assess supplied evidence for a causal claim; causal-attribution does not establish causation.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `behavior`      | Yes      | string                       |
| `explanation`   | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply one `behavior` identifying the focal actor and an `explanation` of it. Optional `context` resolves identities or references. The actor is the person whose behavior is explained, which may differ from the speaker or a person named in the cause.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `personal`    | The explanation points to the focal actor's properties, choices, effort, motives, or internal state. |
| `situational` | The explanation points to circumstances outside the focal actor.                                     |
| `mixed`       | Both kinds of cause are offered as contributing factors.                                             |
| `none`        | The behavior is clear, but no cause is offered.                                                      |
| `unclear`     | References, alternatives, contradictions, or scope prevent classification.                           |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence with a zero threshold. Other verdicts, including the absence of a frame or reason, can be ready. Confidence describes the annotation decision, not the strength of a psychological effect.

## Decision boundaries

These are authored policy examples, not human-adjudicated labels or measured model accuracy. Unless noted, the focal behavior is Alex arriving late to a meeting.

| Supplied wording                                                                                                                 | Intended verdict |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| "Alex was late because Alex did not make an effort to leave on time."                                                            | `personal`       |
| "Alex was late because the train was cancelled."                                                                                 | `situational`    |
| "Alex was late because of both poor planning and a cancelled train."                                                             | `mixed`          |
| "Either Alex forgot or the train was cancelled; I do not know which."                                                            | `unclear`        |
| "Alex was late because Alex felt anxious about the meeting." A temporary internal state still counts as personal.                | `personal`       |
| "Alex was late because Sam gave Alex the wrong start time." Sam is outside the focal actor.                                      | `situational`    |
| "It was the train cancellation, not laziness, that made Alex late."                                                              | `situational`    |
| "Alex was late. I do not know why."                                                                                              | `none`           |
| "Alex was not late because of laziness." No alternative cause is offered.                                                        | `none`           |
| "Sam said Alex was late because Alex forgot." Labels Sam's reported explanation without attributing endorsement to the reporter. | `personal`       |
| "They did it because of them." Identities and behavior are unresolved.                                                           | `unclear`        |

## Reuse

Use this to annotate explanations in interviews or model responses. [Attribution-match](../attribution-match/README.md) checks who made a statement; this recipe classifies the type of cause that statement offers. [Motivation-source](../motivation-source/README.md) distinguishes enjoyment of an activity from pursuing a separate outcome.

For example, a person's stated intention to earn a prize may be a personal explanation here and an extrinsic reason in motivation-source. The recipes answer different questions.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or take application actions. Find related tools in [Psychology & behavior](../README.md#psychology--behavior).

## Concept and validation

The `personal` label follows the [APA definition of dispositional attribution](https://dictionary.apa.org/dispositional-attribution), which includes temporary states and effort as well as traits. `Situational` uses the external-circumstance side of [attribution theory](https://dictionary.apa.org/attribution-theory). These are annotation categories, not conclusions about the actor.

For research use, validate the labels against independent human annotations on your inputs. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation and controlled comparisons.

## Limits

- A personal attribution does not establish an actual trait, intent, fault, or attribution error.
- The label does not prove causation or assess whether the explanation is supported by evidence.
- Mixed means both causes are offered together. Unresolved either/or explanations require review.
