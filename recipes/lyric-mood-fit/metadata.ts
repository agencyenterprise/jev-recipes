import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'lyric-mood-fit',
  title: 'Check lyrics against the mood of the music',
  description: 'Do lyrics fit the mood and pacing of the music described in music?',
  category: 'knowledge',
  tags: ['music', 'lyrics', 'songwriting', 'mood', 'gate', 'creative'],
  useWhen:
    'You generate, suggest, or review lyrics for a described track and want to catch lines whose mood or pacing clashes with the music before showing them to a writer.',
  related: [
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to judge whether content suits a described audience, rather than whether lyrics suit a described piece of music.',
    },
    {
      id: 'certainty-match',
      reason:
        'Use certainty-match for the analogous check that the confidence of a statement matches its evidence.',
    },
  ],
  limitations: [
    'Judges mood and pacing fit only. It does not check rhyme, syllable count, meter, or whether the lyrics scan against a melody.',
    'The music is known only from its description; the verdict cannot hear the track.',
    'Does not judge lyric quality, originality, or whether the lyrics are appropriate for an audience.',
  ],
} satisfies RecipeMetadata;
