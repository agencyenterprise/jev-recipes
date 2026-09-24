import { noticeFacets } from '../../recipes/notice-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  noticeFacets,
  {
    notice:
      'County Housing Assistance Program\nNotice of Missing Documentation\n\nCase number: HA-2026-44817\n\nDear Ms. Okafor,\n\nWe are reviewing your application for rental assistance. To continue processing it, we need a copy of your most recent 30 days of pay stubs and a signed copy of your current lease.\n\nPlease submit these documents by October 10, 2026. You may upload them through the resident portal or bring them to our office at 300 Civic Center Drive, Suite 110, Monday through Friday, 8:30 AM to 4:30 PM.\n\nIf we do not receive the documents by that date, your application will be closed and you will need to reapply.\n\nIf you have questions, call your case worker, Daniel Ruiz, at (555) 014-2270.\n\nSincerely,\nCounty Housing Assistance Program',
  },
  ['statesAction', 'statesDeadline', 'statesConsequence', 'statesContact', 'statesAppealRight'],
);
