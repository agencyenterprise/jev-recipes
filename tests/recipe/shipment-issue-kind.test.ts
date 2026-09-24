import { shipmentIssueKind } from '../../recipes/shipment-issue-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  shipmentIssueKind,
  {
    message:
      'Tracking says my order was delivered yesterday but there is nothing on my porch or with my neighbors.',
  },
  ['delayed', 'damaged', 'lost', 'wrong_item', 'address', 'none', 'unclear'],
  ['context'],
);
