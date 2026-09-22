# Check a tool fit

Can the capabilities explicitly described in tool perform task? Do not assume capabilities that are not described. Capability fit is separate from permission to invoke the tool.

```ts
import { toolFit } from 'jev-recipes/tool-fit';

const result = await toolFit({
  task: 'Read the current incident status.',
  tool: 'Status reader: retrieves active incidents. It cannot create or modify incidents.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `task`          | Non-empty text                               |
| `tool`          | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict        | Meaning                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `fits`         | The described capabilities can perform the requested task.                 |
| `does_not_fit` | The described capabilities do not cover the task or explicitly exclude it. |
| `unclear`      | The capability description lacks facts needed to decide.                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied capability description. It does not discover tools, validate credentials, or grant permission.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo tool-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe tool-fit` shows the input and result schemas.
