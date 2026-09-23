# Compare the origins of two pieces of evidence

<!-- BEGIN GENERATED: usage -->

Check whether supplied provenance shows shared or separate evidence origins for one claim, or leaves their relationship unresolved.

Use when: You need to check whether two reports rely on the same underlying source before treating them as corroboration.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { evidenceIndependence } from 'jev-recipes/evidence-independence';

const result = await evidenceIndependence({
  claim: 'The service outage began at 09:00.',
  firstProvenance:
    'Report A copies the start time from status notice N17 published by the service operator.',
  secondProvenance:
    'Report B cites Report A and repeats the start time from the same operator notice N17.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo evidence-independence`.

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
  "verdict": "shared_origin",
  "confidence": 0.98,
  "probabilities": {
    "shared_origin": 0.98,
    "separate_origins": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`passage-duplicate`](../passage-duplicate/README.md): Use passage-duplicate to compare information overlap in passages, not the origins of their evidence.
- [`attribution-match`](../attribution-match/README.md): Use attribution-match to check a named statement attribution against a source excerpt.
- [`evidence-conflict`](../evidence-conflict/README.md): Use evidence-conflict to compare what sources say; conflicting reports can still share an origin.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field              | Required | Shape                        |
| ------------------ | -------- | ---------------------------- |
| `claim`            | Yes      | string                       |
| `firstProvenance`  | Yes      | string                       |
| `secondProvenance` | Yes      | string                       |
| `minConfidence`    | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict            | Meaning                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `shared_origin`    | The supplied chains show material evidence for the claim originating from at least one shared source, observation, or dataset. |
| `separate_origins` | The supplied chains affirm separately obtained original evidence for the claim with no material shared origin described.       |
| `unclear`          | The supplied provenance does not establish shared or separate material origins for this claim.                                 |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the annotation, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not human-adjudicated labels or live model evaluation results.

| Supplied situation                                                                                              | Intended verdict   |
| --------------------------------------------------------------------------------------------------------------- | ------------------ |
| Both reports cite the same operator notice for the claimed outage start time.                                   | `shared_origin`    |
| One report copies the other's observation for the claim, with different wording.                                | `shared_origin`    |
| Two analyses support the claim using the same underlying dataset, even if their conclusions differ.             | `shared_origin`    |
| One report adds a new measurement but also relies materially on a dataset used by the other.                    | `shared_origin`    |
| Two witnesses explicitly describe separately observing the same event without relying on each other's accounts. | `separate_origins` |
| Two labs explicitly collect separate original samples; they use the same protocol and no shared claim evidence. | `separate_origins` |
| Reports have different authors and publishers but no original-source details.                                   | `unclear`          |
| The second report's provenance is unknown or contains contradictory source descriptions.                        | `unclear`          |

## Reuse

Use this before counting sources as corroborating evidence. Preserve unknown provenance as unclear instead of treating each publication as another independent observation. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Evaluates supplied provenance descriptions only. It does not fetch sources, verify provenance, or discover hidden dependencies.
- Separate origins are not a guarantee of statistical independence, reliability, or truth.
- The claim scopes material overlap. Shared background unrelated to the claim is not sufficient for a shared-origin label.
