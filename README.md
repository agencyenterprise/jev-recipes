# jev-recipes

**Small AI decisions. Ready to use in your code.**

[![npm version](https://img.shields.io/npm/v/jev-recipes)](https://www.npmjs.com/package/jev-recipes)
[![CI](https://github.com/agencyenterprise/jev-recipes/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/agencyenterprise/jev-recipes/actions/workflows/ci.yml)
[![Node.js version](https://img.shields.io/node/v/jev-recipes)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE)

[Quickstart](#use-a-recipe) | [Recipe catalog](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md) | [API vs. SDK vs. recipes](https://github.com/agencyenterprise/jev-recipes/blob/main/docs/api-sdk-recipes.md) | [Contributing](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md)

<!-- BEGIN GENERATED: summary -->

117 focused recipes for JavaScript and TypeScript. Route messages, check evidence, and label model responses with a function call.

<!-- END GENERATED: summary -->

Each recipe accepts your data, calls [Jev through TypeSafe's API](https://docs.typesafe.ai/introduction), and returns a structured decision. Use it in a Node.js backend, a script, or a research evaluation. Your application decides what happens next.

For example, give `route` a support message and descriptions of your teams. It returns a team such as `billing`, or a review outcome when the choice is uncertain.

## Watch Jev play checkers against Jev using the checkers-move recipe

[![Jev plays checkers against Jev using the checkers-move recipe](https://raw.githubusercontent.com/agencyenterprise/jev-recipes/main/examples/checkers/jev-vs-jev.gif)](https://www.youtube.com/shorts/Z282rGKysTg)

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

| Your task                                              | Start with                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Send a request to the right team                       | [`route`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/route/README.md)                 |
| Find useful passages                                   | [`rerank`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/rerank/README.md)               |
| Check whether the evidence is enough to answer         | [`answerability`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/answerability/README.md) |
| Check claims against supplied evidence                 | [`verify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/verify/README.md)               |
| Find missing or ambiguous requirements                 | [`clarify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/clarify/README.md)             |
| Label a response's stance toward a claim               | [`claim-stance`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/claim-stance/README.md)   |
| Choose a move from available game actions              | [`choose-action`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/choose-action/README.md) |
| Choose a checkers move from your board and legal moves | [`checkers-move`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/checkers-move/README.md) |

Search, inspect inputs, and try saved results without a key:

```sh
npx jev-recipes list "enough evidence" --limit 5
npx jev-recipes describe answerability
npx jev-recipes demo answerability
```

[Browse the complete catalog](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md). Each guide includes an import, input reference, result behavior, limitations, and related recipes.

For games, use [game-action](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/game-action/README.md) with your existing JSON state and actions. It returns the original selected action, preserving your game IDs. [checkers-move](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/checkers-move/README.md) accepts a structured checkers board and legal moves; the [checkers example](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/checkers/README.md) shows how to run its visual demo locally.

For psychology, browse [Psychology & behavior](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#psychology--behavior) for gain/loss framing, causal explanations, stated motivation, and related wording annotations. Search with `npx jev-recipes list psychology`.

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
