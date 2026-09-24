import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { jobPostFacetsInputSchema, jobPostFacetsResultSchema } from './schema.js';
import type { JobPostFacetsInput, JobPostFacetsResult } from './schema.js';

export async function jobPostFacets(
  input: JobPostFacetsInput,
  options: RecipeOptions = {},
): Promise<JobPostFacetsResult> {
  const { minConfidence = 0.8, ...state } = jobPostFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesSalary: {
        instruction:
          'Does posting state a salary, hourly rate, or compensation range in concrete figures? Phrases like competitive pay without a figure do not count.',
        criteria: {
          true: 'The posting states a concrete salary, rate, or range.',
          false: 'The posting gives no concrete compensation figure.',
        },
      },
      statesLocation: {
        instruction:
          'Does posting name the city, region, or country where the work is based, or state that it can be done from anywhere?',
        criteria: {
          true: 'The posting names a work location or states that any location is acceptable.',
          false: 'The posting does not say where the work is based.',
        },
      },
      statesRemotePolicy: {
        instruction:
          'Does posting state whether the role is on-site, hybrid, or remote, including any required in-office days?',
        criteria: {
          true: 'The posting states an on-site, hybrid, or remote arrangement.',
          false: 'The posting does not say whether the role is on-site, hybrid, or remote.',
        },
      },
      statesExperienceLevel: {
        instruction:
          'Does posting state the seniority or years of experience expected, such as junior, senior, lead, or a number of years?',
        criteria: {
          true: 'The posting states a seniority level or years of experience.',
          false: 'The posting does not state an experience level.',
        },
      },
      statesQualifications: {
        instruction:
          'Does posting list required qualifications, such as specific skills, degrees, certifications, or licenses the candidate must have?',
        criteria: {
          true: 'The posting lists at least one required qualification.',
          false: 'The posting lists no required qualifications.',
        },
      },
    },
    options,
  );
  return jobPostFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  jobPostFacetsInputSchema,
  jobPostFacetsResultSchema,
  jobPostFacetsLabelSchema,
} from './schema.js';
export type { JobPostFacetsInput, JobPostFacetsResult, JobPostFacetsLabel } from './schema.js';
