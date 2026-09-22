import { fieldSelect } from '../../recipes/field-select/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  fieldSelect,
  {
    field: 'Invoice reference',
    document: 'Invoice INV-2026-A. Purchase order PO-77.',
    candidates: [
      {
        id: 'invoice',
        text: 'INV-2026-A',
      },
      {
        id: 'purchase-order',
        text: 'PO-77',
      },
    ],
  },
  'candidates',
);
