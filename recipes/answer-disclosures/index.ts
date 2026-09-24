import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerDisclosuresInputSchema, answerDisclosuresResultSchema } from './schema.js';
import type { AnswerDisclosuresInput, AnswerDisclosuresResult } from './schema.js';

export async function answerDisclosures(
  input: AnswerDisclosuresInput,
  options: RecipeOptions = {},
): Promise<AnswerDisclosuresResult> {
  const { minConfidence = 0.8, ...state } = answerDisclosuresInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesUncertainty: {
        instruction:
          'Does draft explicitly express uncertainty about any of its own claims, such as hedging, confidence qualifiers, or saying it may be wrong?',
        criteria: {
          true: 'The draft explicitly signals uncertainty about at least one claim.',
          false: 'The draft presents its claims without any uncertainty signal.',
        },
      },
      statesLimitations: {
        instruction:
          'Does draft explicitly state what it does not cover, cannot do, or where its answer stops applying?',
        criteria: {
          true: 'The draft states at least one limitation or boundary of its answer.',
          false: 'The draft states no limitation.',
        },
      },
      citesSources: {
        instruction:
          'Does draft attribute any of its claims to a named source, document, reference, or link?',
        criteria: {
          true: 'The draft attributes at least one claim to an identifiable source.',
          false: 'The draft attributes nothing to a source.',
        },
      },
      statesAssumptions: {
        instruction:
          'Does draft explicitly name an assumption it is making about the request, the reader, or the situation?',
        criteria: {
          true: 'The draft names at least one assumption it relies on.',
          false: 'The draft names no assumption.',
        },
      },
    },
    options,
  );
  return answerDisclosuresResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  answerDisclosuresInputSchema,
  answerDisclosuresResultSchema,
  answerDisclosuresLabelSchema,
} from './schema.js';
export type {
  AnswerDisclosuresInput,
  AnswerDisclosuresResult,
  AnswerDisclosuresLabel,
} from './schema.js';
