import { documentRole } from '../../recipes/document-role/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  documentRole,
  {
    document:
      'New in this release: workspace exports now include archived reports. Fixed an invoice download error.',
  },
  ['policy', 'tutorial', 'reference', 'troubleshooting', 'release_note', 'other', 'unclear'],
);
