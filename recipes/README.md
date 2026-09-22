# Recipe catalog

66 small decisions for AI applications. Every recipe has its own input and result schemas, example, and usage guide. The package exports camelCase functions from kebab-case paths: `answerCoverage` from `jev-recipes/answer-coverage`, for example.

Browse the groups below, or use `npm run jev -- list <query>` and `npm run jev -- describe <recipe>` from the repository. Discovery does not call Jev. The original six recipes retain their existing result shapes; each guide describes its contract.

## Answer quality

| Recipe                                               | Function            | Decision                                                                                               |
| ---------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| [`answer-coverage`](answer-coverage/README.md)       | `answerCoverage`    | Check whether a draft answers each supplied question.                                                  |
| [`answer-relevance`](answer-relevance/README.md)     | `answerRelevance`   | How directly does draft address request?                                                               |
| [`citation-match`](citation-match/README.md)         | `citationMatch`     | Find supplied passages that independently support an entire claim.                                     |
| [`citation-needed`](citation-needed/README.md)       | `citationNeeded`    | Do citationRules require evidence for statement?                                                       |
| [`answer-consistency`](answer-consistency/README.md) | `answerConsistency` | Do firstStatement and secondStatement make compatible claims about the same subject and circumstances? |
| [`summary-coverage`](summary-coverage/README.md)     | `summaryCoverage`   | Check whether a summary preserves each supplied point.                                                 |
| [`certainty-match`](certainty-match/README.md)       | `certaintyMatch`    | Does the certainty expressed in draft match assessment?                                                |
| [`promise-check`](promise-check/README.md)           | `promiseCheck`      | Does reply promise actions or outcomes beyond allowedCommitments?                                      |
| [`tone-check`](tone-check/README.md)                 | `toneCheck`         | Check a draft against each supplied writing criterion.                                                 |
| [`draft-compare`](draft-compare/README.md)           | `draftCompare`      | Which draft better satisfies request under rubric?                                                     |

## Retrieval and evidence

| Recipe                                                   | Function              | Decision                                                                                                     |
| -------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`rerank`](rerank/README.md)                             | `rerank`              | Select and order relevant passages.                                                                          |
| [`verify`](verify/README.md)                             | `verify`              | Check claims against supplied evidence.                                                                      |
| [`answerability`](answerability/README.md)               | `answerability`       | Check whether evidence can answer the question.                                                              |
| [`retrieval-needed`](retrieval-needed/README.md)         | `retrievalNeeded`     | Does request require facts beyond context?                                                                   |
| [`freshness-needed`](freshness-needed/README.md)         | `freshnessNeeded`     | Does question require a current or time-specific state that can change, or stable conceptual knowledge?      |
| [`source-applicability`](source-applicability/README.md) | `sourceApplicability` | Does the scope described in passage apply to scenario?                                                       |
| [`evidence-conflict`](evidence-conflict/README.md)       | `evidenceConflict`    | Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions? |
| [`passage-duplicate`](passage-duplicate/README.md)       | `passageDuplicate`    | How much material information do firstPassage and secondPassage share?                                       |
| [`evidence-novelty`](evidence-novelty/README.md)         | `evidenceNovelty`     | Does passage add material information relevant to question beyond existingEvidence?                          |
| [`cache-match`](cache-match/README.md)                   | `cacheMatch`          | Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion?        |
| [`query-equivalence`](query-equivalence/README.md)       | `queryEquivalence`    | Do firstQuestion and secondQuestion request the same information under the same stated conditions?           |
| [`context-role`](context-role/README.md)                 | `contextRole`         | What role does passage play in answering question?                                                           |
| [`query-specificity`](query-specificity/README.md)       | `querySpecificity`    | Does question, interpreted with context, identify a focused information need?                                |

## Conversation

