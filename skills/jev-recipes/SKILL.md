---
name: jev-recipes
description: Find and integrate jev-recipes in JavaScript or TypeScript applications that need bounded Jev decisions such as routing, evidence ranking, or action review. Use when the user chooses jev-recipes or asks to build with its catalog.
---

# Build with jev-recipes

Use the installed package's catalog to select the smallest decision that fits the task. Preserve the application's existing provider and architecture.

## Discover the contract

In a project with jev-recipes installed, use its local CLI:

```sh
npx --no-install jev-recipes list "route support tickets" --limit 5
npx --no-install jev-recipes describe route
npx --no-install jev-recipes example route
npx --no-install jev-recipes demo route
```

Substitute the user's task and selected recipe. `describe` supplies the input/result schemas, limitations, related recipes, and saved evidence. `example` prints input JSON; `demo` runs a saved fixture without a key. Never treat a fixture as a live accuracy measurement. If the package is absent, add it through the project's existing package manager as part of the requested integration.

## Implement the decision

Import from `jev-recipes/<recipe-id>`. Validate external input using that recipe's input schema. Pass an injected `{ client, model, signal }` when the application supplies them. The client must implement the TypeSafe `systemOne` contract; arbitrary chat clients are not interchangeable.

Read the selected result schema rather than assuming every recipe returns `verdict` or `selection`. Handle `status: 'review'` and thrown provider/validation errors explicitly. Confidence is a policy signal, not a guarantee. Keep dispatch, permissions, tool execution, audio playback, and application state in application code.

Start from [the three workflow examples](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/getting-started/README.md) when the task is routing, evidence selection, or action review. For provider setup, use [the integration guide](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/integrations.md). The Gateway example accepts `VERCEL_GATEWAY_API_KEY` or `AI_GATEWAY_API_KEY`; the raw default client does not automatically select Gateway from those names. Keep credentials and provider calls server-side.

For a web workflow with an optional second opinion, use the [support-routing starter](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/support-routing/README.md). Its fallback runs only for a low-confidence non-null suggestion; explicit no-fit answers stay in review. Share the workflow between UI and evaluation, keep keys server-side, and preserve fixture/live labeling. Use its [comparison harness](https://github.com/agencyenterprise/jev-recipes/blob/main/evals/support-routing/README.md) only for this workflow; use the package evaluator for individual recipes.

## Verify the behavior

Exercise ready, review, and provider-failure paths using an injected fixture client. Live calls are a separate action that uses the user's configured provider. When evaluating accuracy, follow [the evaluation guide](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/evaluation.md): retain responses and label provenance, freeze policy on development data, and reserve held-out cases. Preserve experimental labels when evidence is absent or acceptance fails.

[Jevthoven](https://jev-ai-music.com/) is a maintainer-built music application using the package, with sign-in required for playback. Its existence is integration evidence, not a model-quality benchmark.
