# Use recipes inside an agent framework

`jev-recipes/ai-sdk` and `jev-recipes/langchain` turn recipes into the hooks that the [Vercel AI SDK](https://ai-sdk.dev/) and [LangChain.js](https://js.langchain.com/) already expose. The framework runs the text model and the loop; Jev makes the small decisions around it. Each adapter uses the same recipe functions, validation, and review policy as a direct call.

Install the framework you use alongside `jev-recipes`. Both are optional peer dependencies:

| Subpath                 | Peer dependency              | Tested with           |
| ----------------------- | ---------------------------- | --------------------- |
| `jev-recipes/ai-sdk`    | `ai` 7 or newer              | `ai@7.0`              |
| `jev-recipes/langchain` | `@langchain/core` 1 or newer | `@langchain/core@1.2` |

Every adapter accepts the usual `{ client, model, signal }` recipe options, so a Gateway or local client injected through [the integration guide](integrations.md) applies here too. Live calls need `TYPESAFE_API_KEY` or an injected client and use API quota.

## Vercel AI SDK

```js
import { generateText, stepCountIs, tool } from 'ai';
import { completionCheck, guardTools, recipeTools, routeModelStep } from 'jev-recipes/ai-sdk';

const done = completionCheck();
const result = await generateText({
  model: careful,
  prompt: 'Run the account tests and publish release 1.2.0.',
  tools: {
    ...guardTools(
      { run_tests, publish_release },
      { policy: 'Local reads and tests are allowed. Ask before publishing or spending money.' },
    ),
    ...recipeTools(['route', 'verify']),
    ...done.tools,
  },
  prepareStep: routeModelStep({
    candidates: [
      {
        id: 'fast',
        text: 'Cheap and quick. Good for small edits and routine tool use.',
        model: fast,
      },
      {
        id: 'careful',
        text: 'Expensive. Best for hard debugging and ambiguous changes.',
        model: careful,
      },
    ],
  }),
  stopWhen: [stepCountIs(8), done.stopWhen],
});
```

| Function                      | Recipe            | Hook                   | Behavior                                                                                                                                                                                                                        |
| ----------------------------- | ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeTool(name, options)`   | any               | `tools`                | One tool whose description and JSON input schema come from the catalog. The model supplies the recipe input; the recipe validates it and returns its full result.                                                               |
| `recipeTools(names, options)` | any               | `tools`                | Several tools keyed by recipe ID.                                                                                                                                                                                               |
| `guardTools(tools, options)`  | `tool-call-gate`  | `tools`                | Wraps each tool that has `execute`. An allowed call runs unchanged. An `ask` or `deny` decision, or an uncertain one, returns a blocked output to the model instead of running. Tools without `execute` pass through untouched. |
| `routeModelStep(options)`     | `model-route`     | `prepareStep`          | Chooses a candidate model once per `generateText` or `streamText` call and applies it to every step. An uncertain decision uses `fallback` when supplied, otherwise the call's own model.                                       |
| `completionCheck(options)`    | `completion-gate` | `tools` and `stopWhen` | Adds a `report_completion` tool. The loop stops only when a report is accepted; a rejected report returns to the model with the reason, because the AI SDK ends the loop when a step has no tool calls.                         |

`guardTools` reads the request from the last user message unless `request` is supplied. `routeModelStep` and `completionCheck` read it from the first user message; pass `request` or `task` when the prompt is not the task. A call with no user message throws, so the guard fails closed.

The blocked output is `{ kind: 'jev-recipes/blocked-tool-output', blocked: true, action, verdict, status, detected, confidence, message }`. The message tells the model the call did not run and not to retry it unattended. The application decides whether to surface an `ask` to a person; the adapter does not queue approvals.

Guarded tools support both regular results and streaming results. The wrapper's `execute` returns an async iterable: `generateText` collects its final result, and `streamText` can expose preliminary results. If you call `execute` directly, consume it with `for await`:

```js
for await (const output of guarded.run_tests.execute(input, executionOptions)) {
  console.log(output);
}
```

The output type includes the original result or `BlockedToolOutput`. A supplied output schema accepts both shapes. Successful results retain the original `toModelOutput` formatter; blocked results become JSON without entering that formatter. The `kind` value is reserved for guard-generated blocked results. Preserve the complete output, including `kind`, when saving a conversation so restored blocked results are still recognized. Ordinary tool data containing `blocked: true` keeps its original formatter.

`routeModelStep` candidates carry the application's model instances. The recipe sees only the `id` and `text` descriptions. Each candidate description should state cost and strengths, since the recipe prefers the cheapest model whose description clearly covers the request.

The [runnable example](../examples/ai-sdk-agent/README.md) exercises all three hooks offline with a scripted text model.

## LangChain.js

```js
import { tool } from '@langchain/core/tools';
import { completionTool, guardTools, recipeTools } from 'jev-recipes/langchain';

const request = 'Route this ticket and clean up the temporary test table.';
const tools = [
  ...recipeTools(['route']),
  ...guardTools([runTests, dropTable], {
    request,
    policy: 'Never drop tables without a person confirming.',
  }),
  completionTool({ task: request }),
];
```

| Function                      | Recipe            | Behavior                                                                                                                                           |
| ----------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipeTool(name, options)`   | any               | A `DynamicStructuredTool` named after the recipe with the catalog description and JSON input schema.                                               |
| `recipeTools(names, options)` | any               | Several tools in the supplied order.                                                                                                               |
| `guardTools(tools, options)`  | `tool-call-gate`  | Wraps each structured tool with the same name, description, schema, and `returnDirect`. Allowed calls are delegated to the original tool.          |
| `completionTool(options)`     | `completion-gate` | A `report_completion` tool that returns `{ accepted, verdict, status, detected, confidence, message }`. The application stops on `accepted: true`. |

LangChain tools do not receive the conversation, so `guardTools` requires `request`: a string, or a function of the tool input and config for per-call text. `completionTool` requires `task`.

The guard reviews arguments as supplied by the caller, before the original tool validates or transforms them. An allowed call delegates the original input or tool-call envelope and configuration once, preserving the original validation, transformations, callbacks, and returned artifacts. A blocked call skips the original tool entirely, including its validation and transformations. Direct invocations receive a blocked object; tool-call invocations receive a `ToolMessage` with the same call ID.

Pass the tools to `bindTools`, a LangGraph `ToolNode`, or `createAgent`. Object results become JSON in the tool message. The [runnable example](../examples/langchain-tools/README.md) invokes each tool directly.

## Shared behavior

- Input validation, response validation, and confidence thresholds are the recipe's own. `minConfidence` in the adapter options is passed to the recipe.
- A provider failure or invalid Jev response rejects the tool call. The framework reports it as a tool error and the guarded tool does not run.
- `onDecision` receives each recipe result for logging. Events include the tool name and input for guards and the report for completion checks; keep them out of logs that must not contain customer content.
- Adapters do not enforce permissions, execute actions, or persist approvals. A ready decision is not permission to act.
- Fixture tests and the examples verify control flow. They do not measure recipe accuracy on your tasks; see [evaluation](evaluation.md).
