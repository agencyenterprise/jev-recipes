import { proposalFacets } from '../../recipes/proposal-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  proposalFacets,
  {
    proposal:
      "Riverbend Youth Literacy Program. In Riverbend County, 38% of third graders read below grade level, and both public library branches ended their after-school programs in 2024, leaving no free reading support outside school hours. We request $48,000 to run a twice-weekly after-school reading program at three elementary schools during the 2026-27 school year. Objectives: enroll 90 students in grades 2 and 3, and raise participants' reading level by at least one grade band by May 2027. Activities: recruit and train 12 volunteer tutors in September; run 60-minute small-group sessions on Tuesdays and Thursdays from October through May; hold a family reading night at each school every quarter. Budget: program coordinator (0.5 FTE) $30,000; books and materials $9,000; tutor training and background checks $4,000; snacks and family nights $5,000.",
  },
  ['statesNeed', 'statesObjectives', 'statesActivities', 'statesBudget', 'statesEvaluation'],
);