| Recipe                                               | Function            | Decision                                                                           |
| ---------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| [`clarify`](clarify/README.md)                       | `clarify`           | Find missing or ambiguous requirements.                                            |
| [`turn-intent`](turn-intent/README.md)               | `turnIntent`        | What is the primary communicative purpose of message in context?                   |
| [`followup-link`](followup-link/README.md)           | `followupLink`      | Which supplied earlier request does message follow up on?                          |
| [`reference-resolve`](reference-resolve/README.md)   | `referenceResolve`  | Which supplied candidate does reference refer to in message and context?           |
| [`intent-change`](intent-change/README.md)           | `intentChange`      | How does message change currentGoal?                                               |
| [`correction-target`](correction-target/README.md)   | `correctionTarget`  | Which supplied field or statement is message correcting?                           |
| [`confirmation-match`](confirmation-match/README.md) | `confirmationMatch` | Does response clearly agree to or reject this exact proposal?                      |
| [`cancellation-check`](cancellation-check/README.md) | `cancellationCheck` | Does message ask to cancel, pause, or continue task?                               |
| [`topic-shift`](topic-shift/README.md)               | `topicShift`        | Does message stay with currentTopic, introduce a different topic, or contain both? |
| [`response-needed`](response-needed/README.md)       | `responseNeeded`    | Does message require a substantive reply in context?                               |
| [`resolution-check`](resolution-check/README.md)     | `resolutionCheck`   | Does message establish that the customer reports issue as resolved?                |

## Tools and tasks

| Recipe                                             | Function           | Decision                                                                                 |
| -------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| [`route`](route/README.md)                         | `route`            | Choose a handler for a request.                                                          |
| [`handoff`](handoff/README.md)                     | `handoff`          | Check your rules for involving a human.                                                  |
| [`tool-fit`](tool-fit/README.md)                   | `toolFit`          | Can the capabilities explicitly described in tool perform task?                          |
| [`argument-fit`](argument-fit/README.md)           | `argumentFit`      | Does proposedValue for argument express the intended value in request and context?       |
| [`result-usefulness`](result-usefulness/README.md) | `resultUsefulness` | Does result provide information useful for task?                                         |
| [`result-outcome`](result-outcome/README.md)       | `resultOutcome`    | What outcome does result report for task?                                                |
| [`action-scope`](action-scope/README.md)           | `actionScope`      | Is proposedAction within the work requested in request and constraints?                  |
| [`step-progress`](step-progress/README.md)         | `stepProgress`     | How does observation change progress toward objective relative to previousState?         |
| [`repeated-attempt`](repeated-attempt/README.md)   | `repeatedAttempt`  | Does proposedAttempt use essentially the same approach as previousAttempt for objective? |
| [`step-complete`](step-complete/README.md)         | `stepComplete`     | Does evidence establish that condition has been met?                                     |
| [`failure-kind`](failure-kind/README.md)           | `failureKind`      | Which supplied category best describes the observed failure?                             |
| [`instruction-fit`](instruction-fit/README.md)     | `instructionFit`   | Does the explicit scope of instruction cover task and context?                           |

## Customer support

| Recipe                                                   | Function             | Decision                                                                     |
| -------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| [`issue-impact`](issue-impact/README.md)                 | `issueImpact`        | What practical impact does message explicitly describe?                      |
| [`attempted-step`](attempted-step/README.md)             | `attemptedStep`      | Does conversation establish whether the customer already performed step?     |
| [`workaround-fit`](workaround-fit/README.md)             | `workaroundFit`      | Can workaround address issue without violating constraints?                  |
| [`ticket-match`](ticket-match/README.md)                 | `ticketMatch`        | Do firstTicket and secondTicket describe the same underlying reported issue? |
| [`incident-match`](incident-match/README.md)             | `incidentMatch`      | Which supplied incident is supported as a match for ticket?                  |
| [`troubleshooting-fit`](troubleshooting-fit/README.md)   | `troubleshootingFit` | Does procedure address symptoms under the described circumstances?           |
| [`frustration-signal`](frustration-signal/README.md)     | `frustrationSignal`  | Does message express frustration or dissatisfaction in its wording?          |
| [`urgency-signal`](urgency-signal/README.md)             | `urgencySignal`      | Does message explicitly request urgent attention?                            |
| [`feedback-kind`](feedback-kind/README.md)               | `feedbackKind`       | What is the primary kind of feedback in message?                             |
| [`reply-template-match`](reply-template-match/README.md) | `replyTemplateMatch` | Which supplied approved template applies to request and context?             |

