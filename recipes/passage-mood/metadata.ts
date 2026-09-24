import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-mood',
  title: "Identify a passage's mood",
  description: 'What mood does the described musical passage express?',
  category: 'knowledge',
  tags: ['music', 'psychology', 'mood', 'analysis', 'knowledge', 'live-performance'],
  useWhen:
    'A musical passage is described in text, such as mode, tempo, register, and dynamics, and you need one of a fixed set of moods to compare against a request or to log what was played.',
  related: [
    {
      id: 'emotion-kind',
      reason:
        'Use emotion-kind to label the emotion a writer expresses in a message, rather than the mood a described piece of music conveys.',
    },
    {
      id: 'outcome-framing',
      reason:
        'Use outcome-framing to label gain and loss wording about an outcome, not the affect of a musical description.',
    },
  ],
  limitations: [
    'Judges the described musical features only. It does not know how any listener felt or what the performer intended.',
    'Reads the description as written and cannot hear audio; an inaccurate description yields a mood about the description, not the sound.',
    'Passages whose described features point in opposite directions, such as a bright major melody over a driving dissonant bass, resolve to the dominant mood or to unclear.',
  ],
} satisfies RecipeMetadata;
