# A customer queue that proposes the next step

Build the package, then run `node examples/customer-queue/run.mjs`. It uses offline fixtures unless you add `--live` and provide `TYPESAFE_API_KEY`. Both modes return proposals and traces. Neither sends messages, places calls, changes an external subscription, or assigns work in another system.

Read [workflow.mjs](workflow.mjs) in processing order. Route the batch, recognize contact restrictions, link short follow-ups, decide whether a reply is needed, preserve the current owner, check handover rules, identify follow-up timing and callback responsibility, then check any proposed reply for unsupported promises.

The state and message batch belong to one customer. The application partitions incoming messages by customer and owns request history, handover state, contact preferences, and message IDs. Persist the returned state and proposals together in one transaction before acknowledging the input queue. Dispatch accepted proposals through an application outbox. Review proposals leave the message unacknowledged; place them in a review queue rather than retrying them indefinitely. This in-memory example does not provide a durable queue or distributed lock.

A scoped opt-out returns review with the original message so the application can identify the exact channel or campaign. An all-contact opt-out updates the returned local state. A later `none` result never clears that restriction. Acknowledgments preserve a completed handover instead of requesting another transfer.

The tests cover short follow-ups, duplicate delivery, opt-outs, unsupported callback promises, ambiguity, provider failure, and acknowledgments after handover. Fixture outputs test these branches; they are not measured accuracy. Applications must resolve dates, schedule events, enforce existing contact preferences, and review drafts before sending.

## Ask only for missing information

[clarification.mjs](clarification.mjs) composes the existing `clarify` recipe with application-owned questions. Requirements are ordered by application priority. A confident missing or ambiguous requirement selects its predefined question; already-supplied information is skipped. Uncertain decisions, missing question text, and provider errors return review. All requirements present returns `continue`. The example proposes a question without sending it.

`node examples/customer-queue/run.mjs` includes an offline already-answered scenario. Fixture tests cover missing, answered, uncertain, and failed checks. They verify control flow, not whether the model correctly understands a real conversation.

## Observe decisions

The shared recorder returns recipe/model, elapsed milliseconds, usage, and outcome. Pass `onDecision(event)` to copy these metadata events into your own logger. Observer exceptions, rejected promises, and mutations do not affect recipe results. Raw inputs, results, and provider error messages are omitted by default. `includeContent: true` deliberately adds input/result content for local debugging; keep it off for normal telemetry. Authentication configuration is never included.

Handovers are application-confirmed state. Returning `propose_handover` does not mark a handover complete; set `handoverCompleted` only after the application confirms it. Existing owners are preserved even if a fresh route suggestion differs. Persist and dispatch proposals with the transaction/outbox boundary described above.
