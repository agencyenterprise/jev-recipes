# Build something with Jev

Made a game, music app, developer tool, or something unexpected with jev-recipes? Share it here so other developers can try it and learn from it.

## Explore the examples

- [Support routing](support-routing/README.md): a portable conversation starter that asks for missing information, resumes with an answer, and proposes a queue or human review.
- [Jevthoven](jevthoven/README.md): a live music app and a walkthrough of its recipe decisions.
- [Checkers](checkers/README.md): run a visual game with Jev choosing moves.
- [Getting started](getting-started/README.md): route work, select evidence, and review actions using saved responses.
- [AI SDK agent](ai-sdk-agent/README.md) and [LangChain tools](langchain-tools/README.md): plug guard, routing, and completion decisions into an agent framework.
- [Agent loop](agent-loop/README.md), [customer queue](customer-queue/README.md), and [ingestion](ingestion/README.md): compose decisions into application workflows.

## Add your project

Open a pull request adding `examples/your-project/README.md`. You can contribute a small runnable example or a walkthrough that links to an app you host. Deploy the app on your own hosting service, then include its live URL here. Adding a folder does not deploy it.

Tell readers:

- **What they can try.** Describe the project, link to the live app or public source, and mention any sign-in or payment requirements.
- **What Jev decides.** Name the recipes, show their inputs and outputs, and explain what your application does with uncertain decisions or provider failures.
- **How to run it.** For included code, give install and run commands, the tested package version and provider, and environment variable names with placeholder values. Keep credentials server-side.
- **What you checked.** Include a reproducible test or demonstration. Label saved or mocked responses separately from live results, and describe known limits.
- **Who maintains it.** Credit the author, link to the project's support location, and state your relationship to jev-recipes. Include only code and assets you have permission to share.

Use the optional [project template](TEMPLATE.md), [Jevthoven's walkthrough](jevthoven/README.md) as a starting point for a hosted project, or [checkers](checkers/README.md) for a runnable example. Keep application-specific setup beside your example and leave secrets, build output, and dependencies out of the contribution. Project authors maintain their apps and deployments.

Have a project to share but no pull request ready? [Share an integration](https://github.com/agencyenterprise/jev-recipes/issues/new?template=share-integration.yml). An early experiment is welcome when its limits are clear.
