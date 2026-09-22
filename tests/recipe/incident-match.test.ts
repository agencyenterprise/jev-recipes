import { incidentMatch } from '../../recipes/incident-match/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  incidentMatch,
  {
    ticket: 'Workspace exports fail with EXPORT_TIMEOUT.',
    incidents: [
      {
        id: 'exports',
        text: 'Active incident: workspace exports fail with EXPORT_TIMEOUT.',
      },
      {
        id: 'billing',
        text: 'Active incident: invoices appear with a delay.',
      },
    ],
  },
  'incidents',
  ['context'],
);
