# Use a System One client

Every recipe accepts `{ client, model, signal }` as its second argument. A client supplies a `systemOne(request, options)` method. Recipe input validation, response parsing, and review policy remain the same when you inject a client.

## TypeSafe direct

```js
import { createClient } from 'jev-recipes';
import { route } from 'jev-recipes/route';

const client = createClient({
  apiKey: process.env.TYPESAFE_API_KEY,
  baseURL: 'https://api.typesafe.ai',
  defaultModel: 'jev-1.13.0',
});
const result = await route(
  {
    request: 'Please correct my invoice.',
    routes: { billing: 'Invoices', support: 'Product issues' },
  },
  { client },
);
```

Pin a model version when comparing evaluations. TypeSafe's aliases can change the model behind a request. The response reports the model that answered. See [TypeSafe models](https://docs.typesafe.ai/models).

## Vercel AI Gateway

Use the TypeSafe-compatible endpoint with a Gateway key. The example accepts `VERCEL_GATEWAY_API_KEY` first and `AI_GATEWAY_API_KEY` as a fallback. A blank explicit key is rejected. Validate that key before constructing the client so the SDK cannot fall back to a TypeSafe credential.

```js
import { createClient } from 'jev-recipes';
import { route } from 'jev-recipes/route';

const apiKey = process.env.VERCEL_GATEWAY_API_KEY ?? process.env.AI_GATEWAY_API_KEY;
if (!apiKey?.trim()) throw new Error('Set VERCEL_GATEWAY_API_KEY or AI_GATEWAY_API_KEY.');
const client = createClient({
  apiKey,
  baseURL: 'https://ai-gateway.vercel.sh/typesafe',
  defaultModel: 'typesafe-ai/jev',
});
const result = await route(
  {
    request: 'Please correct my invoice.',
    routes: { billing: 'Invoices', support: 'Product issues' },
  },
  { client },
);
```

The SDK posts to `/typesafe/v1/systemone`. This route retains TypeSafe's `choice`, `score`, and `noul` vocabulary and response shapes. It is distinct from Gateway's `evaluate` API. Gateway handles billing for this configuration. See [Vercel's TypeSafe client documentation](https://vercel.com/changelog/ai-gateway-now-supports-typesafe-clients-and-http-api-for-jev).

The executable examples are [clients.mjs](../examples/integrations/clients.mjs) and [run.mjs](../examples/integrations/run.mjs). After building, run `node --env-file-if-exists=.env examples/integrations/run.mjs direct --live` or `node --env-file-if-exists=.env examples/integrations/run.mjs gateway --live`. These commands make a paid request. Offline tests exercise the real SDK with an intercepted HTTP transport and assert the URL, model, authentication header, and parsed recipe result; their fixtures are separate from the [recorded live Gateway validation](gateway-validation.md).

## Compatibility contract

| Client                 | Required behavior                                                             | Verification                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| TypeSafe direct        | TypeSafe `systemOne` request/response format                                  | Real SDK transport exercised offline in `tests/tooling/integrations.test.mjs`                        |
| Vercel Gateway         | `/typesafe/v1/systemone`, Gateway credentials, `typesafe-ai/jev` model        | Same offline transport suite; recorded live checks in `evals/evidence/`                              |
| Custom injected client | `systemOne(request, { signal })` returning the same answer and metadata shape | Recipe contract tests validate parsing; each custom transport needs its own integration verification |

Choice answers contain a supplied choice label, a complete probability distribution, and confidence. Score answers contain a rubric expectation, probabilities by level, and confidence. Noul answers contain a probability from 0 to 1. Every response includes `model` and nonnegative integer input/output token usage. See [TypeSafe's primitives](https://docs.typesafe.ai/introduction).

An injected client must honor the supplied abort signal and reject failures. Recipes validate response shapes and reject malformed answers; they do not convert provider failures into successful judgments. Applications choose retries and concurrency. A ready decision is not permission to execute an action.

The Gateway response in the recorded smoke test identified itself as `typesafe-ai/jev`. This is an alias, not independently verified backend-version identity. Retain request and response model names and evaluation dates; do not infer that the underlying model stayed fixed across dates. A compatible transport does not establish a new model's accuracy or calibration.

For a local archived evaluation, see [Gateway evaluation](evaluation.md#gateway-evaluation). A BYOK credential stored in Vercel is separate from the Gateway key used locally. A successful request verifies the connection; it does not by itself establish which upstream credential Vercel used.

## Coding assistants

Discover the contract before writing an integration:

```sh
npx jev-recipes list "customer follow-up"
npx jev-recipes describe followup-timing
npx jev-recipes example followup-timing
npx jev-recipes demo followup-timing
```

Import the chosen recipe by its dedicated path. Validate user data against its input schema, supply only the necessary context, handle `status: 'review'`, and keep business state in application code. Test representative cases using [the evaluator](evaluation.md). No new server or discovery protocol is required.

## Check another System One model

Before describing a model as compatible, record its requested ID, returned ID, provider endpoint, SDK version, and date. Run transport tests for Choice, Score, and Noul, including malformed output and cancellation. Then run representative development cases with retained responses, freeze the model and confidence policy, and evaluate fresh held-out families. Keep compatibility separate from accuracy and calibration. An alias alone does not establish version stability.

The [support-routing fallback](../examples/support-routing/fallback.mjs) uses Gateway structured chat completions as a separate application step. It does not adapt arbitrary chat models into System One clients. See [Vercel structured outputs](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/structured-outputs).

## Observe calls without logging customer content

The [shared example recorder](../examples/shared/decisions.mjs) supports client injection, cancellation, elapsed time, model/token metadata, and an optional `onDecision` observer. The [customer queue](../examples/customer-queue/README.md#observe-decisions) demonstrates its use. Default events omit raw inputs, outputs, and provider error text. Observer failures do not change the decision. This is an example integration, not an additional runtime dependency or hosted telemetry service.
