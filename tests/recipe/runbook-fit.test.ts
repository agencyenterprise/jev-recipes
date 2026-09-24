import { runbookFit } from '../../recipes/runbook-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  runbookFit,
  {
    incident:
      'Consumer lag on the notifications-worker Kafka group has climbed past 500k messages over the last 20 minutes. Email and push notifications are arriving up to 40 minutes late. No deploys to the worker today.',
    runbook:
      'Runbook: notifications-worker consumer lag. Trigger: consumer lag alert for group notifications-worker, or user reports of delayed email or push. Steps: 1) Check worker pod count and restart counts in the notifications namespace. 2) Check SMTP and APNs error rates on the delivery dashboard. 3) If pods are healthy and downstream is clean, scale the deployment to twice its current replicas. 4) If lag keeps growing, check partition skew on the notifications topic.',
  },
  ['applies', 'inapplicable'],
);
