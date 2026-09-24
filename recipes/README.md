# Recipe catalog

Search with `npx jev-recipes list "your task" --limit 5`, then inspect one with `npx jev-recipes describe <recipe>`. These commands need no API key.

<!-- BEGIN GENERATED: catalog -->

117 recipes. Each guide includes a working call, input reference, result behavior, and nearby alternatives.

## Answer quality

| Recipe                                                       | Function                | Use when                                                                                                                 |
| ------------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [`answer-consistency`](answer-consistency/README.md)         | `answerConsistency`     | You need to check whether two statements agree under the same conditions.                                                |
| [`answer-coverage`](answer-coverage/README.md)               | `answerCoverage`        | You have a draft and need to check whether it answers each supplied question.                                            |
| [`answer-relevance`](answer-relevance/README.md)             | `answerRelevance`       | You need to check whether a draft stays relevant to the request.                                                         |
| [`certainty-match`](certainty-match/README.md)               | `certaintyMatch`        | You want the wording of a draft to reflect the certainty of an assessment.                                               |
| [`citation-match`](citation-match/README.md)                 | `citationMatch`         | You want to find which supplied passages support an entire claim.                                                        |
| [`citation-needed`](citation-needed/README.md)               | `citationNeeded`        | You need to decide whether a statement requires a citation under your rules.                                             |
| [`claim-stance`](claim-stance/README.md)                     | `claimStance`           | You need to label whether a response agrees or disagrees with a claim, including in AI alignment research.               |
| [`draft-compare`](draft-compare/README.md)                   | `draftCompare`          | You have two drafts and want to choose the better fit for a request and rubric.                                          |
| [`evaluation-mention`](evaluation-mention/README.md)         | `evaluationMention`     | You need to find explicit mentions of being tested, graded, or evaluated in saved model responses.                       |
| [`format-fit`](format-fit/README.md)                         | `formatFit`             | You need a yes/no check that a generated response honored the format the prompt or user explicitly asked for.            |
| [`grounding-level`](grounding-level/README.md)               | `groundingLevel`        | You need one graded measure of how well a generated answer sticks to its retrieved sources before sending or ranking it. |
| [`length-fit`](length-fit/README.md)                         | `lengthFit`             | You need to catch answers that are padded or truncated relative to the question before sending or scoring them.          |
| [`promise-check`](promise-check/README.md)                   | `promiseCheck`          | You need to catch commitments in a reply that exceed what is allowed.                                                    |
| [`response-refusal`](response-refusal/README.md)             | `responseRefusal`       | You need to label whether a response refuses a request, attempts it, or reports missing access or information.           |
| [`summary-coverage`](summary-coverage/README.md)             | `summaryCoverage`       | You need to check whether a summary preserves each important source point.                                               |
| [`tone-check`](tone-check/README.md)                         | `toneCheck`             | You want to check a draft against a supplied set of writing criteria.                                                    |
| [`uncertainty-expression`](uncertainty-expression/README.md) | `uncertaintyExpression` | You need to label expressed certainty or hedging about one claim without an external truth assessment.                   |

## Retrieval and evidence

