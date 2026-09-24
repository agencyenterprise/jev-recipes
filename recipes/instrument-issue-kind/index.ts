import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { instrumentIssueKindInputSchema, instrumentIssueKindResultSchema } from './schema.js';
import type { InstrumentIssueKindInput, InstrumentIssueKindResult } from './schema.js';

export async function instrumentIssueKind(
  input: InstrumentIssueKindInput,
  options: RecipeOptions = {},
): Promise<InstrumentIssueKindResult> {
  const { minConfidence = 0.8, ...state } = instrumentIssueKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Read report, a player's description of a problem with a musical instrument, and decide which kind of problem it describes based only on the symptom as worded. Pick the single kind the report presses most. Distinguish tuning (the instrument will not hold or reach pitch at all) from intonation (it is in tune in one place but out of tune in another register or up the neck). Use unclear when report does not describe a symptom clearly enough to classify. Do not guess the cause, the repair, or the cost.",
    {
      tuning:
        'The report says the instrument will not stay in tune, drifts, slips, or cannot be brought to pitch at all.',
      buzz_or_rattle:
        'The report describes an unwanted buzz, rattle, hum, or clank when the instrument is played or handled.',
      no_sound:
        'The report says the instrument, its electronics, or its output produces no sound, cuts out, or is silent on some notes or channels.',
      intonation:
        'The report says the instrument is in tune when open or in one register but out of tune when played up the neck, in another register, or on certain notes.',
      mechanical:
        'The report describes a part that is stuck, loose, broken, sluggish, or misaligned, such as keys, valves, pedals, tuners, action, or a bridge.',
      cosmetic:
        'The report describes only finish, appearance, or surface damage such as scratches, dents, fading, or cracked lacquer that does not affect playing.',
      unclear:
        'The report does not describe a symptom clearly enough to tell what kind of problem it is.',
    },
    options,
  );
  return instrumentIssueKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  instrumentIssueKindInputSchema,
  instrumentIssueKindResultSchema,
  instrumentIssueKindVerdictSchema,
} from './schema.js';
export type {
  InstrumentIssueKindInput,
  InstrumentIssueKindResult,
  InstrumentIssueKindVerdict,
} from './schema.js';
