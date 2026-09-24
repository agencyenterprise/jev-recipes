# Check whether a review response addresses the review

<!-- BEGIN GENERATED: usage -->

Does response engage with the specific complaints and praise raised in review, rather than offering a generic thank-you or apology?

Use when: A hospitality or support team drafts public replies to guest reviews and wants to catch templated responses that ignore what the reviewer actually said before they are posted.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reviewResponseFit } from 'jev-recipes/review-response-fit';

const result = await reviewResponseFit({
  review:
    'Three stars. The rooftop pool and the breakfast were genuinely excellent, and the front desk upgraded us without asking. But the air conditioning in room 412 rattled all night and maintenance never showed up after we called twice. We also waited 40 minutes for the airport shuttle that was supposed to run every 15.',
  response:
    'Thank you for staying with us and for the kind words about the rooftop pool and breakfast; I have passed your compliment to the front desk team. I am sorry about the noisy air conditioning unit in 412 and that maintenance did not respond after two calls; that unit has now been replaced and we are reviewing how after-hours requests are dispatched. The shuttle delay is not the service we promise, and we have added a second vehicle during peak hours. I hope you will give us another chance.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo review-response-fit`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "addresses"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-coverage`](../answer-coverage/README.md): Use answer-coverage when you have an explicit list of questions and need to know which ones a draft answers, rather than whether a reply engages with a free-form review.
- [`resolution-check`](../resolution-check/README.md): Use resolution-check to learn whether a customer says a problem is fixed; this recipe judges only whether the business's reply speaks to the review.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `review`        | Yes      | string                       |
| `response`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `addresses` when Jev's yes probability is at least 0.5 and `generic` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `generic` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The gate reports only that the response speaks to what this reviewer wrote; it does not verify that the fixes described actually happened, nor that the tone is appropriate or the wording safe to post. A brief reply that names the reviewer's issue counts as addressing it, while a long and warm reply that could sit under any review counts as generic, so pair this with a tone or policy check when both matter. Reviews in which the guest raised nothing specific give the model little to match against; treat a low-confidence result on such a review as a signal to inspect the reply by hand.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo review-response-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe review-response-fit` to inspect the input and result schemas.