| Recipe                                                     | Function               | Use when                                                                                                                |
| ---------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [`answerability`](answerability/README.md)                 | `answerability`        | You need to know if you have enough evidence and can answer a question.                                                 |
| [`cache-match`](cache-match/README.md)                     | `cacheMatch`           | You want to know whether a saved answer applies to a new question.                                                      |
| [`context-role`](context-role/README.md)                   | `contextRole`          | You want to identify the role a passage plays in answering a question.                                                  |
| [`evidence-conflict`](evidence-conflict/README.md)         | `evidenceConflict`     | You have two passages and need to check for conflicting evidence about a question.                                      |
| [`evidence-independence`](evidence-independence/README.md) | `evidenceIndependence` | You need to check whether two reports rely on the same underlying source before treating them as corroboration.         |
| [`evidence-novelty`](evidence-novelty/README.md)           | `evidenceNovelty`      | You need to decide whether a new passage adds useful information to existing evidence.                                  |
| [`evidence-strength`](evidence-strength/README.md)         | `evidenceStrength`     | You need a graded strength for weighting or ranking evidence, not just a supported or unsupported label.                |
| [`freshness-needed`](freshness-needed/README.md)           | `freshnessNeeded`      | You need to know whether a question depends on current or changing information.                                         |
| [`passage-duplicate`](passage-duplicate/README.md)         | `passageDuplicate`     | You want to detect duplicate or overlapping information in two passages.                                                |
| [`passage-standalone`](passage-standalone/README.md)       | `passageStandalone`    | You need to check chunks before embedding them, or decide whether a retrieved passage needs its neighbors to be useful. |
| [`query-equivalence`](query-equivalence/README.md)         | `queryEquivalence`     | You need to check whether two questions ask for the same information.                                                   |
| [`query-specificity`](query-specificity/README.md)         | `querySpecificity`     | You need to know whether a question identifies a focused information need.                                              |
| [`rerank`](rerank/README.md)                               | `rerank`               | You have retrieved passages and want the most relevant evidence for a question.                                         |
| [`retrieval-needed`](retrieval-needed/README.md)           | `retrievalNeeded`      | You need to decide whether answering requires facts beyond the current context.                                         |
| [`source-applicability`](source-applicability/README.md)   | `sourceApplicability`  | You need to check whether the conditions and scope of a source fit a scenario.                                          |
| [`verify`](verify/README.md)                               | `verify`               | You need to know whether a claim is supported by its supplied evidence.                                                 |

## Conversation

| Recipe                                                   | Function              | Use when                                                                                                              |
| -------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`age-appropriateness`](age-appropriateness/README.md)   | `ageAppropriateness`  | You need to route, filter, or label user-generated or model-generated content by audience age before publishing it.   |
| [`cancellation-check`](cancellation-check/README.md)     | `cancellationCheck`   | You need to detect whether a message asks to stop, pause, or continue a task.                                         |
| [`causal-attribution`](causal-attribution/README.md)     | `causalAttribution`   | You need to label whether an explanation points to the person, the situation, or both.                                |
| [`clarify`](clarify/README.md)                           | `clarify`             | You need to check for missing or ambiguous requirements before proceeding.                                            |
| [`commitment-strength`](commitment-strength/README.md)   | `commitmentStrength`  | You need to grade how strongly a message commits someone to act before tracking it as a promise or follow-up.         |
| [`confirmation-match`](confirmation-match/README.md)     | `confirmationMatch`   | You need to know whether a response accepts or rejects an exact proposal.                                             |
| [`constraint-strength`](constraint-strength/README.md)   | `constraintStrength`  | You need to distinguish a hard requirement from a preference or an optional suggestion.                               |
| [`correction-target`](correction-target/README.md)       | `correctionTarget`    | You need to identify which supplied field or statement a message corrects.                                            |
| [`emotion-kind`](emotion-kind/README.md)                 | `emotionKind`         | You need a coarse emotion label for a message to route it, annotate a dataset, or adapt a reply.                      |
| [`followup-link`](followup-link/README.md)               | `followupLink`        | You need to connect a follow-up message to one of the earlier requests.                                               |
| [`intent-change`](intent-change/README.md)               | `intentChange`        | You need to check whether a new message changes the current task or goal.                                             |
| [`motivation-source`](motivation-source/README.md)       | `motivationSource`    | You need to classify a stated reason for an activity as enjoyment of doing it or pursuit of a separate outcome.       |
| [`outcome-framing`](outcome-framing/README.md)           | `outcomeFraming`      | You need to label gain and loss wording in a decision prompt or research stimulus.                                    |
| [`persuasion-technique`](persuasion-technique/README.md) | `persuasionTechnique` | You need to annotate or flag how a message tries to persuade, for moderation, research, or review of outgoing drafts. |
| [`policy-severity`](policy-severity/README.md)           | `policySeverity`      | You need a graded severity against your own written policy to choose between allow, flag, hide, or escalate.          |
| [`politeness-level`](politeness-level/README.md)         | `politenessLevel`     | You need a graded politeness signal to adapt reply tone, flag hostile messages, or audit outgoing drafts.             |
| [`question-assumption`](question-assumption/README.md)   | `questionAssumption`  | You need to identify a specific assumption in a question before using it in a conversation, survey, or evaluation.    |
| [`question-leading`](question-leading/README.md)         | `questionLeading`     | You need to check leading questions or answer pressure in a survey, interview, or evaluation prompt.                  |
| [`reference-resolve`](reference-resolve/README.md)       | `referenceResolve`    | You need to resolve a phrase such as this one to a supplied candidate.                                                |
| [`resolution-check`](resolution-check/README.md)         | `resolutionCheck`     | You need to know whether the customer reports that an issue is resolved.                                              |
| [`response-needed`](response-needed/README.md)           | `responseNeeded`      | You need to decide whether a message calls for a substantive reply.                                                   |
| [`spam-signal`](spam-signal/README.md)                   | `spamSignal`          | You need a yes/no gate before publishing, forwarding, or replying to community posts, comments, or inbound messages.  |
| [`topic-shift`](topic-shift/README.md)                   | `topicShift`          | You need to detect whether a message moves away from the current topic.                                               |
| [`turn-intent`](turn-intent/README.md)                   | `turnIntent`          | You need to classify a message as a request, answer, correction, cancellation, or acknowledgment.                     |

