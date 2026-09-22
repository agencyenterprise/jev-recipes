# Recipe catalog

Search with `npx jev-recipes list "your task" --limit 5`, then inspect one with `npx jev-recipes describe <recipe>`. These commands need no API key.

<!-- BEGIN GENERATED: catalog -->

66 recipes. Each guide includes a working call, input reference, result behavior, and nearby alternatives.

## Answer quality

| Recipe                                               | Function            | Use when                                                                        |
| ---------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| [`answer-consistency`](answer-consistency/README.md) | `answerConsistency` | You need to check whether two statements agree under the same conditions.       |
| [`answer-coverage`](answer-coverage/README.md)       | `answerCoverage`    | You have a draft and need to check whether it answers each supplied question.   |
| [`answer-relevance`](answer-relevance/README.md)     | `answerRelevance`   | You need to check whether a draft stays relevant to the request.                |
| [`certainty-match`](certainty-match/README.md)       | `certaintyMatch`    | You want the wording of a draft to reflect the certainty of an assessment.      |
| [`citation-match`](citation-match/README.md)         | `citationMatch`     | You want to find which supplied passages support an entire claim.               |
| [`citation-needed`](citation-needed/README.md)       | `citationNeeded`    | You need to decide whether a statement requires a citation under your rules.    |
| [`draft-compare`](draft-compare/README.md)           | `draftCompare`      | You have two drafts and want to choose the better fit for a request and rubric. |
| [`promise-check`](promise-check/README.md)           | `promiseCheck`      | You need to catch commitments in a reply that exceed what is allowed.           |
| [`summary-coverage`](summary-coverage/README.md)     | `summaryCoverage`   | You need to check whether a summary preserves each important source point.      |
| [`tone-check`](tone-check/README.md)                 | `toneCheck`         | You want to check a draft against a supplied set of writing criteria.           |

## Retrieval and evidence

| Recipe                                                   | Function              | Use when                                                                               |
| -------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| [`answerability`](answerability/README.md)               | `answerability`       | You need to know if you have enough evidence and can answer a question.                |
| [`cache-match`](cache-match/README.md)                   | `cacheMatch`          | You want to know whether a saved answer applies to a new question.                     |
| [`context-role`](context-role/README.md)                 | `contextRole`         | You want to identify the role a passage plays in answering a question.                 |
| [`evidence-conflict`](evidence-conflict/README.md)       | `evidenceConflict`    | You have two passages and need to check for conflicting evidence about a question.     |
| [`evidence-novelty`](evidence-novelty/README.md)         | `evidenceNovelty`     | You need to decide whether a new passage adds useful information to existing evidence. |
| [`freshness-needed`](freshness-needed/README.md)         | `freshnessNeeded`     | You need to know whether a question depends on current or changing information.        |
| [`passage-duplicate`](passage-duplicate/README.md)       | `passageDuplicate`    | You want to detect duplicate or overlapping information in two passages.               |
| [`query-equivalence`](query-equivalence/README.md)       | `queryEquivalence`    | You need to check whether two questions ask for the same information.                  |
| [`query-specificity`](query-specificity/README.md)       | `querySpecificity`    | You need to know whether a question identifies a focused information need.             |
| [`rerank`](rerank/README.md)                             | `rerank`              | You have retrieved passages and want the most relevant evidence for a question.        |
| [`retrieval-needed`](retrieval-needed/README.md)         | `retrievalNeeded`     | You need to decide whether answering requires facts beyond the current context.        |
| [`source-applicability`](source-applicability/README.md) | `sourceApplicability` | You need to check whether the conditions and scope of a source fit a scenario.         |
| [`verify`](verify/README.md)                             | `verify`              | You need to know whether a claim is supported by its supplied evidence.                |

## Conversation

