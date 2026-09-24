import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  performanceFeedbackFacetsInputSchema,
  performanceFeedbackFacetsResultSchema,
} from './schema.js';
import type { PerformanceFeedbackFacetsInput, PerformanceFeedbackFacetsResult } from './schema.js';

export async function performanceFeedbackFacets(
  input: PerformanceFeedbackFacetsInput,
  options: RecipeOptions = {},
): Promise<PerformanceFeedbackFacetsResult> {
  const { minConfidence = 0.8, ...state } = performanceFeedbackFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      mentionsRhythm: {
        instruction:
          'Does feedback address rhythm, tempo, timing, or pulse, such as rushing, dragging, uneven subdivisions, or holding notes for their full value?',
        criteria: {
          true: 'The feedback comments on timing, tempo, pulse, rhythm accuracy, or steadiness.',
          false: 'The feedback says nothing about timing, tempo, or rhythm.',
        },
      },
      mentionsPitch: {
        instruction:
          'Does feedback address pitch or intonation, such as wrong notes, playing sharp or flat, tuning, or pitch accuracy in a register?',
        criteria: {
          true: 'The feedback comments on pitch accuracy, intonation, tuning, or wrong notes.',
          false: 'The feedback says nothing about pitch, intonation, or note accuracy.',
        },
      },
      mentionsDynamics: {
        instruction:
          'Does feedback address dynamics, such as loudness, softness, contrast, crescendos, diminuendos, accents, or balance between hands or parts?',
        criteria: {
          true: 'The feedback comments on volume levels, dynamic contrast, accents, or balance.',
          false: 'The feedback says nothing about loudness, contrast, or balance.',
        },
      },
      mentionsTechnique: {
        instruction:
          'Does feedback address physical technique, such as posture, hand position, fingering, bowing, breathing, embouchure, pedaling, or articulation mechanics?',
        criteria: {
          true: 'The feedback comments on how the player physically produces the sound, such as fingering, bow use, breath support, hand shape, posture, or pedaling.',
          false: 'The feedback says nothing about the physical means of playing.',
        },
      },
      mentionsExpression: {
        instruction:
          'Does feedback address expression or phrasing, such as musical shape, direction, character, style, rubato, or communicating the mood of the piece?',
        criteria: {
          true: 'The feedback comments on phrasing, musical shape, character, style, or emotional communication.',
          false: 'The feedback says nothing about phrasing, shape, character, or musical meaning.',
        },
      },
    },
    options,
  );
  return performanceFeedbackFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  performanceFeedbackFacetsInputSchema,
  performanceFeedbackFacetsResultSchema,
  performanceFeedbackFacetsLabelSchema,
} from './schema.js';
export type {
  PerformanceFeedbackFacetsInput,
  PerformanceFeedbackFacetsResult,
  PerformanceFeedbackFacetsLabel,
} from './schema.js';
