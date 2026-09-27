# Use the existing client interface

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

Use the TypeSafe-compatible endpoint with a Gateway key. Validate that key before constructing the client so the SDK cannot fall back to a TypeSafe credential.

```js
import { createClient } from 'jev-recipes';
import { route } from 'jev-recipes/route';

const apiKey = process.env.AI_GATEWAY_API_KEY;
if (!apiKey?.trim()) throw new Error('Set AI_GATEWAY_API_KEY.');
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

The executable examples are [clients.mjs](../examples/integrations/clients.mjs) and [run.mjs](../examples/integrations/run.mjs). After building, run `node --env-file-if-exists=.env examples/integrations/run.mjs direct --live` or `node --env-file-if-exists=.env examples/integrations/run.mjs gateway --live`. These commands make a paid request. Offline tests exercise the real SDK with an intercepted HTTP transport and assert the URL, model, authentication header, and parsed recipe result; they do not claim a live Gateway smoke test.

## Coding assistants

Discover the contract before writing an integration:

```sh
npx jev-recipes list "customer follow-up"
npx jev-recipes describe followup-timing
npx jev-recipes example followup-timing
npx jev-recipes demo followup-timing
```

Import the chosen recipe by its dedicated path. Validate user data against its input schema, supply only the necessary context, handle `status: 'review'`, and keep business state in application code. Test representative cases using [the evaluator](evaluation.md). No new server or discovery protocol is required.
