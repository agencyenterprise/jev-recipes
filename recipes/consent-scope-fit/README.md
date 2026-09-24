# Check whether consent wording covers a use

<!-- BEGIN GENERATED: usage -->

Does the wording of consent cover the described use?

Use when: You hold the text of a patient's consent or authorization and need to check, before sharing or using their information, whether the described use falls within what the wording permits.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { consentScopeFit } from 'jev-recipes/consent-scope-fit';

const result = await consentScopeFit({
  consent:
    'I authorize Riverside Family Clinic to share my visit summaries and lab results with my cardiologist, Dr. Anita Patel, for the purpose of coordinating my heart care. This authorization expires one year from the date signed.',
  use: "Send the patient's lab results to a pharmaceutical company's research registry for a hypertension study.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo consent-scope-fit`.

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
  "probability": 0.03,
  "confidence": 0.97,
  "verdict": "uncovered"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`consent-request`](../consent-request/README.md): Use consent-request to check that a message actually asks for consent, before there is any consent wording to compare against.
- [`source-applicability`](../source-applicability/README.md): Use source-applicability to check whether a policy or source document applies to a situation at all.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `consent`       | Yes      | string                       |
| `use`           | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `covered` when Jev's yes probability is at least 0.5 and `uncovered` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `uncovered` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is a reading of the consent wording against the described use, not a legal opinion; it does not establish whether the consent meets HIPAA or any other legal standard, whether it was freely given, or whether it is still in force. Expiry dates, revocations, and whether the named parties are who they claim to be are facts your records hold, so check them in code before relying on this result. A use that the consent neither mentions nor excludes is reported as uncovered, which is the conservative reading; if your policy treats silence differently, handle that in your rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo consent-scope-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe consent-scope-fit` to inspect the input and result schemas.
