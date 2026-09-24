# Check interview question relevance

<!-- BEGIN GENERATED: usage -->

Does question ask only about matters relevant to the requirements of role, rather than personal circumstances unrelated to the work?

Use when: You generate or review screening and interview questions and want to flag ones that stray from the job into personal territory before they reach a candidate.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { questionRelevance } from 'jev-recipes/question-relevance';

const result = await questionRelevance({
  question:
    'You mentioned you have young kids. How would you handle the on-call rotation, and do you plan to have more children in the next couple of years?',
  role: 'Site Reliability Engineer. Requirements: 3+ years running production services, experience with incident response, participation in a weekly on-call rotation, strong Linux and networking fundamentals.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo question-relevance`.

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
  "probability": 0.05,
  "confidence": 0.95,
  "verdict": "unrelated"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`question-leading`](../question-leading/README.md): Use question-leading to check whether a question steers the candidate toward an answer.
- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to check whether a written policy or rubric covers a given task.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `role`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `relevant` when Jev's yes probability is at least 0.5 and `unrelated` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.05 yes probability yields `unrelated` with 0.95 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and hold the question for a human check rather than sending it to a candidate.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges whether every part of the question stays on the role's stated requirements and duties. A question that mixes a work topic with a personal probe is `unrelated`, because the personal part is what matters for screening. It is not legal advice: which topics are prohibited, and the exceptions for genuine occupational requirements, differ by jurisdiction and belong in application policy. A `relevant` question can still be leading or poorly worded; use [`question-leading`](../question-leading/README.md) for that check.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo question-relevance` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe question-relevance` to inspect the input and result schemas.
