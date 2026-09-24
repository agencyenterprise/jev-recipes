import { symptomFacets } from '../../recipes/symptom-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  symptomFacets,
  {
    message:
      'My lower back started hurting on Saturday after I moved some boxes, so it has been about five days now. It gets worse when I sit for a long time and eases up when I walk around. I have been taking ibuprofen twice a day and using a heating pad at night, but it is not really improving. Should I come in?',
  },
  ['statesOnset', 'statesSeverity', 'statesDuration', 'statesModifiers', 'statesPriorTreatment'],
);
