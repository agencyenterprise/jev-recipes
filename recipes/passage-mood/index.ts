import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { passageMoodInputSchema, passageMoodResultSchema } from './schema.js';
import type { PassageMoodInput, PassageMoodResult } from './schema.js';

export async function passageMood(
  input: PassageMoodInput,
  options: RecipeOptions = {},
): Promise<PassageMoodResult> {
  const { minConfidence = 0.8, ...state } = passageMoodInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read passage, a text description of a musical passage, and decide which mood its described features express. Judge only the musical features named, such as mode, harmony, tempo, rhythm, register, articulation, and dynamics, and the conventional affect those features carry: major mode and lively tempo toward happy or energetic, minor mode and slow tempo toward sad, soft sustained textures toward calm, dissonance and unpredictable rhythm toward tense, warm harmony at a gentle pace toward romantic. Ignore any listener reactions, intentions, or titles that passage mentions. Pick the single mood the features support most, and choose unclear when passage names too few features to tell or when they point in opposite directions with none dominant.',
    {
      happy:
        'The described features are bright and buoyant: major mode, moderate-to-lively tempo, mid-to-high register, consonant harmony, and detached or bouncing articulation.',
      sad: 'The described features are dark and slow: minor mode, slow tempo, descending melodic lines, low or middle register, soft dynamics, and suspensions or sighing figures.',
      calm: 'The described features are gentle and still: slow-to-moderate tempo, sustained or arpeggiated texture, soft dynamics, consonant harmony, and little rhythmic drive.',
      energetic:
        'The described features are driving and loud: fast tempo, strong steady pulse, repeated rhythmic figures, wide range, and forte or louder dynamics.',
      tense:
        'The described features are unstable and unsettled: dissonant or diminished harmony, chromatic motion, irregular or syncopated rhythm, sudden accents, tremolo, or unresolved cadences.',
      romantic:
        'The described features are warm and yearning: lush or extended harmony, singing legato melody, rubato or gentle tempo, and swelling dynamics.',
      unclear:
        'The passage names too few musical features to judge, or its features point toward opposing moods with none dominant.',
    },
    options,
  );
  return passageMoodResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  passageMoodInputSchema,
  passageMoodResultSchema,
  passageMoodVerdictSchema,
} from './schema.js';
export type { PassageMoodInput, PassageMoodResult, PassageMoodVerdict } from './schema.js';
