import { postmortemFacets } from '../../recipes/postmortem-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  postmortemFacets,
  {
    postmortem:
      'Incident 2026-09-18: checkout failures. 10:12 UTC: alert on checkout 5xx rate fired. 10:15: on-call acknowledged and confirmed failures in the order-confirmation step. 10:31: deploy of order-service 3.8.0 identified as the trigger and rolled back. 10:36: error rate returned to baseline. Impact: for 24 minutes, roughly 18% of checkout attempts failed at confirmation, affecting all regions. Root cause: 3.8.0 changed the idempotency key format, and the confirmation step rejected keys written by 3.7.x instances still running during the rolling deploy. Action items: (1) add a compatibility test for mixed-version idempotency keys; (2) add a canary stage to the order-service pipeline; (3) document the key format in the service contract.',
  },
  [
    'statesTimeline',
    'statesRootCause',
    'statesImpact',
    'statesContributingFactors',
    'statesActionItems',
  ],
);
