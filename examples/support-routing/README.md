# A support conversation that reaches a next step

Run a customer request through `clarify` and `route`. The result proposes a queue, asks one application-defined question, or requests human review. Answering the question resumes the conversation with the original request and all previous answers. An unresolved answer stops at review instead of repeating the question.

## Run the starter

This folder is self-contained. Copy `examples/support-routing/` into your project, or run it here. It does not need the repository build or files from other examples. Requires Node.js 22.9 or newer.

```sh
cd examples/support-routing
npm ci --ignore-scripts
npm run demo
npm run dev
```

Open `http://localhost:3000`. Choose **Ask and continue**, run the request, then use the saved answer. The example first asks what happened, then proposes the technical queue. **Still unclear** and **Conflicting context** end in review after the saved answer. Other scenarios demonstrate direct routing, an indirect request, independent requests spanning queues, no matching queue, fallback, and a provider failure.

All saved responses are hand-authored fixtures. They test application behavior, not whether a live model understands those messages. The pinned npm package and dependencies are in [package.json](package.json) and its lockfile. The same tests also run against the repository's newly packed package.

## Make it yours

Edit [config.mjs](config.mjs):

| Setting         | Your decision                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `routes`        | Queue IDs and descriptions with clear responsibilities                                                                       |
| `requirements`  | Information needed before routing, ordered by priority; each item includes `id`, `description`, and a predefined `question`  |
| `minConfidence` | Minimum confidence for both the information check and primary route; this score is not a measured probability of correctness |
| `maxQuestions`  | Maximum clarification answers in a conversation, from 0 to 5; zero sends missing information to review                       |

Use `requirements: []` when routing does not need a separate information check. With requirements configured, a turn uses one `clarify` call, then one `route` call only if the details are present. Optional fallback adds at most one request to that turn. The live client disables SDK retries. The workflow makes no automatic follow-up turns.

Models judge whether natural-language details are present and which queue fits. Code handles question order, limits, validation, cancellation, and whether a question has already been answered. Exact IDs, dates, required form fields, permissions, and business rules belong in application code.

## Connect live calls

For the web app, copy `web/.env.example` to `web/.env.local`, set `SUPPORT_ROUTING_MODE=live`, and supply `VERCEL_GATEWAY_API_KEY` or `AI_GATEWAY_API_KEY`. Restart the server. Add `SUPPORT_FALLBACK_MODEL` only if you want one second opinion on low-confidence route suggestions. No fallback is enabled by default. Credentials stay on the server.

For the command-line example, export your Gateway key and run:

```sh
node run.mjs --live --request 'Something is wrong. Can you help?'
node run.mjs --live --request 'Something is wrong. Can you help?' --answer 'issue=The app crashes when I export a report.'
```

Use the `requirementId` from a `propose_question` result in `--answer id=text`; repeat the flag for additional answers. Add `--fallback-model <model-id>` to opt into a second opinion. Live mode sends the supplied conversation to the configured providers and uses API quota. No live accuracy or savings claim is made for this conversation loop.

## Integrate the workflow

[conversation.mjs](conversation.mjs) reads in processing order: validate the conversation and configuration, check required details, ask or review unresolved details, then propose a route. [workflow.mjs](workflow.mjs) handles the route and optional fallback. [conversation-schema.mjs](conversation-schema.mjs) defines the input, configuration, and output contracts.

```js
import { proposeSupportNextStep } from './conversation.mjs';
import { supportConfig } from './config.mjs';
import { createGatewayClient } from './client.mjs';

const conversation = {
  request: 'Something is wrong. Can you help?',
  answers: [], // Later: [{ requirementId: 'issue', text: 'Exports crash.' }]
};

const proposal = await proposeSupportNextStep(conversation, supportConfig, {
  client: createGatewayClient({ retry: { maxRetries: 0 } }),
  // signal: yourAbortController.signal,
});

switch (proposal.action) {
  case 'propose_question':
    console.log(proposal.requirementId, proposal.question);
    break;
  case 'propose_route':
    console.log(proposal.route);
    break;
  case 'review':
    console.log(proposal.reason);
    break;
}
```

| Outcome            | Result                                                | Application's next step                                                                              |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `propose_question` | `requirementId` and predefined `question`; null route | Display or approve the question, collect an answer, append `{ requirementId, text }`, and call again |
| `propose_route`    | A supplied queue ID in `route`; null question         | Confirm and assign the ticket through your application                                               |
| `review`           | A reason; null route and question                     | Preserve the conversation for a person or an explicit retry after a provider failure                 |

Every result includes a trace of the stages in that turn, with status, model identity when available, and requirement verdicts. Conversation traces omit raw provider errors and responses. A `review` result can mean uncertain information, an unresolved answer, a question limit, no clear queue, or a provider failure. Cancellation throws and stops subsequent stages. Invalid input or configuration throws before provider calls. Conversation text, including configured questions and answers, is limited to 12,000 characters when serialized.

Keep the complete conversation on every turn. The application owns customer identity, authoritative history, persistence, duplicate delivery handling, human review, sending questions, and ticket assignment. The browser demo stores history only in memory and loses it on reload. Before exposing the endpoint publicly, add application authentication and request limits. The starter does not supply a ticket system or durable review queue.

## Choose the recipe

- Use `route` for one request and a supplied set of queues.
- Use `route-many` for independent requests that can be judged in batches. It does not manage a multi-turn conversation.
- Use `clarify` when deciding whether natural-language information satisfies explicit requirements. It neither discovers requirements nor generates questions.

## Verify changes

```sh
npm test
npm run typecheck
npm run build
npm start
```

Tests exercise both the workflow and HTTP handler: question/answer/resume, already-supplied information, unresolved and conflicting answers, question priority and limits, no fit, optional fallback, malformed responses, errors, and cancellation. Tests use authored responses and make no live provider calls. The web build uses only this folder and its installed dependencies.

The repository's [existing routing comparison](https://github.com/agencyenterprise/jev-recipes/tree/main/evals/support-routing) measures the single-turn routing branch. Its historical results do not measure this new clarification loop. Use the existing package evaluator for budgeted recipe measurements, retain responses, and distinguish development data from held-out cases before making live quality claims.

Repository maintainers own this example; adopters own their applications and deployments. Report issues in the [project tracker](https://github.com/agencyenterprise/jev-recipes/issues). Nothing in this starter assigns tickets or sends customer messages automatically.