## Tools and tasks

| Recipe                                                         | Function                | Use when                                                                                                                                                  |
| -------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`action-reversibility`](action-reversibility/README.md)       | `actionReversibility`   | You need to decide whether an agent may proceed on its own or must pause for approval before a step that cannot be taken back.                            |
| [`action-scope`](action-scope/README.md)                       | `actionScope`           | You need to check whether a proposed action stays within the requested work and constraints.                                                              |
| [`argument-fit`](argument-fit/README.md)                       | `argumentFit`           | You need to check whether a proposed argument value matches the user request.                                                                             |
| [`breaking-change-signal`](breaking-change-signal/README.md)   | `breakingChangeSignal`  | You need to flag changes that require a major version bump, a migration note, or downstream coordination before they merge.                               |
| [`bug-report-completeness`](bug-report-completeness/README.md) | `bugReportCompleteness` | You need to decide whether an incoming bug report can go straight to triage or needs a follow-up request for details first.                               |
| [`change-risk`](change-risk/README.md)                         | `changeRisk`            | You need to size the risk of a described code change before choosing reviewers, test depth, rollout strategy, or approval requirements.                   |
| [`checkers-move`](checkers-move/README.md)                     | `checkersMove`          | Your checkers game already provides its board, acting player, and legal moves, and you want a move ID without writing decision prompts.                   |
| [`choose-action`](choose-action/README.md)                     | `chooseAction`          | You need to choose the next game action from a list using the current environment, game rules, and previous player actions.                               |
| [`commit-message-fit`](commit-message-fit/README.md)           | `commitMessageFit`      | You need to flag commit or pull request titles that understate, overstate, or misdescribe the change they accompany before merge or changelog generation. |
| [`failure-kind`](failure-kind/README.md)                       | `failureKind`           | You need to assign an observed failure to one of your supplied categories.                                                                                |
| [`game-action`](game-action/README.md)                         | `gameAction`            | Your game already supplies JSON state and actions, and you want Jev to choose an action without formatting descriptions or assigning IDs.                 |
| [`goal-drift`](goal-drift/README.md)                           | `goalDrift`             | You need a yes/no check on each step of a long-running agent so it stops before spending effort on work nobody asked for.                                 |
| [`handoff`](handoff/README.md)                                 | `handoff`               | You need to decide whether your escalation rules call for a human.                                                                                        |
| [`injection-signal`](injection-signal/README.md)               | `injectionSignal`       | You need to screen retrieved documents, tool results, or user uploads before an agent reads them as context.                                              |
| [`instruction-conflict`](instruction-conflict/README.md)       | `instructionConflict`   | You need to detect conflicting instructions before carrying out a task.                                                                                   |
| [`instruction-fit`](instruction-fit/README.md)                 | `instructionFit`        | You need to check whether an instruction applies to the current task and context.                                                                         |
| [`pii-presence`](pii-presence/README.md)                       | `piiPresence`           | You need a yes/no gate before storing, logging, sharing, or sending text that might contain personal data.                                                |
| [`plan-completeness`](plan-completeness/README.md)             | `planCompleteness`      | You need to check an agent-written plan against the task before execution starts, so missing requirements are caught while they are cheap to add.         |
| [`repeated-attempt`](repeated-attempt/README.md)               | `repeatedAttempt`       | You need to detect whether a proposed retry repeats an earlier approach.                                                                                  |
| [`result-outcome`](result-outcome/README.md)                   | `resultOutcome`         | You need to classify what a tool result reports happened during a task.                                                                                   |
| [`result-plausibility`](result-plausibility/README.md)         | `resultPlausibility`    | You need a yes/no check on a tool or subagent output before an agent trusts it, stores it, or builds the next step on it.                                 |
| [`result-usefulness`](result-usefulness/README.md)             | `resultUsefulness`      | You need to assess whether a tool result provides useful information for a task.                                                                          |
| [`retry-worthwhile`](retry-worthwhile/README.md)               | `retryWorthwhile`       | You need a yes/no decision after a tool call or request fails and the error text, not a status code, is the only signal you have.                         |
| [`review-comment-kind`](review-comment-kind/README.md)         | `reviewCommentKind`     | You need to sort code review comments so blocking defects surface first and optional polish can be batched or deferred.                                   |
| [`route`](route/README.md)                                     | `route`                 | You need to send a request to the right handler, team, or department.                                                                                     |
| [`step-complete`](step-complete/README.md)                     | `stepComplete`          | You need to check whether supplied evidence establishes a completion condition.                                                                           |
| [`step-progress`](step-progress/README.md)                     | `stepProgress`          | You need to compare a new observation with the previous state of a task.                                                                                  |
| [`take-turn`](take-turn/README.md)                             | `takeTurn`              | You need to decide whether it is a player's turn to act or react using narrative game rules, state, and previous actions.                                 |
| [`task-complexity`](task-complexity/README.md)                 | `taskComplexity`        | You need to size a task before choosing a model, a plan depth, a time budget, or whether to ask for help.                                                 |
| [`task-dependency`](task-dependency/README.md)                 | `taskDependency`        | You need to decide whether two tasks can run in parallel or require a particular order.                                                                   |
| [`task-duplicate`](task-duplicate/README.md)                   | `taskDuplicate`         | You need to detect duplicate tasks before adding more work to a queue or plan.                                                                            |
| [`tool-fit`](tool-fit/README.md)                               | `toolFit`               | You need to check whether a tool has the stated capability to perform a task.                                                                             |

