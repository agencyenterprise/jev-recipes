import { reviewFacets } from '../../recipes/review-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  reviewFacets,
  {
    review:
      'Solid blender for the sale price, but the box arrived dented and the lid gasket was torn. Support sent a replacement in two days.',
  },
  ['mentionsQuality', 'mentionsPrice', 'mentionsShipping', 'mentionsService', 'reportsDefect'],
);
