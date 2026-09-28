# Support conversation web app

Run commands from the parent `support-routing/` folder:

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://localhost:3000`. Choose **Ask and continue**, run the request, then use its saved answer to resume. Choose **Still unclear** to see an unresolved conversation move to human review. Fixture responses demonstrate behavior only.

The complete portable starter is the parent folder, including its package manifest, configuration, recipes' calling code, tests, and this web app. Copying only `web/` omits application code. No files outside the starter are required.

To enable live mode, copy `.env.example` to `.env.local` here, set `SUPPORT_ROUTING_MODE=live`, and add your Gateway key. The server alone reads credentials. `SUPPORT_FALLBACK_MODEL` is optional and disabled by default. Restart the app after changing environment settings.

Edit `../config.mjs` to define your queues, required information, predefined questions, confidence threshold, and question limit. The browser retains the current conversation in memory; reloading clears it. The endpoint accepts the original request and prior `{ requirementId, text }` answers, and returns `propose_question`, `propose_route`, or `review`. Questions come from server configuration. Fixture mode only accepts the saved scenario's answer.

`npm test` checks the workflow and handler offline. `npm run typecheck` checks the UI. `npm run build` and `npm start` produce and serve the production app. The handler passes cancellation to providers and hides their raw responses and errors. Invalid conversations fail before provider access.

See the [starter guide](../README.md) for contracts, call counts, integration code, and application responsibilities. The starter has no authentication, persistent review queue, or ticket integration; those belong to the host application.
