import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'style-kind',
  title: 'Identify a musical style',
  description: 'What style does the described passage or request evoke?',
  category: 'knowledge',
  tags: ['music', 'style', 'genre', 'classification', 'knowledge', 'live-performance'],
  useWhen:
    "A passage or a listener's request is described in text and you need one of a fixed set of broad styles to steer what comes next or to label what was played.",
  related: [
    {
      id: 'document-role',
      reason:
        'Use document-role to identify the purpose of a document rather than the musical style a description evokes.',
    },
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to check whether material suits a described audience rather than which style it belongs to.',
    },
  ],
  limitations: [
    'Labels the style the description evokes, not the historical or commercial genre of any real recording. Sub-genres and fusions collapse to the nearest broad style or to unclear.',
    'Reads the words of description only; it cannot hear audio or check that the description is accurate.',
    'A description that lists notes and chords without any stylistic markers lands on unclear rather than being guessed.',
  ],
} satisfies RecipeMetadata;
