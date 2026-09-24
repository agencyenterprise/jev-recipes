import { invoiceFacets } from '../../recipes/invoice-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  invoiceFacets,
  {
    invoice:
      'Northwind Design Studio\n412 Harbor St, Portland OR\n\nINVOICE #2024-0187\nBill to: Acme Robotics, Attn: Accounts Payable\n\n1. Landing page redesign, 24 hrs @ $120/hr ........ $2,880.00\n2. Icon set (32 icons) ................................ $640.00\n\nSubtotal: $3,520.00\nTax (0%): $0.00\nTotal due: $3,520.00\n\nThank you for your business.',
  },
  ['statesVendor', 'statesInvoiceNumber', 'statesDueDate', 'statesLineItems', 'statesTotals'],
);
