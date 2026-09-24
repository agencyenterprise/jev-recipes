import { performanceFeedbackFacets } from '../../recipes/performance-feedback-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  performanceFeedbackFacets,
  {
    feedback:
      'Good work this week. The dotted eighths in bars 9 to 12 are still rushing, so put the metronome on and count the sixteenth underneath. The high F-sharp in bar 14 was flat every time; check it against the open E before you start. I liked the contrast between the quiet opening and the forte at the return of the theme, keep that.',
  },
  [
    'mentionsRhythm',
    'mentionsPitch',
    'mentionsDynamics',
    'mentionsTechnique',
    'mentionsExpression',
  ],
);