## Customer support

| Recipe                                                   | Function             | Use when                                                                                                                              |
| -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`attempted-step`](attempted-step/README.md)             | `attemptedStep`      | You need to know whether a customer already tried a troubleshooting step.                                                             |
| [`feedback-kind`](feedback-kind/README.md)               | `feedbackKind`       | You need to classify the kind of feedback expressed in a message.                                                                     |
| [`frustration-signal`](frustration-signal/README.md)     | `frustrationSignal`  | You need to detect frustration or dissatisfaction expressed in a message.                                                             |
| [`incident-match`](incident-match/README.md)             | `incidentMatch`      | You need to connect a support ticket to a supplied known incident.                                                                    |
| [`issue-impact`](issue-impact/README.md)                 | `issueImpact`        | You need to assess the practical impact explicitly described in a support message.                                                    |
| [`issue-recurrence`](issue-recurrence/README.md)         | `issueRecurrence`    | You need to distinguish a new problem, one that never stopped, and an issue that came back after recovery.                            |
| [`reply-template-match`](reply-template-match/README.md) | `replyTemplateMatch` | You want to select a supplied approved reply template for a request.                                                                  |
| [`satisfaction-signal`](satisfaction-signal/README.md)   | `satisfactionSignal` | You need a graded satisfaction signal from closing messages when no survey response is available.                                     |
| [`sentiment-shift`](sentiment-shift/README.md)           | `sentimentShift`     | You need to know whether a customer's expressed sentiment moved during a conversation, for example after an agent reply or a handoff. |
| [`ticket-match`](ticket-match/README.md)                 | `ticketMatch`        | You want to check whether two tickets describe the same underlying issue.                                                             |
| [`troubleshooting-fit`](troubleshooting-fit/README.md)   | `troubleshootingFit` | You need to choose whether a procedure fits the reported symptoms and circumstances.                                                  |
| [`urgency-signal`](urgency-signal/README.md)             | `urgencySignal`      | You need to detect whether a message explicitly asks for urgent attention.                                                            |
| [`workaround-fit`](workaround-fit/README.md)             | `workaroundFit`      | You need to check whether a workaround addresses an issue within the stated constraints.                                              |