## Memory

| Recipe                                         | Function         | Decision                                                                                   |
| ---------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| [`memory-value`](memory-value/README.md)       | `memoryValue`    | How useful is fact for future work under purpose?                                          |
| [`memory-scope`](memory-scope/README.md)       | `memoryScope`    | What is the narrowest explicitly supported scope of fact in context?                       |
| [`memory-relation`](memory-relation/README.md) | `memoryRelation` | How does newFact relate to existingMemory?                                                 |
| [`preference-kind`](preference-kind/README.md) | `preferenceKind` | Does statement express an ongoing preference, a factual assertion, or a temporary request? |
| [`fact-stability`](fact-stability/README.md)   | `factStability`  | Is fact about an enduring or historical attribute, or a state that is expected to change?  |

## Knowledge maintenance

| Recipe                                                 | Function             | Decision                                                                                                |
| ------------------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------- |
| [`document-role`](document-role/README.md)             | `documentRole`       | What is the primary purpose of document?                                                                |
| [`audience-fit`](audience-fit/README.md)               | `audienceFit`        | Does the level of explanation in document fit the knowledge and needs explicitly described in audience? |
| [`change-meaning`](change-meaning/README.md)           | `changeMeaning`      | Does the revision from before to after change material meaning, conditions, or obligations?             |
| [`answer-invalidation`](answer-invalidation/README.md) | `answerInvalidation` | Does updatedEvidence still support the entire claim that was based on previousEvidence?                 |
| [`field-select`](field-select/README.md)               | `fieldSelect`        | Which supplied candidate is the value of field in document?                                             |

## Shared options and behavior

- Pass `{ client, model, signal }` as an optional second argument to any recipe. The default client reads `TYPESAFE_API_KEY` from the process environment.
- New recipes default `minConfidence` to `0.8`. A decision below the threshold requires review. An explicit `unclear` or `ambiguous` verdict also requires review even at high confidence.
- `ready` describes confidence in the assessment. Inspect the verdict too: a ready result can describe a conflict, missing information, or an unsuitable candidate.
- Candidate selectors return `selection` only for a ready match. `suggestedSelection` preserves a low-confidence suggestion. Candidate probabilities use your supplied IDs; no candidate match and ambiguity are separate outcomes.
- Item checks preserve each item's ID, verdict, confidence, and status. The coverage and tone recipes also provide `allAnswered`, `allPreserved`, or `allPassed` as appropriate.
- Model and token usage accompany every result. Inputs and model responses are validated with Zod 4. Invalid input, malformed answers, and provider failures throw.
- Shared `{ id, text }` lists accept 1 to 50 items with unique non-empty IDs. The original recipes document their own limits. Provider context limits may require smaller inputs; content is not silently truncated.

## Reuse and side effects

The new recipes share small helpers for choices, candidate selection, and item checks. Each recipe owns its question and decision rules. `citation-match` composes the public `verify` function; its guide and catalog `uses` field name that dependency.

Each current recipe makes one logical Jev request per live invocation. Batch checks place their questions in that request. SDK retries can add transport attempts. The recipes return decisions without executing application actions. The separate support example makes up to six logical requests and can stop early.

## Examples and limits

Every `demo.json` includes input and a hand-authored response. These examples illustrate behavior; they are not model accuracy results. Use `example <recipe>` to obtain editable input and `demo <recipe>` to inspect an offline illustration when desired.

Application code owns exact arithmetic, dates, identifiers, access controls, consent, and storage. Recipe guides describe the limits of each semantic decision. Larger applications combine the recipes in caller code; see [Cool projects](../README.md#cool-projects).
