# LangChain tools backed by Jev

Build the package, then run `node examples/langchain-tools/run.mjs`. It needs no key: Jev decisions come from saved fixtures. Add `--live` with `TYPESAFE_API_KEY` to make the same decisions with Jev.

[run.mjs](run.mjs) builds four tools from `jev-recipes/langchain` and invokes each one directly, the same way a LangGraph `ToolNode` or a LangChain agent would:

| Tool                | Built with       | What happens in the example                                                |
| ------------------- | ---------------- | -------------------------------------------------------------------------- |
| `route`             | `recipeTools`    | The `route` recipe becomes a structured tool and returns a typed decision. |
| `run_tests`         | `guardTools`     | `tool-call-gate` allows the call, so the original tool runs.               |
| `drop_table`        | `guardTools`     | `tool-call-gate` denies the call, so the model gets a blocked result.      |
| `report_completion` | `completionTool` | `completion-gate` accepts a completion claim that carries evidence.        |

Pass the tools to your model with `bindTools`, a `ToolNode`, or `createAgent`; nothing else changes. The application decides how to handle a blocked call and when to stop on an accepted completion. See the [framework adapter guide](../../docs/framework-adapters.md).
