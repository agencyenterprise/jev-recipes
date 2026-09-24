import { instrumentReportFacets } from '../../recipes/instrument-report-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  instrumentReportFacets,
  {
    message:
      'Hi, I have a Martin D-18 (2019) and the B string has started buzzing on the 2nd and 3rd frets. Open it is fine. This began about ten days ago, right after I changed to a set of light-gauge phosphor bronze strings and lowered the saddle a little myself. I have not changed anything else. Can someone take a look?',
  },
  ['statesInstrument', 'statesSymptom', 'statesOnset', 'statesRecentChanges', 'statesEnvironment'],
);
