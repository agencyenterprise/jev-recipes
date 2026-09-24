import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { logLineKindInputSchema, logLineKindResultSchema } from './schema.js';
import type { LogLineKindInput, LogLineKindResult } from './schema.js';

export async function logLineKind(
  input: LogLineKindInput,
  options: RecipeOptions = {},
): Promise<LogLineKindResult> {
  const { minConfidence = 0.8, ...state } = logLineKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What does line report? Judge the event the text of line describes, using any level token as one signal among others. Ignore timestamps, logger names, and identifiers except where they clarify the event.',
    {
      error:
        'The line reports an operation that failed, an exception, or a state the system could not handle.',
      warning:
        'The line reports a condition that succeeded or continues but is abnormal, near a limit, or likely to cause trouble.',
      lifecycle:
        'The line reports a process or component starting, stopping, reloading, or loading configuration.',
      request:
        'The line reports a handled request, message, or job, typically with a method, path, status, or duration.',
      metric:
        'The line reports a periodic measurement or counter with no event attached, such as a heap size or queue depth sample.',
      debug:
        'The line reports internal state or a trace step useful only to a developer, with no operational event.',
      unclear:
        'The line does not describe a recognizable event, or the text is too fragmentary to classify.',
    },
    options,
  );
  return logLineKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  logLineKindInputSchema,
  logLineKindResultSchema,
  logLineKindVerdictSchema,
} from './schema.js';
export type { LogLineKindInput, LogLineKindResult, LogLineKindVerdict } from './schema.js';
