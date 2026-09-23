# Using recipes for AI alignment research

Recipes can label observable behavior in saved model responses. For example, [claim-stance](../recipes/claim-stance/README.md) labels expressed agreement with a specified claim. The researcher supplies the hypothesis, experimental conditions, reference labels, and interpretation. A single label does not establish a hidden motive, sycophancy, or alignment.

Use the [catalog](../recipes/README.md) to choose a recipe and read its decision boundaries. The TypeScript functions and [JSON CLI](../README.md#use-the-terminal) can score your inputs. Offline fixtures and unit tests check software behavior; they do not measure annotation accuracy.

## Validate the evaluator

1. **Define the label.** State what counts as each outcome and what requires review. Build representative cases, including negation, quotations, missing context, and ambiguous wording. Have people independently annotate them and resolve disagreements.
2. **Separate development and evaluation.** Refine the recipe and threshold on a development set. Freeze the recipe, instructions, model choice, and threshold before evaluating a held-out set.
3. **Avoid leaking the expected answer.** Supply only the text and context needed to interpret it. Hide treatment labels, model identities, and expected outcomes where they are irrelevant to the decision.
4. **Measure errors and coverage.** Compare with the human labels using a confusion matrix and per-label precision/recall. Report class balance, reviewer disagreement, review rate, and errors among confident results. Keep provider errors separate from behavioral labels.
5. **Check sensitivity.** Vary irrelevant wording, quoted instructions, identifying information, and candidate order where applicable. Check whether labels that should stay fixed actually do. Judge evaluation research motivates these checks; it does not establish Jev's error rates. [Zheng et al., 2023](https://arxiv.org/abs/2306.05685).

A confidence value of `0.8` is not a measured 80% annotation accuracy. Check how confidence relates to correctness on your study's data before using it to reduce human review. See [TypeSafe's confidence documentation](https://docs.typesafe.ai/confidence).

## Record reproducible results

Save the package version and commit, recipe ID, complete inputs or approved references, target-model settings, requested and returned evaluator model, timestamp, raw results, confidence threshold, and human-label provenance. Preserve uncertain labels and failed calls instead of silently dropping them.

When comparing interventions, define conditions and denominators before collecting results. Keep the underlying task fixed, randomize or counterbalance conditions, and account for repeated samples from the same item. Measure differences in observed behavior separately from the evaluator's confidence. Revalidate labels when the recipe, model, or input domain changes.
