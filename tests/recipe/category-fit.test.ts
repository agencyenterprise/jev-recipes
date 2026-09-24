import { categoryFit } from '../../recipes/category-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  categoryFit,
  {
    item: 'Replacement HEPA filter two-pack for the AirPure 300 series purifier.',
    category:
      'Air Purifiers: standalone air purifying appliances. Excludes replacement filters and accessories.',
  },
  ['fits', 'misfiled'],
  'verdict',
);
