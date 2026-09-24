import { extractionFidelity } from '../../recipes/extraction-fidelity/index.js';
import { testScore } from './helpers/score.js';

testScore(
  extractionFidelity,
  {
    source:
      'Invoice INV-2041 issued 3 March 2026 to Harbor Lighting Ltd. Total $1,101.60, due 2 April 2026.',
    extracted: '{"invoiceNumber":"INV-2041","customer":"Harbor Lighting Ltd","total":1101.6}',
  },
  ['poor', 'low', 'fair', 'high', 'exact'],
  'fidelity',
);
