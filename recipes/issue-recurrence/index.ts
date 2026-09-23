import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { issueRecurrenceInputSchema, issueRecurrenceResultSchema } from './schema.js';
import type { IssueRecurrenceInput, IssueRecurrenceResult } from './schema.js';

export async function issueRecurrence(
  input: IssueRecurrenceInput,
  options: RecipeOptions = {},
): Promise<IssueRecurrenceResult> {
  const { minConfidence = 0.8, ...state } = issueRecurrenceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'For the supplied issue, does the latest customer message report a first occurrence, uninterrupted persistence, or a return after reported recovery? Interpret optional history oldest first and keep different issues separate. Use explicit customer reports, including a timeline within message. Choose new only when a first occurrence is explicitly established; missing history is not evidence that an issue is new. Choose ongoing when the customer reports that the issue persisted or never stopped. Choose returned only when the same issue is reported active now after an explicit customer report of recovery or working operation. The word "again" alone does not establish an intervening recovery. An attempted fix, deployment, closed ticket, provider assurance, or thanks alone does not establish observed recovery. If the latest message clearly corrects an earlier mistaken recovery report by saying the issue never stopped, choose ongoing. Otherwise conflicting reports or unclear chronology require unclear. Also choose unclear when current presence, the link to the same issue, or the distinction between persistence and recurrence is unresolved, or when the issue is reported resolved now and no current problem is reported. Do not infer a shared root cause from similar symptoms. Classify supplied reports, not verified system state, and do not reopen or update tickets.',
    {
      new: 'The customer explicitly reports a first occurrence of the supplied issue, without conflicting history.',
      ongoing:
        'The customer reports that the supplied issue is still present and has persisted without recovery.',
      returned:
        'The same issue is reported active again after an explicit customer report of recovery.',
      unclear:
        'The reports do not establish one recurrence state, conflict without correction, concern a different issue, or do not report a current problem.',
    },
    options,
  );
  return issueRecurrenceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}
export {
  issueRecurrenceInputSchema,
  issueRecurrenceResultSchema,
  issueRecurrenceVerdictSchema,
} from './schema.js';
export type {
  IssueRecurrenceInput,
  IssueRecurrenceResult,
  IssueRecurrenceVerdict,
} from './schema.js';
