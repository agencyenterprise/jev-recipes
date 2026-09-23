# Identify whom a memory describes

<!-- BEGIN GENERATED: usage -->

Label whether one candidate memory describes the user, someone else, or a group including the user.

Use when: You need to avoid treating a fact about someone else as a fact about the user.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { memorySubject } from 'jev-recipes/memory-subject';

const result = await memorySubject({
  statement: 'My brother is vegetarian.',
  user: 'Alex, the speaker of the statement.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo memory-subject`.

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
  "verdict": "other",
  "confidence": 0.97,
  "probabilities": {
    "user": 0.01,
    "other": 0.97,
    "shared": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`memory-scope`](../memory-scope/README.md): Use memory-scope to identify where a fact applies after identifying whom it describes.
- [`attribution-match`](../attribution-match/README.md): Use attribution-match to check who said or endorsed a statement, rather than whom the statement describes.
- [`preference-kind`](../preference-kind/README.md): Use preference-kind to distinguish a lasting preference from a temporary instruction.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `user`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply one atomic `statement` and identify the `user` whose profile you are considering. Include the user's speaker role, such as "Alex, the speaker of this message." Optional `context` can identify quoted speakers or resolve pronouns. The recipe has no account or conversation state of its own.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `user`    | The described property belongs to the identified user alone.                                                    |
| `other`   | The described property belongs to someone or something else, excluding the user.                                |
| `shared`  | The same property explicitly applies to a group including the user.                                             |
| `unclear` | Identities or references are unresolved, no property is attributable, or separate assertions require splitting. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence and a zero threshold. `ready` concerns attribution, not approval to save a memory.

## Decision boundaries

These cases document the intended policy, not measured model accuracy. In this table, the user is Alex, who wrote the message, unless noted.

| Statement and context                                                                                                      | Intended verdict |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| "I am vegetarian."                                                                                                         | `user`           |
| "My brother is vegetarian."                                                                                                | `other`          |
| "My brother and I are vegetarian."                                                                                         | `shared`         |
| "Sam said, 'I am vegetarian.'"                                                                                             | `other`          |
| "I admire my brother."                                                                                                     | `user`           |
| "My brother is vegetarian, but I am not." Two separate assertions require splitting.                                       | `unclear`        |
| "They prefer email." No identity is supplied for "they."                                                                   | `unclear`        |
| "They prefer email." Context identifies "they" as Alex and Sam.                                                            | `shared`         |
| "I am not vegetarian." The subject is Alex; the negation must be preserved.                                                | `user`           |
| "If I were vegetarian, I would order tofu." The subject is Alex; the hypothetical does not establish an actual preference. | `user`           |

## Reuse

Use this before attaching a candidate fact to a person's profile. For example, `other` in the saved example helps your application avoid recording "vegetarian" as Alex's diet.

After attribution, [memory-scope](../memory-scope/README.md) can assess where the statement applies, and [preference-kind](../preference-kind/README.md) can classify its persistence. [Attribution-match](../attribution-match/README.md) answers who said or endorsed a statement, which can differ from whom it describes.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe, extract facts, or write memories.

## Limits

- Supply one statement at a time. Split separate assertions before classifying them.
- A known subject does not establish truth, actuality, permanence, usefulness, or storage permission.
- Quotation, negation, and hypothetical wording remain part of the original statement. A subject label must not turn them into affirmative facts.
