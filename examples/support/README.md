# Support assistant

A support workflow built from the recipe catalog. The workflow lives here so each recipe remains independently usable.

From the repository, after `npm run build`:

```sh
npm run example:support
```

The default run uses hand-authored Jev responses and a saved draft from [demo.json](demo.json). It requires no API key and makes no model calls.

To use live Jev decisions with the same saved draft:

```sh
npm run example:support -- --live
```

This loads `TYPESAFE_API_KEY` from `.env`, sends synthetic fixture inputs to TypeSafe, and makes up to six Jev requests with retries disabled. There is no generative model call. The output identifies the mode, outcome, and decisions made before stopping.

After installing a packed or released package, you can run the compiled example directly:

```sh
node node_modules/jev-recipes/dist/examples/support/index.js
node --env-file=.env node_modules/jev-recipes/dist/examples/support/index.js --live
```

## Follow the flow

Read [workflow.ts](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/support/workflow.ts) from top to bottom:

1. `handoff` checks escalation rules first. A human request or uncertainty stops here.
2. `clarify` checks the information needed to proceed.
3. `route` selects the support handler. Its name is passed to the draft callback.
4. `rerank` selects useful passages from evidence the application already retrieved.
5. `answerability` checks whether those passages answer the question.
6. Your `draftAnswer` callback creates claims with references to selected evidence IDs.
7. `verify` checks each claim against the referenced original passages.
8. The final answer joins only those checked claims after all are supported.

The workflow rejects references to evidence that was not selected. The callback supplies IDs, never replacement evidence text. The final response contains no unchecked prose outside the supplied claims. Claim verification still does not establish source truth or guarantee that the answer covers every part of the question.

## Adapt it

Copy `workflow.ts` and `schema.ts` into your application. Replace their repository-relative imports with `jev-recipes` or individual recipe exports. The example schemas also use lower-level recipe schemas; either define your application's shapes locally or derive them from each exported input schema's `.shape`.

Supply your own routes, requirements, handoff rules, and retrieved evidence. Replace the runner's saved-draft callback with your existing generation code, returning `{ claims: [{ id, claim, evidenceIds }] }`. The callback receives the original request, optional conversation context, selected route, and selected passages. You choose the model and framework.

A caller can import the source workflow within this repository:

```ts
import { answerSupportRequest } from './workflow.js';

const result = await answerSupportRequest(input, draftAnswer, { client });
if (result.outcome === 'answered') console.log(result.answer);
```

The possible outcomes are `answered`, `human`, `review`, `clarification`, `no_evidence`, `cannot_answer`, and `unverified`. Stopped results identify the `stage`. Results include completed `decisions` for inspection. Only `answered` includes an answer; errors in inputs, draft references, model responses, or transport throw.

This example does not retrieve documents, send responses, open tickets, or make account changes. Your application handles those actions and follows its own review policy. The example is not an accuracy benchmark.
