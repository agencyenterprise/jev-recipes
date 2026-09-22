# Check workaround fit

Can workaround address issue without violating constraints? Check the stated prerequisites and restrictions. Do not assume permissions, tools, or capabilities not supplied.

```ts
import { workaroundFit } from 'jev-recipes/workaround-fit';

const result = await workaroundFit({
  issue: 'The desktop application cannot open a report.',
  workaround: 'Open the report in the web application.',
  constraints: 'The customer has web access and needs only to view the report.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `issue`         | Non-empty text                               |
| `workaround`    | Non-empty text                               |
| `constraints`   | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                               |
| ----------- | ------------------------------------------------------------------------------------- |
| `fits`      | The described workaround addresses the issue and satisfies the stated constraints.    |
| `conflicts` | The workaround contradicts a stated constraint or cannot address the described issue. |
| `unclear`   | A needed prerequisite or effect is not established.                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses described compatibility. It does not establish operational safety, execute a workaround, or grant access.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo workaround-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe workaround-fit` shows the input and result schemas.
