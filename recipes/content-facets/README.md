# Label article facets

<!-- BEGIN GENERATED: usage -->

Which of these does article include: a clear thesis, supporting evidence, counterarguments, a call to action, and signals of author expertise?

Use when: You audit published or drafted articles for structural completeness before deciding whether they need more evidence, a stance, or a conclusion.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { contentFacets } from 'jev-recipes/content-facets';

const result = await contentFacets({
  article:
    'Why every small team should ship a status page\n\nAfter running infrastructure for three startups over eight years, I am convinced that a public status page is the highest-leverage reliability investment a small team can make. When we added one at my last company, support tickets during incidents dropped from an average of 41 to 9, because customers could see we already knew. It also forced us to define what "degraded" meant, which improved our own alerting. Start today: pick a hosted provider, list your five most visible services, and link the page from your app footer before the next incident finds you.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo content-facets`.

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
  "detected": ["statesThesis", "providesEvidence", "includesCallToAction", "signalsExpertise"],
  "labels": {
    "statesThesis": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "providesEvidence": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.9,
      "confidence": 0.9
    },
    "addressesCounterarguments": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    },
    "includesCallToAction": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.88,
      "confidence": 0.88
    },
    "signalsExpertise": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.91,
      "confidence": 0.91
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-disclosures`](../answer-disclosures/README.md): Use answer-disclosures to label the caveats and disclosures an answer contains rather than the structure of an article.
- [`argument-fit`](../argument-fit/README.md): Use argument-fit to judge whether a specific argument supports a specific claim.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `article`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesThesis`, `providesEvidence`, `addressesCounterarguments`, `includesCallToAction`, `signalsExpertise`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports whether the element appears in the text, not whether it is any good: a stated thesis can be wrong, cited evidence can be weak, and claimed expertise can be false. The article is judged as one text, so a very long piece may need splitting for section-level results. Turning the labels into a quality score or an editorial checklist policy belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo content-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe content-facets` to inspect the input and result schemas.
