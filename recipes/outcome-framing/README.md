# Identify gain and loss framing

<!-- BEGIN GENERATED: usage -->

Label whether wording presents a specified outcome through gains, losses, both, or neither.

Use when: You need to label gain and loss wording in a decision prompt or research stimulus.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { outcomeFraming } from 'jev-recipes/outcome-framing';

const result = await outcomeFraming({
  text: 'You keep 80 of your 100 points.',
  outcome: "The player's points after the round; more points are better.",
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo outcome-framing`.

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
  "verdict": "gain",
  "confidence": 0.96,
  "probabilities": {
    "gain": 0.96,
    "loss": 0.01,
    "mixed": 0.01,
    "neutral": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`question-leading`](../question-leading/README.md): Use question-leading to assess pressure toward a supplied answer, rather than gain or loss framing.
- [`question-assumption`](../question-assumption/README.md): Use question-assumption to check whether a question takes a specified claim for granted.
- [`choose-action`](../choose-action/README.md): Use choose-action to select among supplied eligible actions; outcome-framing only labels wording.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `text`          | Yes      | string                       |
| `outcome`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply the respondent-visible `text` and one focal `outcome`. Identify whose outcome matters and what counts as a benefit or harm. Optional `context` can supply a baseline or resolve references. It does not add framing absent from the text.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                |
| --------- | ---------------------------------------------------------------------- |
| `gain`    | Benefits obtained or retained, or harm avoided.                        |
| `loss`    | Costs, forfeited benefits, or harm incurred.                           |
| `mixed`   | Both gain and loss framing are presented for the focal outcome.        |
| `neutral` | The focal outcome is described without either frame.                   |
| `unclear` | The outcome, perspective, benefit direction, or wording is unresolved. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence with a zero threshold. Other verdicts, including the absence of a frame or reason, can be ready. Confidence describes the annotation decision, not the strength of a psychological effect.

## Decision boundaries

These are authored policy examples, not human-adjudicated labels or measured model accuracy. Unless noted, the outcome is the player's points after starting with 100 points; more points are better.

| Supplied wording                                                                                                            | Intended verdict |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| "You keep 80 of your 100 points."                                                                                           | `gain`           |
| "You lose 20 of your 100 points."                                                                                           | `loss`           |
| "You keep 80 points and lose 20 points."                                                                                    | `mixed`          |
| "Final balance: 80 points."                                                                                                 | `neutral`        |
| "You avoid losing 20 points."                                                                                               | `gain`           |
| "You incur 20 penalty points." The focal outcome is penalties, where fewer are better.                                      | `loss`           |
| "Your opponent loses 20 points." The focal outcome is your own balance, with no stated connection.                          | `unclear`        |
| "You keep 80 points. Your opponent loses a turn." Only your points are the focal outcome.                                   | `gain`           |
| "The new balance is 80 points." Context supplies a previous balance of 100, but the wording supplies no gain or loss frame. | `neutral`        |
| "You get 20 points." No rule establishes whether these are rewards or penalties.                                            | `unclear`        |

## Reuse

Use this to annotate decision prompts before comparing choice behavior. A gain-framed and a loss-framed prompt may describe equivalent outcomes, but the caller must verify equivalence. For a controlled game experiment, keep the board, eligible moves, objective, and model settings fixed while varying the wording supplied to [choose-action](../choose-action/README.md). The recipe labels the wording; the experiment measures any effect.

[Question-leading](../question-leading/README.md) checks pressure toward an answer, and [question-assumption](../question-assumption/README.md) checks a premise taken for granted.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or take application actions. Find related tools in [Psychology & behavior](../README.md#psychology--behavior).

## Concept and validation

The recipe uses an operational gain/loss wording distinction informed by [Tversky and Kahneman's framing study](https://psychology.hanover.edu/classes/Cognition/papers/tversky81.pdf). Its labels and examples are an implementation policy, not a validated replication of that study.

For research use, validate the labels against independent human annotations on your inputs. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation and controlled comparisons.

## Limits

- A frame label does not measure loss aversion, bias, persuasion, or decision quality.
- Classifies one perspective and outcome at a time. It does not calculate actual utility or compare numeric equivalence.
- Neutral refers to the wording, even if ordinary code could calculate an actual gain or loss.
