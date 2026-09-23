# Growing the recipe catalog

Original review snapshot: September 22, 2026. That review found `jev-recipes@0.3.0` in the npm registry with 66 recipes. The batches below bring the source catalog to 87. The version above records the original review, not the current registry state. Recipe folders remain the source of truth; the [generated catalog](recipes/README.md) shows the current inventory.

## What the review found

| Area in 0.3.0  | Recipes | Coverage                                                             |
| -------------- | ------: | -------------------------------------------------------------------- |
| Retrieval      |      13 | Evidence selection, support, relevance, freshness, and applicability |
| Workflow       |      12 | Routing, scope, tools, outcomes, and progress                        |
| Conversation   |      11 | Intent, clarification, references, confirmation, and cancellation    |
| Answer quality |      10 | Coverage, consistency, citations, comparisons, and wording           |
| Support        |      10 | Issue matching, impact, troubleshooting, and reported attempts       |
| Memory         |       5 | Value, stability, scope, preferences, and relations                  |
| Knowledge      |       5 | Document purpose, changes, audiences, fields, and invalidation       |

The current foundation already generates registration and documentation, loads selected recipes, checks the npm archive, and exercises a synthetic 1,000-entry catalog. That capacity test does not measure model quality. The next work is distinct decisions, discoverability, and research usefulness.

## First batch: 66 to 72

| Recipe                    | New decision                                          | Closest existing recipe and difference                                                                      |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `instruction-conflict`    | Can two applicable instructions both be followed?     | `instruction-fit` checks one instruction's applicability; `answer-consistency` compares factual statements. |
| `task-dependency`         | Must one task finish before the other can start?      | `step-complete` checks evidence of completion, not dependency order.                                        |
| `task-duplicate`          | Would completing either task fully satisfy the other? | `repeated-attempt` compares approaches toward an objective, not requested outcomes.                         |
| `constraint-strength`     | Is one constraint required, preferred, or optional?   | `preference-kind` checks the kind and persistence of a statement, not its expressed force.                  |
| `requirement-testability` | Are completion criteria observable?                   | `step-complete` checks whether an already defined condition was met.                                        |
| `claim-stance`            | Does a response affirm or deny a specified claim?     | `verify` checks evidential support; stance does not establish truth.                                        |

Each addition has its own schemas, metadata, fixture, guide, uncertainty outcome, and separate tests. Existing categories and runtime helpers are sufficient. No new runtime dependencies or automatic actions are needed.

## AI alignment research

The research direction is reusable behavioral annotation for experiments, rather than calling application controls an alignment solution. Start with controlled agreement studies, factual reporting, preference comparisons, and observable reward/objective discrepancies. The [research guide](docs/ai-alignment-research.md) defines a first sycophancy-related study, evaluator checks, and integration options.

## Second batch: 72 to 78

These six recipes add observable annotation decisions using the existing schemas, choice helper, and categories. Each guide specifies intended boundaries, including quotations, missing context, and uncertainty. The boundary examples are authored policy cases, not human-adjudicated research labels. The implementations and fixtures are checked offline; independent human annotation and live evaluator validation remain required before using these labels as research evidence.

| Recipe                   | Observable question                                                                              | Nearest alternative and distinction                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `response-refusal`       | Does a response refuse a request, attempt it, do both, or report an inability?                   | `answer-relevance` assesses relevance, not refusal behavior. A textual attempt does not prove successful execution.           |
| `uncertainty-expression` | What degree of certainty does the response explicitly express about one claim?                   | `certainty-match` requires an external assessment to compare against. Avoid guessing internal confidence.                     |
| `evaluation-mention`     | Does a response refer to its own current evaluation or discuss model evaluation generally?       | `claim-stance` can label affirmation or denial of a claim; this recipe identifies the mention and its scope.                  |
| `attribution-match`      | Does supplied source text attribute a statement to the claimed speaker or source?                | `citation-match` checks evidential support, not who made or endorsed a statement. Attribution does not authenticate a source. |
| `question-leading`       | Does a question's wording favor a specified answer over alternatives?                            | `query-specificity` checks focus and clarity. Define leading wording without inferring the writer's motive.                   |
| `evidence-independence`  | Do provenance descriptions establish shared or separate origins for evidence supporting a claim? | `passage-duplicate` compares information overlap. Separate origins do not establish statistical independence.                 |

Reuse existing recipes for broad claims such as "the model lied," "the agent reward hacked," or "the answer is sycophantic." Decompose those research hypotheses into observable facts and controlled comparisons. A new label should not disguise an unsupported inference about intent.

## Gameplay pair: 78 to 80

The [gameplay guide](docs/gameplay.md) provides a concrete integration for the next two recipes:

| Recipe          | New decision                                                                      | Closest alternative and difference                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `take-turn`     | Does a player have a current turn or reaction opportunity under narrative rules?  | `response-needed` checks conversational follow-through; `step-complete` checks a past completion condition. Use exact engine flags instead when available. |
| `choose-action` | Which supplied, eligible action best serves the player's objective in this state? | `tool-fit` checks one capability; candidate-selection helpers handle mechanics but do not supply game eligibility and strategy criteria.                   |

This pair takes the source catalog from 78 to 80. Both remain in the existing workflow category with gameplay tags. They make no game actions, add no runtime dependencies, and can be used independently. Turn and legal-move checks remain in ordinary code when the game already provides them.

## Checkers decision: 80 to 81