| Recipe                                               | Function            | Use when                                                                                          |
| ---------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| [`cancellation-check`](cancellation-check/README.md) | `cancellationCheck` | You need to detect whether a message asks to stop, pause, or continue a task.                     |
| [`clarify`](clarify/README.md)                       | `clarify`           | You need to check for missing or ambiguous requirements before proceeding.                        |
| [`confirmation-match`](confirmation-match/README.md) | `confirmationMatch` | You need to know whether a response accepts or rejects an exact proposal.                         |
| [`correction-target`](correction-target/README.md)   | `correctionTarget`  | You need to identify which supplied field or statement a message corrects.                        |
| [`followup-link`](followup-link/README.md)           | `followupLink`      | You need to connect a follow-up message to one of the earlier requests.                           |
| [`intent-change`](intent-change/README.md)           | `intentChange`      | You need to check whether a new message changes the current task or goal.                         |
| [`reference-resolve`](reference-resolve/README.md)   | `referenceResolve`  | You need to resolve a phrase such as this one to a supplied candidate.                            |
| [`resolution-check`](resolution-check/README.md)     | `resolutionCheck`   | You need to know whether the customer reports that an issue is resolved.                          |
| [`response-needed`](response-needed/README.md)       | `responseNeeded`    | You need to decide whether a message calls for a substantive reply.                               |
| [`topic-shift`](topic-shift/README.md)               | `topicShift`        | You need to detect whether a message moves away from the current topic.                           |
| [`turn-intent`](turn-intent/README.md)               | `turnIntent`        | You need to classify a message as a request, answer, correction, cancellation, or acknowledgment. |

## Tools and tasks

| Recipe                                             | Function           | Use when                                                                                     |
| -------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| [`action-scope`](action-scope/README.md)           | `actionScope`      | You need to check whether a proposed action stays within the requested work and constraints. |
| [`argument-fit`](argument-fit/README.md)           | `argumentFit`      | You need to check whether a proposed argument value matches the user request.                |
| [`failure-kind`](failure-kind/README.md)           | `failureKind`      | You need to assign an observed failure to one of your supplied categories.                   |
| [`handoff`](handoff/README.md)                     | `handoff`          | You need to decide whether your escalation rules call for a human.                           |
| [`instruction-fit`](instruction-fit/README.md)     | `instructionFit`   | You need to check whether an instruction applies to the current task and context.            |
| [`repeated-attempt`](repeated-attempt/README.md)   | `repeatedAttempt`  | You need to detect whether a proposed retry repeats an earlier approach.                     |
| [`result-outcome`](result-outcome/README.md)       | `resultOutcome`    | You need to classify what a tool result reports happened during a task.                      |
| [`result-usefulness`](result-usefulness/README.md) | `resultUsefulness` | You need to assess whether a tool result provides useful information for a task.             |
| [`route`](route/README.md)                         | `route`            | You need to send a request to the right handler, team, or department.                        |
| [`step-complete`](step-complete/README.md)         | `stepComplete`     | You need to check whether supplied evidence establishes a completion condition.              |
| [`step-progress`](step-progress/README.md)         | `stepProgress`     | You need to compare a new observation with the previous state of a task.                     |
| [`tool-fit`](tool-fit/README.md)                   | `toolFit`          | You need to check whether a tool has the stated capability to perform a task.                |

## Customer support

| Recipe                                                   | Function             | Use when                                                                                 |
| -------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| [`attempted-step`](attempted-step/README.md)             | `attemptedStep`      | You need to know whether a customer already tried a troubleshooting step.                |
| [`feedback-kind`](feedback-kind/README.md)               | `feedbackKind`       | You need to classify the kind of feedback expressed in a message.                        |
| [`frustration-signal`](frustration-signal/README.md)     | `frustrationSignal`  | You need to detect frustration or dissatisfaction expressed in a message.                |
| [`incident-match`](incident-match/README.md)             | `incidentMatch`      | You need to connect a support ticket to a supplied known incident.                       |
| [`issue-impact`](issue-impact/README.md)                 | `issueImpact`        | You need to assess the practical impact explicitly described in a support message.       |
| [`reply-template-match`](reply-template-match/README.md) | `replyTemplateMatch` | You want to select a supplied approved reply template for a request.                     |
| [`ticket-match`](ticket-match/README.md)                 | `ticketMatch`        | You want to check whether two tickets describe the same underlying issue.                |
| [`troubleshooting-fit`](troubleshooting-fit/README.md)   | `troubleshootingFit` | You need to choose whether a procedure fits the reported symptoms and circumstances.     |
| [`urgency-signal`](urgency-signal/README.md)             | `urgencySignal`      | You need to detect whether a message explicitly asks for urgent attention.               |
| [`workaround-fit`](workaround-fit/README.md)             | `workaroundFit`      | You need to check whether a workaround addresses an issue within the stated constraints. |

