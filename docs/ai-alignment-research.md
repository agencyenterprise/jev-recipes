# Jev for AI alignment research

Use Jev as a candidate annotation tool inside an alignment experiment: supply a model response or a bounded transcript excerpt, ask one defined question, and save the resulting label and uncertainty. The researcher owns the hypothesis, experimental conditions, ground truth, and interpretation.

This is a proposed research use of the recipes, not a demonstrated result about Jev's evaluator accuracy. TypeSafe recommends decomposing judgments into atomic questions and combining their results in code. That makes narrow behavioral labels a plausible starting point. It does not establish suitability for a particular study. [TypeSafe introduction](https://docs.typesafe.ai/introduction).

## Start with a research question

| Research question                                                              | Available building blocks                                                                                                | What the study must establish separately                                                                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does user pressure change a model's expressed answer toward a false claim?     | `claim-stance` labels each response's position; `verify` checks a specified claim against supplied evidence.             | Ground truth, controlled pressure conditions, and a measured difference across matched cases. Agreement alone is not sycophancy.                                      |
| Does an intervention reduce unsupported factual assertions?                    | `verify` labels researcher-supplied claim/evidence pairs; `certainty-match` compares wording with a supplied assessment. | Complete claim selection, independent evidence, and comparison across treatment and control outputs.                                                                  |
| Does a judge prefer one response under a particular rubric?                    | `draft-compare` makes a rubric-based comparison.                                                                         | Human reference judgments, randomized response order, and sensitivity to style, length, and model identity.                                                           |
| Does a trajectory satisfy the recorded reward but fail the intended objective? | `step-complete` can assess a textual completion condition; use ordinary code for exact rewards and environment state.    | Separate operational definitions for the reward and objective, observable outcomes, and a rule combining both results. A discrepancy alone does not establish intent. |
| Does a model's reported outcome contradict the recorded events?                | `verify` checks specified report claims against the relevant trace; `answer-consistency` compares explicit statements.   | Evidence completeness, attribution, and whether contradictory reports arise from error, omission, or deliberate deception.                                            |

These are black-box behavioral studies. The recipes do not inspect activations, establish internal goals, perform mechanistic interpretability, or prove that a model is aligned.

From this checkout, run `make build` followed by `node dist/cli/index.js demo claim-stance` to inspect its offline fixture. The [recipe guide](../recipes/claim-stance/README.md) contains its input, result, and import example. Use `npx jev-recipes list` to inspect the inventory in the npm version you are using; the source checkout may contain additions awaiting release.

## More observable annotations

The next source batch adds six decisions for preparing experiments and labeling saved outputs. These are candidate evaluators, not validated research instruments. Their guides include intended boundary cases; independent human labels and held-out model evaluation are still needed.

| Recipe                                                                  | What it labels                                                                                             | Keep separate                                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`response-refusal`](../recipes/response-refusal/README.md)             | Refusal, substantive attempted fulfillment, mixed behavior, or a reported capability or information limit. | Whether the request is appropriate, whether a refusal is warranted, and whether an attempt succeeds.  |
| [`uncertainty-expression`](../recipes/uncertainty-expression/README.md) | Categorical, qualified, or explicitly unresolved wording about one claim.                                  | Truth, internal confidence, and calibration. A confidently assigned `uncertain` label can be `ready`. |
| [`evaluation-mention`](../recipes/evaluation-mention/README.md)         | Explicit reference to the response's own current evaluation, general evaluation discussion, or no mention. | Hidden evaluation awareness. Self-reference includes denial and uncertainty, not just assertion.      |
| [`attribution-match`](../recipes/attribution-match/README.md)           | Whether supplied text attributes a statement to the claimed source or speaker.                             | Source authenticity, original authorship, and whether the statement is true.                          |
| [`question-leading`](../recipes/question-leading/README.md)             | Wording that favors, disfavors, or stays neutral toward one proposed answer.                               | Author intent and the measured effect of wording on responses.                                        |
| [`evidence-independence`](../recipes/evidence-independence/README.md)   | Shared or separate evidence origins described by two provenance chains for a claim.                        | Statistical independence, undisclosed common influences, and source reliability.                      |

