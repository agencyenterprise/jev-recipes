# An AI SDK agent with Jev decisions

Build the package, then run `node examples/ai-sdk-agent/run.mjs`. It needs no key: the text model is a scripted `MockLanguageModelV3` from `ai/test`, and Jev decisions come from saved fixtures. Add `--live` with `TYPESAFE_API_KEY` to make the same decisions with Jev while keeping the scripted text model.

Read [run.mjs](run.mjs) from top to bottom. One `generateText` call uses three adapters from `jev-recipes/ai-sdk`:

| Adapter           | Recipe            | What happens in the example                                                                              |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `routeModelStep`  | `model-route`     | Picks the `fast` candidate for the request once, and every step uses it.                                 |
| `guardTools`      | `tool-call-gate`  | Lets `run_tests` run; returns a blocked result for `publish_release` so a person can confirm.            |
| `completionCheck` | `completion-gate` | Rejects a completion claim without evidence, then accepts the claim with test output and stops the loop. |

The application still owns the tools, the policy text, and what happens with a blocked call. The output lists each step's model, tool calls, and tool outputs plus a trace of the Jev decisions. Fixtures demonstrate control flow, not accuracy.

To run a real agent, replace the scripted models with provider models and keep the rest. See the [framework adapter guide](../../docs/framework-adapters.md).
