import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { styleKindInputSchema, styleKindResultSchema } from './schema.js';
import type { StyleKindInput, StyleKindResult } from './schema.js';

export async function styleKind(
  input: StyleKindInput,
  options: RecipeOptions = {},
): Promise<StyleKindResult> {
  const { minConfidence = 0.8, ...state } = styleKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Read description, which describes either a musical passage or a listener's request for one, and decide which broad style it evokes. Judge the stylistic markers the text names or implies: harmony, rhythm, instrumentation, idiom, named genres, and named artists or composers. Pick the single style the description points to most. A named artist or genre counts as a stylistic marker. Choose unclear when description carries no stylistic marker or when it mixes styles with no one dominant.",
    {
      classical:
        'The description points to the Western art-music tradition: named classical composers or forms, functional harmony with cadences, counterpoint, or terms such as sonata, etude, or nocturne.',
      jazz: 'The description points to jazz idiom: swing feel, walking bass, extended or altered chords, ii-V-I progressions, improvisation over changes, or named jazz artists.',
      blues:
        'The description points to blues idiom: twelve-bar form, dominant-seventh chords on I, IV, and V, blue notes, shuffle feel, or call-and-response phrasing.',
      pop: 'The description points to pop or rock songwriting: verse and chorus, simple diatonic loops such as I-V-vi-IV, hook-led melody, or named pop artists.',
      electronic:
        'The description points to electronic dance or synth music: four-on-the-floor kick, arpeggiated synths, builds and drops, side-chain pumping, or named electronic artists.',
      folk: 'The description points to folk or traditional idiom: modal or pentatonic melody, drones, fiddle or acoustic guitar figures, strophic song, or named traditional tunes.',
      unclear:
        'The description carries no stylistic marker, or mixes styles with none clearly dominant.',
    },
    options,
  );
  return styleKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { styleKindInputSchema, styleKindResultSchema, styleKindVerdictSchema } from './schema.js';
export type { StyleKindInput, StyleKindResult, StyleKindVerdict } from './schema.js';
