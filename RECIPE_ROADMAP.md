# Growing the recipe catalog

Review snapshot: September 22, 2026. The npm registry reports `jev-recipes@0.3.0`; its catalog contains 66 recipes. This working batch adds six, bringing the source catalog to 72. Release state and counts here describe this review, not a second registry. Recipe folders remain the source of truth.

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

## This batch

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

Potential next decisions need review and human-labeled boundary cases before implementation:

| Candidate                | Observable question                                                                             | Difference to check before accepting                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `response-refusal`       | Does a response explicitly decline a specified request, comply, or do both?                     | `answer-relevance` assesses relevance, not refusal behavior. Distinguish inability and lack of information.                    |
| `uncertainty-expression` | What degree of certainty does the response explicitly express about one claim?                  | `certainty-match` requires an external assessment to compare against. Avoid guessing internal confidence.                      |
| `evaluation-mention`     | Does a response explicitly refer to being tested or evaluated?                                  | Label textual mention, not hidden evaluation awareness. Compare quotations and hypothetical discussion.                        |
| `attribution-match`      | Does a response attribute a supplied statement to the speaker or source that actually made it?  | `citation-match` checks support, not ownership of a statement. Keep attribution separate from truth.                           |
| `question-leading`       | Does a question's wording favor a specified answer over alternatives?                           | `query-specificity` checks focus and clarity. Define leading wording without inferring the writer's motive.                    |
| `evidence-independence`  | Do the supplied provenance descriptions show two reports relying on the same underlying source? | `passage-duplicate` compares information overlap. Independence needs provenance and cannot be inferred from different wording. |

Reuse existing recipes for broad claims such as "the model lied," "the agent reward hacked," or "the answer is sycophantic." Decompose those research hypotheses into observable facts and controlled comparisons. A new label should not disguise an unsupported inference about intent.

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
