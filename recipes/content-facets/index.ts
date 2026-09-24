import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { contentFacetsInputSchema, contentFacetsResultSchema } from './schema.js';
import type { ContentFacetsInput, ContentFacetsResult } from './schema.js';

export async function contentFacets(
  input: ContentFacetsInput,
  options: RecipeOptions = {},
): Promise<ContentFacetsResult> {
  const { minConfidence = 0.8, ...state } = contentFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesThesis: {
        instruction:
          'Does article state a clear central claim or position rather than only describing a topic?',
        criteria: {
          true: 'The article states a central claim or position that the rest of the text supports.',
          false: 'The article surveys a topic without committing to a central claim.',
        },
      },
      providesEvidence: {
        instruction:
          'Does article offer data, examples, citations, or named sources in support of its points?',
        criteria: {
          true: 'The article includes at least one concrete data point, example, citation, or named source offered as support.',
          false:
            'The article makes assertions without data, examples, citations, or named sources.',
        },
      },
      addressesCounterarguments: {
        instruction: 'Does article acknowledge or respond to an opposing view or objection?',
        criteria: {
          true: 'The article names at least one opposing view or objection and acknowledges or responds to it.',
          false: 'The article presents only its own position and mentions no opposing view.',
        },
      },
      includesCallToAction: {
        instruction: 'Does article ask the reader to take a specific action?',
        criteria: {
          true: 'The article directs the reader to do something, such as try, sign up, download, contact, or change a practice.',
          false: 'The article does not ask the reader to do anything.',
        },
      },
      signalsExpertise: {
        instruction:
          "Does article state the author's credentials, direct experience, or first-hand testing?",
        criteria: {
          true: "The article states the author's credentials, role, direct experience, or first-hand testing relevant to the subject.",
          false: 'The article gives no indication of who the author is or why they are qualified.',
        },
      },
    },
    options,
  );
  return contentFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  contentFacetsInputSchema,
  contentFacetsResultSchema,
  contentFacetsLabelSchema,
} from './schema.js';
export type { ContentFacetsInput, ContentFacetsResult, ContentFacetsLabel } from './schema.js';