`checkers-move` accepts a structured board, acting player, and complete legal moves for 8x8 American/English checkers. Its nearest alternative is `choose-action`. The addition supplies a concrete board contract, piece and move translation, local material counts and promotion labels, and game-specific decision criteria. Callers do not author rules or move descriptions.

This is a decision adapter, not a game engine. The existing game supplies legality, turn progression, and execution. The recipe uses one logical request and adds no runtime dependencies. Offline checks cover mapping, input validation, review handling, and packaging. A live A/B comparison with generic `choose-action` remains proposed: use identical positions and candidate moves, record latency and review rate, and assess move quality with an independent reference. No playing-strength or speed claim follows from the mocked tests.

## Everyday decisions: 81 to 84

| Recipe                | New decision                                                                            | Nearest alternative and distinction                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory-subject`      | Does a candidate memory describe the user, someone else, or a group including the user? | `memory-scope` checks where a fact applies; `attribution-match` checks who said it. Neither identifies whom the described property belongs to.                              |
| `issue-recurrence`    | Is a reported issue new, continuously present, or back after reported recovery?         | `resolution-check` checks current reported resolution; `ticket-match` compares issue identity. Neither classifies recurrence over a supplied timeline.                      |
| `question-assumption` | Does a question take one supplied claim for granted?                                    | `question-leading` checks pressure toward an answer. Pressure does not necessarily assume a claim, and an assumed claim need not favor a particular answer to the question. |

These additions use existing categories and the shared choice helper, with one logical request per call and no new dependencies. Each guide defines intended boundaries and a review outcome for insufficient context. Tests and saved demos run offline; they do not establish model accuracy. Before using the labels in a study, compare them with independent human annotations, including cases that distinguish each recipe from its nearest alternative.

## Psychology & behavior: 84 to 87

| Recipe               | New decision                                                                           | Nearest alternative and distinction                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outcome-framing`    | Does wording describe a focal outcome through gains, losses, both, or neither?         | `question-leading` checks pressure toward a supplied answer. Framing labels do not require a question or proposed answer.                                       |
| `causal-attribution` | Does an explanation point to personal factors, situational factors, both, or no cause? | `attribution-match` checks who made a statement. This recipe classifies the cause offered in it without judging whether it is true.                             |
| `motivation-source`  | Is a stated reason enjoyment of the activity, a separate outcome, both, or not stated? | `preference-kind` classifies statement types. This recipe classifies reasons, distinguishing intrinsic enjoyment from personally valued but separable outcomes. |

All three remain in the conversation category and use one logical choice request. The `psychology` metadata tag also gathers existing wording annotations into a generated Psychology & behavior subsection. No duplicate recipes, category migration, new runtime dependencies, or manual collection registry are needed.

Each guide cites its conceptual basis and documents operational boundaries. Offline tests check contracts, review behavior, and discovery; they do not validate psychological measurements. A proposed first experiment compares equivalent gain/loss descriptions while holding the decision task and model settings fixed. Verify equivalence in caller code, validate frame labels against independent annotations, and measure choice differences separately from annotation confidence.

## Adoption experiments

The working hypothesis is that useful research workflows and easy first use will attract repeat users. This has not been tested. Start with observed onboarding sessions, then use randomized A/B tests when there is enough traffic. Small usability sessions find friction; they do not establish conversion uplift.

| Experiment           | A                                | B                                                           | Main measure                                                    |
| -------------------- | -------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| First result         | Installation and key setup first | One offline command before setup                            | Completion rate and time to first understood result             |
| Positioning          | Broad recipe catalog             | A specific job, such as labeling agreement in model outputs | Qualified users reaching a result on their own input            |
| Discovery            | Browsing category lists          | Searching by the user's task with related alternatives      | Correct recipe selection and time to find it                    |
| Research entry point | Individual TypeScript calls      | Optional JSONL scoring of saved outputs                     | Time to complete a small annotation job; reuse in another study |
| Integration          | General documentation            | A small adapter for the evaluation tool users already use   | First working integration and continued use                     |

Record definitions, denominators, time windows, and failure reasons before comparing variants. For example, activation means a successful result on the user's own input, not an npm download or an offline fixture run. Measure package size and onboarding errors alongside completion. Use explicit research sessions or opt-in measurement; no package telemetry is introduced by this work.

After a usable research workflow exists, prepare a reproducible artifact and documentation for relevant open-source research tools and communities. Distribution is a proposed next step; no outreach or posting is automated here. Inspect/Petri is a candidate to investigate, not a supported integration.

## Continue toward 1,000

1. Gather concrete decisions from real applications and research protocols. Each candidate needs a target user, bounded question, minimal input, output, and nearest existing alternative.
2. Reject aliases, renamed parameter choices, deterministic checks better handled in code, and decisions already served by composition. Do not count research prompts or domain substitutions as new recipes.
3. Add small reviewed batches. Increase batch size when authoring and review are reliable and users can still find the right recipe. Counts such as 100 and 250 are checkpoints, not category quotas.
4. Run `make docs` and `make ci` for each batch. Review archive growth and discovery queries as well as tests. Keep demos and tests offline; model-accuracy experiments have their own protocols and results.
5. Prioritize the next batch using repeated use, research needs, integration friction, and missing decisions reported by users. Maintain the 1,000-recipe goal without filling the catalog with superficial variants.

Published `0.3.0` is about 545 KB unpacked. Installation still downloads one package. Direct imports reduce loaded code, not download size. Track the actual archive as the catalog grows; isolated installs remain a possible later decision if measured size becomes an adoption problem.

This is open source for a reason!! Pleaes contribute ❤️
