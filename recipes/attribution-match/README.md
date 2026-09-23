# Check a statement's attributed source

<!-- BEGIN GENERATED: usage -->

Check whether supplied source text attributes a statement to the claimed speaker or source.

Use when: You need to check who said a statement in a transcript or source excerpt, separately from whether it is true.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { attributionMatch } from 'jev-recipes/attribution-match';

const result = await attributionMatch({
  statement: 'The deadline is Friday.',
  attributedTo: 'Mira',
  source: 'Oren: The deadline is Friday.\nMira: Thank you for the update.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo attribution-match`.

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
  "verdict": "mismatched",
  "confidence": 0.97,
  "probabilities": {
    "matched": 0.01,
    "mismatched": 0.97,
    "not_attributed": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`citation-match`](../citation-match/README.md): Use citation-match to check which passages support a claim, rather than who made it.
- [`claim-stance`](../claim-stance/README.md): Use claim-stance to label a response's own position toward a claim, rather than verifying a named attribution.
- [`reference-resolve`](../reference-resolve/README.md): Use reference-resolve to select the referent of an ambiguous expression from supplied candidates.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `attributedTo`  | Yes      | string                       |
| `source`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict          | Meaning                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `matched`        | The supplied source attributes the statement or its explicit endorsement to the claimed speaker or source.                       |
| `mismatched`     | The supplied source clearly attributes the statement elsewhere, without the claimed speaker asserting or endorsing it.           |
| `not_attributed` | The relevant statement appears in the supplied text but has no identified speaker or source.                                     |
| `unclear`        | Missing content, unresolved identity, contradictory attribution, or ambiguous wording prevents a supported attribution decision. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the annotation, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not human-adjudicated labels or live model evaluation results.

| Supplied situation                                                                                          | Intended verdict |
| ----------------------------------------------------------------------------------------------------------- | ---------------- |
| Statement: the deadline is Friday. Claimed speaker: Mira. Source: "Mira: The deadline is Friday."           | `matched`        |
| Same statement and speaker. Source only attributes it to Oren; Mira says "Thanks."                          | `mismatched`     |
| Same statement and speaker. Source: "Mira: Oren said the deadline is Friday" without endorsement.           | `mismatched`     |
| Same statement and speaker. Source: "Oren: The deadline is Friday. Mira: I agree, the deadline is Friday."  | `matched`        |
| Same statement and speaker. Source contains "The deadline is Friday" with no author or speaker information. | `not_attributed` |
| Same statement and speaker. Source only discusses the project budget.                                       | `unclear`        |
| Same statement and speaker. Source says "Speaker 2: The deadline is Friday" but never identifies Speaker 2. | `unclear`        |
| Same statement and speaker. Source establishes that Speaker 2 is Mira and records Speaker 2 saying it.      | `matched`        |

## Reuse

Use this when checking speaker labels in summaries or auditing source attribution in saved model responses. Supply one extracted statement and its claimed speaker per call; extraction and source authenticity remain separate steps. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Checks only the supplied attribution record. It does not authenticate a source or establish original authorship, truth, or copyright ownership.
- Missing statements and unresolved speaker identities require review; absence from an excerpt is not proof of false attribution.
- Nested quotation and endorsement are distinct. Include enough surrounding text to establish who is speaking.
