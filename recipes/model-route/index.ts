import { score } from '@typesafe-ai/sdk';
import { evaluateWithJev } from '../../src/client.js';
import { parseScoreAnswer } from '../../src/answers.js';
import { parseDecisionState } from '../../src/decisions.js';
import { asScoreInstruction } from '../../src/scores.js';
import { resolveSelection, selectionQuestion } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { modelRouteInputSchema, modelRouteResultSchema, modelRouteEffortSchema } from './schema.js';
import type { ModelRouteInput, ModelRouteResult } from './schema.js';

const EFFORT_RUBRIC: [string, string, ...string[]] = [
  'A direct lookup, small edit, reformat, or short factual answer with one obvious approach and little risk if slightly wrong.',
  'A task with a few interacting parts, some judgment about approach, or moderate consequences, such as a multi-file change or an explanation that must be accurate.',
  'A task that needs careful multi-step reasoning, novel design, subtle debugging, or where a mistake is costly, such as architecture decisions, security-sensitive code, or ambiguous requirements.',
];

export async function modelRoute(
  input: ModelRouteInput,
  options: RecipeOptions = {},
): Promise<ModelRouteResult> {
  const { minConfidence = 0.8, ...state } = modelRouteInputSchema.parse(input);
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: {
        decision: selectionQuestion(
          state.models,
          'Which of models should handle request, given any context? Each model describes its strengths, weaknesses, and cost. Prefer the cheapest model whose described capabilities clearly cover the request; escalate only when the request needs a capability a cheaper model lacks.',
        ),
        effort: score(
          asScoreInstruction(
            'How much reasoning effort does request need to be handled well, given any context?',
            EFFORT_RUBRIC,
          ),
          EFFORT_RUBRIC,
        ),
      },
    },
    options,
  );
  const selection = resolveSelection(response.answers.decision, state.models, minConfidence);
  const effort = parseScoreAnswer(response.answers.effort, EFFORT_RUBRIC.length);
  return modelRouteResultSchema.parse({
    ...selection,
    effort: modelRouteEffortSchema.options[effort.level],
    effortLevel: effort.level,
    effortScore: effort.score,
    effortConfidence: effort.confidence,
    effortProbabilities: effort.probabilities,
    model: response.model,
    usage: response.usage,
  });
}

export { modelRouteInputSchema, modelRouteResultSchema, modelRouteEffortSchema } from './schema.js';
export type { ModelRouteInput, ModelRouteResult, ModelRouteEffort } from './schema.js';
