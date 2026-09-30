# jev-recipes

**Typed AI decisions for agents, RAG, and support flows: route, rerank, gate, grade, compare, and label text with one function call. Plug into Vercel AI SDK or LangChain, or call any recipe directly.**

[![npm version](https://img.shields.io/npm/v/jev-recipes)](https://www.npmjs.com/package/jev-recipes)
[![CI](https://github.com/agencyenterprise/jev-recipes/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/agencyenterprise/jev-recipes/actions/workflows/ci.yml)
[![Node.js version](https://img.shields.io/node/v/jev-recipes)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE)

[Quickstart](#use-a-recipe) | [Live music app](https://jev-ai-music.com/) | [Coding assistants](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/coding-assistants.md) | [Recipe catalog](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md) | [API vs. SDK vs. recipes](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/api-sdk-recipes.md) | [Agent frameworks](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/framework-adapters.md) | [Contributing](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md)

<!-- BEGIN GENERATED: summary -->

248 focused recipes for JavaScript and TypeScript. Route messages, check evidence, and label model responses with a function call.

<!-- END GENERATED: summary -->

Each recipe accepts your data, calls [Jev through TypeSafe's System One API](https://docs.typesafe.ai/introduction) or an injected compatible client, and returns a structured decision. Use it in a Node.js backend, a script, or a research evaluation. Your application decides what happens next.

## Start with one decision

| Your task                         | Try without a key                     | Build the workflow                                                                                                                |
| --------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Route work to the right team      | `npx jev-recipes demo route`          | [Route work](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/getting-started/README.md#route-work)             |
| Select useful evidence            | `npx jev-recipes demo rerank`         | [Select evidence](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/getting-started/README.md#select-evidence)   |
| Review an agent's proposed action | `npx jev-recipes demo tool-call-gate` | [Review an action](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/getting-started/README.md#review-an-action) |

These demos use saved responses. The [runnable workflow examples](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/getting-started/README.md) show ready decisions, uncertainty, and provider failures. Use [TypeSafe directly or Vercel Gateway](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/integrations.md) for live calls.

For example, give `route` a support message and descriptions of your teams. It returns a team such as `billing`, or a review outcome when the choice is uncertain.

Evaluate your own cases with the [installed evaluator](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/evaluation.md), retain model responses, and replay confidence policies offline. The [agent workflow](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/agent-loop/README.md) and [customer queue](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/customer-queue/README.md) show how decisions fit into application code. [Direct and Gateway integrations](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/integrations.md) use the same recipe interface.

## Watch Jev play checkers against Jev using the checkers-move recipe

[![Jev plays checkers against Jev using the checkers-move recipe](https://raw.githubusercontent.com/agencyenterprise/jev-recipes/main/examples/checkers/jev-vs-jev.gif)](https://www.youtube.com/shorts/Z282rGKysTg)

## Build a complete support flow

The [support conversation starter](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/support-routing/README.md) checks for missing details, asks a configured question, and resumes with the customer's answer. It proposes a queue or requests human review when the conversation remains unresolved.

```sh
cd examples/support-routing
npm ci --ignore-scripts
npm run dev
```

Open `http://localhost:3000` and choose **Ask and continue**. This folder is portable and needs no repository build. Edit `config.mjs` to supply your queues, required information, questions, and review policy. Run `npm run demo` for the command-line version. Saved scenarios work without a key; the starter guide explains live calls and application integration.

The existing [rules/Jev/fallback comparison](https://github.com/agencyenterprise/jev-recipes/blob/main/evals/support-routing/README.md) covers single-turn routing, not this clarification loop. Its evidence remains experimental.

Build the searchable static catalog with `npm run site:build`, then preview it with `npm run site:preview`. It includes fixture exploration, related-recipe comparisons, and saved evaluation evidence. Current measurements and missing, unknown-origin, or older evidence are labeled explicitly. Use `npm run eval:audit` after building to check retained evidence offline; see [evaluation and archive format](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/evaluation.md#archive-format-and-evidence-origin).

## Hear a real application: Jevthoven

[Jevthoven](https://jev-ai-music.com/) is a music app built by this package's maintainer using jev-recipes. Its interface lets listeners choose a style, key, and tempo, and displays Jev's musical decisions alongside a piano roll. Playback requires sign-in.

[Open the music app](https://jev-ai-music.com/) · [Read the integration example](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/jevthoven/README.md)

This is a maintainer-built application, not an independent customer adoption claim or a recipe accuracy benchmark.

## Use a recipe

Requires **Node.js 22.9 or newer**, ES modules, and a **[TypeSafe API key](https://console.typesafe.ai/keys)**. Live calls send the supplied input to TypeSafe and use API quota.

**1. Install** in your project folder.

```sh
npm install jev-recipes
```

**2. Add the code below to your app**, or save it as `route-message.mjs` in the same folder to try a standalone Node example.

The `.mjs` extension is optional. We suggest it for this example because Node recognizes it as an ES module without changing your project settings. Existing apps can use `.js` with `"type": "module"` in `package.json`, or `.ts` with their usual TypeScript setup. See [Node's module formats](https://nodejs.org/api/packages.html#type).

<!-- BEGIN GENERATED: quickstart -->

```js
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice for my subscription. Can someone check the invoice?',
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken integrations',
  },
});

if (result.status === 'ready') {
  console.log('Send this message to:', result.route);
} else {
  console.log('Needs review: ask for more detail or send to a person.');
}
```

<!-- END GENERATED: quickstart -->

**3. Set your key and run.** Replace `your-api-key` with your TypeSafe key. For the standalone example:

```sh
export TYPESAFE_API_KEY='your-api-key'
node route-message.mjs
```

If you saved it as `route-message.js` in an ES module project, run `node route-message.js`. For an existing app or TypeScript project, use its normal start command.

<details>
<summary>Windows PowerShell</summary>

```powershell
$env:TYPESAFE_API_KEY = 'your-api-key'
node route-message.mjs
```

</details>

Example output:

```text
Send this message to: billing
```

A live result can differ. When the choice is uncertain, the script prints the review message instead.

**Make it yours:** replace `request` with your incoming message and `routes` with your team's names and descriptions. Replace `console.log` with your queue or handler logic. Keep the key and live calls on the server.

<a id="try-a-decision"></a>

<details>
<summary>Try the saved example without an API key</summary>

```sh
npx jev-recipes demo route
```

This runs an offline fixture and prints JSON with `result.status: "ready"` and `result.route: "billing"`. No model is called. Use it to inspect the interface before setting up a key.

</details>

## Why recipes?

The TypeSafe SDK handles API calls and typed answers. Recipes add the instructions, input and response validation, confidence policy, and result handling for a specific decision.

| Start with       | You provide                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| **Raw API**      | HTTP handling, question, choices, validation, and review logic             |
| **TypeSafe SDK** | Question, choices, task-specific validation, and review logic              |
| **jev-recipes**  | `route({ request, routes })` and the application code that uses its result |

[See the same task implemented all three ways](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/api-sdk-recipes.md). All three use the same service. Recipes reduce the decision logic you need to build, test, and maintain.

<a id="find-the-right-recipe"></a>

## Find your recipe

| Your task                                              | Start with                                                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Send a request to the right team                       | [`route`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/route/README.md)                     |
| Find useful passages                                   | [`rerank`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/rerank/README.md)                   |
| Check whether the evidence is enough to answer         | [`answerability`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/answerability/README.md)     |
| Check claims against supplied evidence                 | [`verify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/verify/README.md)                   |
| Find missing or ambiguous requirements                 | [`clarify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/clarify/README.md)                 |
| Label a response's stance toward a claim               | [`claim-stance`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/claim-stance/README.md)       |
| Choose a move from available game actions              | [`choose-action`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/choose-action/README.md)     |
| Choose a checkers move from your board and legal moves | [`checkers-move`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/checkers-move/README.md)     |
| Allow, ask, or deny an agent's tool call               | [`tool-call-gate`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/tool-call-gate/README.md)   |
| Check an agent's "done" against evidence               | [`completion-gate`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/completion-gate/README.md) |
| Pick a model tier and effort per request               | [`model-route`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/model-route/README.md)         |
| Route a backlog of messages in a few calls             | [`route-many`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/route-many/README.md)           |

Search, inspect inputs, and try saved results without a key:

```sh
npx jev-recipes list "enough evidence" --limit 5
npx jev-recipes describe answerability
npx jev-recipes demo answerability
```

[Browse the complete catalog](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md). Each guide includes an import, input reference, result behavior, limitations, and related recipes.

For games, use [game-action](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/game-action/README.md) with your existing JSON state and actions. It returns the original selected action, preserving your game IDs. [checkers-move](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/checkers-move/README.md) accepts a structured checkers board and legal moves; the [checkers example](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/checkers/README.md) shows how to run its visual demo locally.

For agent harnesses, browse [Agent harness](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#agent-harness) for the decisions inside an agent loop: `tool-call-gate` before a tool runs, `model-route` per turn, `context-prune` before compaction, `wake-gate` for paused agents, `diff-hazards` before a commit, and `completion-gate` before accepting a result. Search with `npx jev-recipes list harness`.

For psychology, browse [Psychology & behavior](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#psychology--behavior) for gain/loss framing, causal explanations, stated motivation, and related wording annotations. Search with `npx jev-recipes list psychology`.

For music, browse [Music & sound](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#music--sound) for generation-loop decisions such as `next-note` and `phrase-complete`, listener steering such as `listener-request-kind`, and instrument or music-software tooling. Pass musical state as text or JSON. Search with `npx jev-recipes list music`.

<a id="run-your-own-input-from-the-terminal"></a>

## Use the terminal

Create a JSON input file:

```sh
npx jev-recipes example route > input.json
```

Edit `request` and `routes` in `input.json`, then run with `TYPESAFE_API_KEY` set:

```sh
npx jev-recipes run route input.json
```

Read `result.status` and `result.route` in the JSON output. Substitute another recipe's name in both commands to use a different decision. Run `npx jev-recipes --help` for all commands.

The CLI reads environment variables; it does not automatically load `.env`. Errors go to stderr with exit code `1`. A review outcome is a completed evaluation, so inspect the result before acting.

<a id="understand-the-result"></a>

## Work with results

| Result or condition                                    | What it means                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `route`: `status: 'ready'`                             | `route` contains the chosen name. Your application can use it to choose a handler.                           |
| `route`: `status: 'review'`                            | `route` is `null`. Ask for clarification or involve a person.                                                |
| Other recipe results                                   | Inspect the verdict and per-item checks. A confident result can identify a conflict or an unsupported claim. |
| Invalid input, malformed response, or provider failure | The function throws. Handle errors in your application.                                                      |

Batch recipes expose their own summaries, such as `verify.allSupported` and its per-claim checks. Every result includes model and token usage. Confidence is a signal for your policy, not a guarantee of correctness.

Pass `{ client, model, signal }` as the optional second argument to configure a call. [Shared behavior and limits](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#shared-options-and-behavior) covers configuration, input limits, and uncertainty.

## Batch many inputs

A Jev request evaluates every question in parallel, so several inputs that share the same decision can travel together. `route-many` routes up to 500 requests in batches of 20 by default, making one call per batch instead of one per request:

```js
import { routeMany } from 'jev-recipes/route-many';

const result = await routeMany({
  requests: tickets.map((ticket) => ({ id: ticket.id, text: ticket.body })),
  routes: { billing: 'Payments and refunds', technical: 'Errors and outages' },
  batchSize: 20,
});

for (const item of result.items) {
  if (item.status === 'ready') assign(item.id, item.route);
  else queueForReview(item.id, item.suggestedRoute);
}
console.log(`${result.requestsMade} calls for ${result.requestCount} tickets`);
```

Accuracy can drop as batches grow. Measure on your own labeled data and tune `batchSize`; the [eval harness](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md#model-evaluation) reports calibration per threshold.

## Use inside an agent framework

`jev-recipes/ai-sdk` and `jev-recipes/langchain` plug the harness recipes into the loop you already run. With the Vercel AI SDK, `guardTools` reviews every tool call with `tool-call-gate`, `routeModelStep` picks the model per call with `model-route`, and `completionCheck` accepts a completion claim only when `completion-gate` sees evidence:

```js
import { generateText, stepCountIs } from 'ai';
import { completionCheck, guardTools, routeModelStep } from 'jev-recipes/ai-sdk';

const done = completionCheck();
const result = await generateText({
  model: careful,
  prompt: 'Run the account tests and publish release 1.2.0.',
  tools: { ...guardTools(tools, { policy: 'Ask before publishing.' }), ...done.tools },
  prepareStep: routeModelStep({ candidates: [{ id: 'fast', text: 'Small edits.', model: fast }] }),
  stopWhen: [stepCountIs(8), done.stopWhen],
});
```

Any recipe becomes a tool with `recipeTools(['route', 'verify'])`. The LangChain adapter offers the same guard, completion, and recipe tools for `bindTools`, `ToolNode`, and `createAgent`. Install `ai` or `@langchain/core` yourself; both are optional peers. See the [framework adapter guide](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/framework-adapters.md) and the offline [AI SDK](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/ai-sdk-agent/README.md) and [LangChain](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/langchain-tools/README.md) examples.

## Use a local or alternative decision model

Recipes talk to any server that implements the TypeSafe `systemOne` wire format. Point the SDK client at it with `baseURL`, or set `TYPESAFE_BASE_URL` in the environment, and pass the client to any recipe:

```js
import { createClient } from 'jev-recipes';
import { route } from 'jev-recipes/route';

const client = createClient({
  baseURL: 'http://localhost:11434', // a self-hosted, TypeSafe-compatible server
  apiKey: 'local',
});

const result = await route({ request, routes }, { client, model: 'my-local-model' });
```

The `model` option selects a model name on that server. Recipes validate every response against the same schemas, so a server that returns malformed probabilities fails loudly rather than silently. The tooling tests exercise this path against a local HTTP server.

## Verification and scope

The [CI workflow](https://github.com/agencyenterprise/jev-recipes/actions/workflows/ci.yml) runs on Node.js 22 and 24. `make ci` checks types, formatting, generated-file consistency, recipe test coverage, tooling, and the installable package.

- **Package checks:** create an npm archive, install it into a separate project, and exercise imports, declarations, and offline commands.
- **Recipe checks:** validate software behavior using mocked responses, including invalid inputs, confidence boundaries, and malformed answers.
- **Model evaluation:** offline tests and demos do not measure Jev's accuracy. Evaluate recipes on your own data for your intended use.

The package contains compiled code, type declarations, catalog data, and offline demo assets. Tests, build tools, and source guides stay out of the npm archive. [Publishing details](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md#releasing).

Direct imports such as `jev-recipes/route` load the selected recipe and its dependencies. Installation downloads one package; it does not selectively download individual recipes.

## AI alignment research

Recipes can serve as candidate annotation tools in controlled experiments. `claim-stance` labels expressed agreement, `verify` checks supplied evidence, and `draft-compare` compares responses under a rubric.

The [research guide](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/ai-alignment-research.md) covers validation against human annotations, handling uncertainty, and recording reproducible results. These labels describe observable outputs; they do not establish internal motives or prove that a model is aligned.

<a id="contribute"></a>

## Contributing and support

Built something with Jev? [Add your project to the examples](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/README.md#add-your-project). Share a runnable demo or a walkthrough with a link to your deployed app so others can try it and learn how it works.

[Report a bug or request a recipe](https://github.com/agencyenterprise/jev-recipes/issues). Include the recipe name, package and Node.js versions, and a minimal reproduction. Keep API keys and private inputs out of reports.

To work on the repository:

```sh
make setup
make docs
make ci
```

The recipe folder owns its implementation, schemas, metadata, demo, and guide. Exports and catalog entries are generated from those folders. Tests live under `tests/recipe/`.

[Contributing guide](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md)

## License

[MIT](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
