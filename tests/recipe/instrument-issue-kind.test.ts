import { instrumentIssueKind } from '../../recipes/instrument-issue-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  instrumentIssueKind,
  {
    report:
      'My Telecaster has developed a metallic buzz on the low E and A strings whenever I fret anything between the 5th and 9th frets. Open strings are fine and it still tunes up normally. It only started after I swapped to a heavier string set last week.',
  },
  ['tuning', 'buzz_or_rattle', 'no_sound', 'intonation', 'mechanical', 'cosmetic', 'unclear'],
);
