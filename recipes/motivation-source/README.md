# Identify a stated source of motivation

<!-- BEGIN GENERATED: usage -->

Label a stated reason for an activity as intrinsic enjoyment, a separate outcome, both, or not stated.

Use when: You need to classify a stated reason for an activity as enjoyment of doing it or pursuit of a separate outcome.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { motivationSource } from 'jev-recipes/motivation-source';

const result = await motivationSource({
  activity: 'Alex solves puzzles.',
  statement: 'Alex says: "I solve puzzles because I enjoy the challenge itself."',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo motivation-source`.

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
  "verdict": "intrinsic",
  "confidence": 0.96,
  "probabilities": {
    "intrinsic": 0.96,
    "extrinsic": 0.01,
    "mixed": 0.01,
    "not_stated": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`causal-attribution`](../causal-attribution/README.md): Use causal-attribution to distinguish personal from situational explanations of behavior.
- [`preference-kind`](../preference-kind/README.md): Use preference-kind to distinguish preferences, facts, and temporary requests rather than reasons for an activity.
- [`claim-stance`](../claim-stance/README.md): Use claim-stance to label agreement with a specified claim instead of classifying the reason for acting.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `activity`      | Yes      | string                       |
| `statement`     | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply one `activity` and a `statement` saying or reporting why it is done. Identify the actor in `activity` when several people are mentioned. Optional `context` resolves speakers or references; it does not supply motives absent from the statement.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                                 |
| ------------ | --------------------------------------------------------------------------------------- |
| `intrinsic`  | The stated reason is interest, enjoyment, or satisfaction in doing the activity itself. |
| `extrinsic`  | The stated reason is obtaining or avoiding a separate outcome.                          |
| `mixed`      | Both kinds of reason are offered together.                                              |
| `not_stated` | The activity is clear, but no reason for doing it is given.                             |
| `unclear`    | References, alternatives, the causal link, or the activity boundary are unresolved.     |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence with a zero threshold. Other verdicts, including the absence of a frame or reason, can be ready. Confidence describes the annotation decision, not the strength of a psychological effect.

## Decision boundaries

These are authored policy examples, not human-adjudicated labels or measured model accuracy. These examples classify the reason given for the named activity. They do not verify whether a person actually has that motive.

| Supplied wording                                                                                             | Intended verdict |
| ------------------------------------------------------------------------------------------------------------ | ---------------- |
| "I solve puzzles because I enjoy the challenge itself."                                                      | `intrinsic`      |
| "I solve puzzles to win the prize."                                                                          | `extrinsic`      |
| "I solve puzzles because they are fun and I want the prize."                                                 | `mixed`          |
| "I solve puzzles for the prize, not because I enjoy them."                                                   | `extrinsic`      |
| "I study so I will not feel ashamed of my grade." An internal feeling can still be a separate outcome.       | `extrinsic`      |
| "I freely choose to study because the qualification helps my career." Freely chosen does not mean intrinsic. | `extrinsic`      |
| "I solve puzzles every evening."                                                                             | `not_stated`     |
| "There is a prize for solving puzzles." No reason is attributed to the focal actor.                          | `not_stated`     |
| "I enjoy puzzles." Enjoyment is stated, but no participation or reason for it is given.                      | `not_stated`     |
| "I do not solve puzzles for money." No other reason is offered.                                              | `not_stated`     |
| "It might be for fun or for the prize; I cannot tell."                                                       | `unclear`        |
| "Sam says Alex solves puzzles for the prize." The supplied activity identifies Alex.                         | `extrinsic`      |

## Reuse

Use this to annotate stated reasons in interviews, learning feedback, or model explanations. [Preference-kind](../preference-kind/README.md) classifies the type of statement, while [causal-attribution](../causal-attribution/README.md) classifies personal versus situational causes.

For AI research, the output labels an expressed explanation. Combine it with separately observed choices and a controlled study before drawing conclusions about model behavior.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or take application actions. Find related tools in [Psychology & behavior](../README.md#psychology--behavior).

## Concept and validation

The intrinsic/extrinsic distinction follows [Ryan and Deci's definitions](https://selfdeterminationtheory.org/wp-content/uploads/2020/06/2020_RyanDeci_IntrinsicandExtrinsic.pdf). A reason can be personally valued yet aim at a separate outcome; [internalized motivation is not automatically intrinsic](https://selfdeterminationtheory.org/topics/application-intrinsic-motivation/). The recipe uses only these broad categories, not the full theory or a validated measurement scale.

For research use, validate the labels against independent human annotations on your inputs. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation and controlled comparisons.

## Limits

- A reason label does not establish sincerity, hidden motives, intensity, permanence, or a psychological profile.
- Extrinsic does not mean imposed by someone else or undesirable. The recipe does not classify levels of autonomy.
- A model's text about enjoyment or rewards does not establish that it has those experiences or motives.
