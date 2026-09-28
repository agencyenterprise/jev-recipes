# Support routing in a web app

A small Next.js and TypeScript app makes the [shared routing workflow](../workflow.mjs) visible. It starts with four fixed fixture scenarios and needs no API key. The server returns a proposal; it never assigns tickets.

## Run locally

Build the package from the repository root, then install the isolated web dependencies:

```sh
npm ci --ignore-scripts
npm run build
cd examples/support-routing/web
npm ci --ignore-scripts
npm run dev
```

Open `http://localhost:3000`. This is a repository starter: keep the shared example files in place. Copying only `web/` omits its workflow and provider helpers. The web manifest has its own lockfile and does not add React or Next.js to the recipe package. Shared helpers use the root package build; the UI dependency manifest pins the published package version separately.

`npm run typecheck` checks the TypeScript app. `npm run build` produces a production build; `npm start` serves that build on localhost. Root tooling tests exercise the HTTP handler without Next.js or network access.

## Enable live mode

Copy `.env.example` to `.env.local` inside this folder and set:

```dotenv
SUPPORT_ROUTING_MODE=live
VERCEL_GATEWAY_API_KEY=your-gateway-key
SUPPORT_FALLBACK_MODEL=google/gemini-2.5-flash-lite
```

Restart the server. Leave `SUPPORT_FALLBACK_MODEL` blank to use Jev alone. The banner distinguishes live calls from fixture responses. Credentials stay in server environment variables; never prefix them with `NEXT_PUBLIC_`. Live text is sent to the configured model providers.

The request handler validates a maximum 12,000-character message, accepts only supported fields, passes cancellation through, and returns a decision summary without raw provider responses. A failed provider keeps the request in review. The browser's Cancel button cancels waiting; it cannot undo a provider request already received.

## Application responsibilities

The app is intended for local learning. It has no authentication, rate limiting, persistent review queue, or ticket integration. Before hosting live mode, the application owner must supply access controls and request limits appropriate to their users. The repository does not deploy the app. See the [example contribution guide](../../README.md) to share your own hosted project.

Fixture responses demonstrate behavior only. Live quality belongs in the separate [archived comparison](../../../evals/support-routing/README.md), not in a browser success badge.