For a wording experiment, `question-leading` can help review candidate prompts, while `claim-stance` and `uncertainty-expression` annotate the resulting responses. These labels do not create experimental controls or establish a causal effect. Keep judge inputs blind to treatment labels where possible and validate each annotation separately before combining them.

## First proposed study: agreement under user pressure

Sycophancy research studies cases where responses favor user beliefs over truthful answers. A controlled agreement study is a narrower, measurable starting point; it should not treat every agreement or correction as sycophancy. [Sharma et al., 2023](https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models).

1. Create short, self-contained evidence passages and one unambiguously true or false claim per passage. Have people independently check the intended truth labels. Include both polarities and avoid requiring outside facts.
2. Produce matched prompts with the same evidence and question: a neutral control, a user asserting the false answer, and a user asserting the true answer. Counterbalance wording and assignment. Keep target-model settings fixed and collect repeated samples where needed.
3. Save the target model's responses. Give `claim-stance` only the fixed claim, response, and minimal context needed to resolve references. Keep condition labels, model identity, and expected answers out of the annotation input. The user-pressure text should not bias the labeler when it is unnecessary to interpret the response.
4. Compare the recipe's labels with independently annotated responses on a development split. Freeze the recipe, instructions, model selection, and threshold before checking a separate held-out split. Include quotations, polite acknowledgments, negation, explicit corrections, and uncertain answers.
5. Report false-claim affirmation separately for each condition. Use the same defined denominator across conditions; report every stance category and review/error rate. Report paired differences with uncertainty intervals that account for repeated samples from the same item. Keep ambiguous labels visible rather than silently treating them as disagreement.

The first deliverable should be a small, human-reviewed annotation dataset and a reproducible protocol. Actual model calls, accuracy measurement, and a larger study are separate work. This repository's offline fixtures and unit tests verify the recipe contract, not the hypothesis or annotation accuracy.

## Validate the evaluator before using its labels as evidence

Model judges can exhibit position, verbosity, and self-preference biases. Those findings motivate checks on Jev; they do not establish that Jev has the same error rates. [Zheng et al., 2023](https://arxiv.org/abs/2306.05685).

- Measure a confusion matrix and per-label precision/recall against independently adjudicated labels. Report class balance, disagreement, review coverage, and errors even among confident outputs.
- Change irrelevant wording, quoted instructions, response order where applicable, and identifying information. Check whether the intended label remains stable. Keep development and held-out items separate while revising the rubric.
- Record package version and commit, recipe ID, complete inputs, target-model settings, requested and returned judge model, timestamp, raw result, confidence threshold, and human label provenance. Save inputs or approved references so the comparison can be reproduced.
- Preserve provider errors separately from behavioral labels. A failed call, an uncertain assessment, and evidence of a failure are different observations.

TypeSafe describes confidence as a statistic derived from its answer distribution. Do not interpret a value of `0.8` as a measured 80% probability that an annotation is correct. Assess that relationship on the study's own data before using thresholds to reduce human review. [TypeSafe confidence](https://docs.typesafe.ai/confidence).

## Fit into researchers' existing tools

Start by scoring saved outputs. The TypeScript functions and JSON CLI already provide an interface for doing that; a Python process can invoke the installed CLI. This is a bridge, not a Python package or an existing evaluation-framework integration.

The next integration candidate is an optional JSONL batch scorer, followed by an Inspect adapter if researchers request it. Keep those outside the core recipe runtime until their use is demonstrated. A batch scorer should preserve record IDs, record errors per item, support resuming, and save evaluator configuration with its results.

Petri already separates model auditing from transcript judging and is built on Inspect. That makes its saved transcripts and custom judging workflow an integration candidate to investigate. No compatibility or equivalence with Petri's existing judge has been tested here. [Petri research release](https://alignment.anthropic.com/2025/petri/).

For adoption, lead with a reproducible study and a clear annotation contract. Measure the time to score a researcher's own saved response, the effort to adapt their rubric, and whether they reuse it in another experiment. Recipe count and npm downloads alone do not answer those questions.
