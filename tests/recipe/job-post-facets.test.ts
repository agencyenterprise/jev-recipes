import { jobPostFacets } from '../../recipes/job-post-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  jobPostFacets,
  {
    posting:
      'Senior Backend Engineer, Berlin (hybrid). EUR 85k to 105k. 5+ years with Go and PostgreSQL required.',
  },
  [
    'statesSalary',
    'statesLocation',
    'statesRemotePolicy',
    'statesExperienceLevel',
    'statesQualifications',
  ],
);
