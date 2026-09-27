# Build with a coding assistant

The package's CLI gives an assistant the same catalog and contracts you can inspect yourself. Start with a task and let the assistant find a fitting recipe before writing calls.

Copy this prompt into your coding assistant:

> Use jev-recipes to route incoming support tickets in this project. Inspect the installed catalog and route schema first. Preserve our framework and provider setup. Show ready, review, and provider-failure paths with offline fixtures. Keep dispatch and permissions in application code. Explain any live calls before running them.

For evidence selection, replace the task with “rank retrieved passages while retaining their source IDs.” For action review, use “review proposed tool calls against our application policy.” See the [three examples](../examples/getting-started/README.md).

## Optional repository skill

[The jev-recipes skill](../skills/jev-recipes/SKILL.md) provides focused instructions for discovering recipes, handling uncertainty, and checking evidence. After these repository changes are published, a skills-compatible installer can install it:

```sh
npx skills add agencyenterprise/jev-recipes --skill jev-recipes
```

For local use now, point your assistant at `skills/jev-recipes/SKILL.md` in this checkout. This skill is separate from the npm release and does not require a runtime dependency or server. It complements the [official TypeSafe skill](https://github.com/typesafe-ai/skills), which covers the underlying API; it is not endorsed by TypeSafe.

## Inspect without calling Jev

Once the package is installed in your project:

```sh
npx --no-install jev-recipes list "select evidence" --limit 5
npx --no-install jev-recipes describe rerank
npx --no-install jev-recipes example rerank
npx --no-install jev-recipes demo rerank
```

The installed version supplies these contracts. Review its evidence fields and limitations before relying on a recipe. A compatible provider and a passing fixture test do not establish live accuracy.