## Memory

| Recipe                                         | Function         | Use when                                                                                |
| ---------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| [`fact-stability`](fact-stability/README.md)   | `factStability`  | You need to assess whether a fact is enduring or likely to change over time.            |
| [`memory-relation`](memory-relation/README.md) | `memoryRelation` | You need to compare a new fact with an existing memory for agreement or change.         |
| [`memory-scope`](memory-scope/README.md)       | `memoryScope`    | You need to identify the narrowest supported scope of a fact or preference.             |
| [`memory-subject`](memory-subject/README.md)   | `memorySubject`  | You need to avoid treating a fact about someone else as a fact about the user.          |
| [`memory-value`](memory-value/README.md)       | `memoryValue`    | You need to assess whether a candidate fact is useful to remember for a stated purpose. |
| [`preference-kind`](preference-kind/README.md) | `preferenceKind` | You need to distinguish an ongoing preference from a fact or temporary request.         |

## Knowledge maintenance

| Recipe                                                         | Function                 | Use when                                                                                                                 |
| -------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [`answer-invalidation`](answer-invalidation/README.md)         | `answerInvalidation`     | You need to check whether updated evidence still supports a previously supported claim.                                  |
| [`attribution-match`](attribution-match/README.md)             | `attributionMatch`       | You need to check who said a statement in a transcript or source excerpt, separately from whether it is true.            |
| [`audience-fit`](audience-fit/README.md)                       | `audienceFit`            | You need to check whether a document suits the stated audience knowledge and needs.                                      |
| [`change-meaning`](change-meaning/README.md)                   | `changeMeaning`          | You need to know whether a revision changes material meaning or obligations.                                             |
| [`document-role`](document-role/README.md)                     | `documentRole`           | You need to identify the primary purpose of a document.                                                                  |
| [`entity-match`](entity-match/README.md)                       | `entityMatch`            | You need to decide whether two customer, vendor, product, or place records should be merged or linked.                   |
| [`extraction-fidelity`](extraction-fidelity/README.md)         | `extractionFidelity`     | You need to grade a structured extraction against its source document before trusting, storing, or acting on the values. |
| [`field-select`](field-select/README.md)                       | `fieldSelect`            | You need to select which supplied candidate expresses a field value in a document.                                       |
| [`requirement-testability`](requirement-testability/README.md) | `requirementTestability` | You need to check whether a requirement has clear, observable acceptance criteria before building it.                    |

## Psychology & behavior

Recipes for annotating expressed wording, explanations, and reasons, gathered from the categories above.

Search with `npx jev-recipes list psychology`. For research, validate labels against independent human annotations; see the [research guide](../docs/ai-alignment-research.md).

