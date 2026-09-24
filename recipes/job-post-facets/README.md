# Label what a job posting states

<!-- BEGIN GENERATED: usage -->

Which of these does posting state: salary or range, work location, remote policy, experience level, required qualifications?

Use when: You check job postings for completeness before publishing, or normalize scraped postings into structured fields.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { jobPostFacets } from 'jev-recipes/job-post-facets';

const result = await jobPostFacets({
  posting:
    'Senior Backend Engineer, Berlin (hybrid, 2 days in office). EUR 85,000 to 105,000 plus equity. You have 5+ years building distributed systems in Go or Java and have run PostgreSQL in production. Fluent English required.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo job-post-facets`.

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
  "detected": [
    "statesSalary",
    "statesLocation",
    "statesRemotePolicy",
    "statesExperienceLevel",
    "statesQualifications"
  ],
  "labels": {
    "statesSalary": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesLocation": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesRemotePolicy": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesExperienceLevel": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesQualifications": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`clarify`](../clarify/README.md): Use clarify to list which required details are missing or ambiguous in free text.
- [`requirement-testability`](../requirement-testability/README.md): Use requirement-testability to check whether a stated qualification can be verified.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `posting`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per facet: `statesSalary`, `statesLocation`, `statesRemotePolicy`, `statesExperienceLevel`, and `statesQualifications`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present facets in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per facet in a single Jev request. This folder owns the five questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet reports that the posting states something, not what it states. `statesSalary` requires a concrete figure or range, so "competitive compensation" is `absent`; extract the actual numbers in application code. `statesLocation` and `statesRemotePolicy` are separate because a posting can name a city without saying whether the role is on-site. The recipe does not check whether the stated details are accurate or whether local law requires a disclosed range. For a list of what is missing or ambiguous in free text use [`clarify`](../clarify/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo job-post-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe job-post-facets` to inspect the input and result schemas.