## Memory

| Recipe                                         | Function         | Use when                                                                                |
| ---------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| [`fact-stability`](fact-stability/README.md)   | `factStability`  | You need to assess whether a fact is enduring or likely to change over time.            |
| [`memory-relation`](memory-relation/README.md) | `memoryRelation` | You need to compare a new fact with an existing memory for agreement or change.         |
| [`memory-scope`](memory-scope/README.md)       | `memoryScope`    | You need to identify the narrowest supported scope of a fact or preference.             |
| [`memory-value`](memory-value/README.md)       | `memoryValue`    | You need to assess whether a candidate fact is useful to remember for a stated purpose. |
| [`preference-kind`](preference-kind/README.md) | `preferenceKind` | You need to distinguish an ongoing preference from a fact or temporary request.         |

## Knowledge maintenance

| Recipe                                                 | Function             | Use when                                                                                |
| ------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------- |
| [`answer-invalidation`](answer-invalidation/README.md) | `answerInvalidation` | You need to check whether updated evidence still supports a previously supported claim. |
| [`audience-fit`](audience-fit/README.md)               | `audienceFit`        | You need to check whether a document suits the stated audience knowledge and needs.     |
| [`change-meaning`](change-meaning/README.md)           | `changeMeaning`      | You need to know whether a revision changes material meaning or obligations.            |
| [`document-role`](document-role/README.md)             | `documentRole`       | You need to identify the primary purpose of a document.                                 |
| [`field-select`](field-select/README.md)               | `fieldSelect`        | You need to select which supplied candidate expresses a field value in a document.      |

<!-- END GENERATED: catalog -->

## Shared options and behavior

- Pass `{ client, model, signal }` as an optional second argument to any recipe. The default client reads `TYPESAFE_API_KEY` from the process environment.
- Recipes that accept `minConfidence` default it to `0.8`. Rerank uses `minRelevance`, defaulting to `0.5`. Each guide explains which outcomes require review and how individual checks affect the overall decision.
- `ready` describes confidence in the assessment. Inspect the verdict too: a ready result can describe a conflict, missing information, or an unsuitable candidate.
- Candidate selectors return `selection` only for a ready match. `suggestedSelection` preserves a low-confidence suggestion. Candidate probabilities use your supplied IDs; no candidate match and ambiguity are separate outcomes.
- Item checks preserve each item's ID, verdict, confidence, and status. The coverage and tone recipes also provide `allAnswered`, `allPreserved`, or `allPassed` as appropriate.
- Model and token usage accompany every result. Inputs and model responses are validated with Zod 4. Invalid input, malformed answers, and provider failures throw.
- Shared `{ id, text }` lists accept 1 to 50 items with unique non-empty IDs. Route accepts up to 254 routes; rerank and verify accept up to 100 items. Each guide documents its input limits. Provider context limits may require smaller inputs; content is not silently truncated.

## Reuse and side effects

Recipes share small helpers for choices, candidate selection, and item checks. Rerank uses independent yes/no relevance scores. Each recipe owns its question and decision rules. `citation-match` composes the public `verify` function; its guide and catalog `uses` field name that dependency.

Each current recipe makes one logical Jev request per live invocation. Batch checks place their questions in that request. SDK retries can add transport attempts. The recipes return decisions without executing application actions. Applications compose recipes and decide which calls are needed.

## Examples and limits

Every `demo.json` includes input and a hand-authored response. These examples illustrate behavior; they are not model accuracy results. Use `example <recipe>` to obtain editable input and `demo <recipe>` to inspect an offline illustration when desired.

Application code owns exact arithmetic, dates, identifiers, access controls, consent, and storage. Recipe guides describe the limits of each semantic decision. Applications combine recipes in caller code.