| Recipe                                                       | Function                | Use when                                                                                                              |
| ------------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`causal-attribution`](causal-attribution/README.md)         | `causalAttribution`     | You need to label whether an explanation points to the person, the situation, or both.                                |
| [`claim-stance`](claim-stance/README.md)                     | `claimStance`           | You need to label whether a response agrees or disagrees with a claim, including in AI alignment research.            |
| [`commitment-strength`](commitment-strength/README.md)       | `commitmentStrength`    | You need to grade how strongly a message commits someone to act before tracking it as a promise or follow-up.         |
| [`emotion-kind`](emotion-kind/README.md)                     | `emotionKind`           | You need a coarse emotion label for a message to route it, annotate a dataset, or adapt a reply.                      |
| [`frustration-signal`](frustration-signal/README.md)         | `frustrationSignal`     | You need to detect frustration or dissatisfaction expressed in a message.                                             |
| [`motivation-source`](motivation-source/README.md)           | `motivationSource`      | You need to classify a stated reason for an activity as enjoyment of doing it or pursuit of a separate outcome.       |
| [`outcome-framing`](outcome-framing/README.md)               | `outcomeFraming`        | You need to label gain and loss wording in a decision prompt or research stimulus.                                    |
| [`persuasion-technique`](persuasion-technique/README.md)     | `persuasionTechnique`   | You need to annotate or flag how a message tries to persuade, for moderation, research, or review of outgoing drafts. |
| [`politeness-level`](politeness-level/README.md)             | `politenessLevel`       | You need a graded politeness signal to adapt reply tone, flag hostile messages, or audit outgoing drafts.             |
| [`question-assumption`](question-assumption/README.md)       | `questionAssumption`    | You need to identify a specific assumption in a question before using it in a conversation, survey, or evaluation.    |
| [`question-leading`](question-leading/README.md)             | `questionLeading`       | You need to check leading questions or answer pressure in a survey, interview, or evaluation prompt.                  |
| [`uncertainty-expression`](uncertainty-expression/README.md) | `uncertaintyExpression` | You need to label expressed certainty or hedging about one claim without an external truth assessment.                |

<!-- END GENERATED: catalog -->

## Shared options and behavior

- Pass `{ client, model, signal }` as an optional second argument to any recipe. The default client reads `TYPESAFE_API_KEY` from the process environment.
- Recipes that accept `minConfidence` default it to `0.8`. Rerank uses `minRelevance`, defaulting to `0.5`. Each guide explains which outcomes require review and how individual checks affect the overall decision.
- `ready` describes confidence in the assessment. Inspect the verdict too: a ready result can describe a conflict, missing information, or an unsuitable candidate.
- Recipes using the candidate-selection helper return `selection` only for a ready match. `suggestedSelection` preserves a low-confidence suggestion. Candidate probabilities use your supplied IDs; no candidate match and ambiguity are separate outcomes. [game-action](game-action/README.md) returns the original selected JSON action and Jev's confidence directly, with probabilities keyed by internal labels.
- Item checks preserve each item's ID, verdict, confidence, and status. The coverage and tone recipes also provide `allAnswered`, `allPreserved`, or `allPassed` as appropriate.
- Score recipes return `score`, Jev's expected value over an ordered rubric, with `level`, the most likely rubric index, and a named label such as `strength` or `severity`. `probabilities` is keyed by level index.
- Gate recipes ask one yes/no question and return `probability` for the yes outcome, a two-way `verdict`, and `confidence` equal to the probability of the chosen side.
- Model and token usage accompany model-backed results. An empty `game-action` action list returns `null` without a model call. Inputs and model responses are validated with Zod 4. Invalid input, malformed answers, and provider failures throw.
- Shared `{ id, text }` lists accept 1 to 50 items with unique non-empty IDs. Route accepts up to 254 routes; rerank and verify accept up to 100 items. Each guide documents its input limits. Provider context limits may require smaller inputs; content is not silently truncated.

## Reuse and side effects

Recipes share small helpers for choices, candidate selection, item checks, rubric scores, and yes/no gates. Rerank uses independent yes/no relevance scores. Each recipe owns its question and decision rules. `citation-match` composes the public `verify` function; its guide and catalog `uses` field name that dependency.

A model-backed invocation makes one logical Jev request. Batch checks place their questions in that request. SDK retries can add transport attempts. The recipes return decisions without executing application actions. Applications compose recipes and decide which calls are needed.

## Examples and limits

Every `demo.json` includes input and a hand-authored response. These examples illustrate behavior; they are not model accuracy results. Use `example <recipe>` to obtain editable input and `demo <recipe>` to inspect an offline illustration when desired.

Application code owns exact arithmetic, dates, identifiers, access controls, consent, and storage. Recipe guides describe the limits of each semantic decision. Applications combine recipes in caller code.
