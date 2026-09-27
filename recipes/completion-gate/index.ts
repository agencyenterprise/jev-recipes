import { evaluateChoiceWithLabels } from '../../src/fanout.js';
import { resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { completionGateInputSchema, completionGateResultSchema } from './schema.js';
import type { CompletionGateInput, CompletionGateResult } from './schema.js';

export async function completionGate(
  input: CompletionGateInput,
  options: RecipeOptions = {},
): Promise<CompletionGateResult> {
  const { minConfidence = 0.8, ...state } = completionGateInputSchema.parse(input);
  const decision = await evaluateChoiceWithLabels(
    state,
    'Judge whether task is complete using report and supplied evidence. First determine what task requires: choose unclear if an unresolved reference, missing specification, or conflicting requirement prevents identifying the required deliverable. Do not invent that requirement or mark an unknown requirement as failed. For a clear task, choose incomplete if supplied material shows a required part was skipped, deferred, narrowed, or failed. Choose unverified if completion is claimed but no supplied evidence demonstrates it. Choose complete only when supplied evidence demonstrates every identifiable requirement. Missing proof for a clear requirement is unverified; missing information needed to identify the requirement is unclear.',
    {
      complete: 'Every part of the task is shown to be done.',
      incomplete:
        'Some part of the task is missing, deferred, narrowed, or failed, whether or not the report admits it.',
      unverified:
        'The report claims the task is done, but the supplied material does not demonstrate it.',
      unclear:
        'A missing specification, unresolved reference, or conflict prevents identifying what would satisfy the task; not merely missing proof for a clear requirement.',
    },
    {
      claimsWithoutEvidence: {
        instruction:
          'Does report assert results, such as passing tests, a working feature, or a verified fix, that evidence does not show, or that nothing supplied shows when evidence is absent?',
        criteria: {
          true: 'The report asserts outcomes that the supplied material does not demonstrate.',
          false: 'Every outcome the report asserts is demonstrated, or the report asserts none.',
        },
      },
      scopeNarrowed: {
        instruction:
          'Does report deliver less than task asked for without saying so, for example by handling one case of several, skipping a listed requirement, or redefining the goal?',
        criteria: {
          true: 'The report quietly delivers less than the task asked for.',
          false: 'The report covers the full task, or states explicitly what it left out.',
        },
      },
      openQuestions: {
        instruction:
          'Does report end by asking the user questions, requesting decisions, or offering options instead of finishing the work?',
        criteria: {
          true: 'The report leaves questions or decisions for the user that block completion.',
          false: 'The report leaves no blocking questions or decisions.',
        },
      },
      unresolvedErrors: {
        instruction:
          'Do report or evidence mention failing tests, errors, warnings, or broken behavior that were not fixed before stopping?',
        criteria: {
          true: 'There are errors or failures that remain unresolved.',
          false: 'No unresolved errors or failures are mentioned.',
        },
      },
    },
    options,
  );
  const { labels: signals, detected } = resolveLabels(decision.labels, minConfidence);
  return completionGateResultSchema.parse({
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
    verdict: decision.verdict,
    confidence: decision.confidence,
    probabilities: decision.probabilities,
    signals,
    detected,
    model: decision.model,
    usage: decision.usage,
  });
}

export {
  completionGateInputSchema,
  completionGateResultSchema,
  completionGateVerdictSchema,
  completionGateSignalSchema,
} from './schema.js';
export type {
  CompletionGateInput,
  CompletionGateResult,
  CompletionGateVerdict,
  CompletionGateSignal,
} from './schema.js';
