import { searchIntentKind } from '../../recipes/search-intent-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  searchIntentKind,
  { query: 'best noise cancelling headphones under 200 vs sony wh-1000xm5' },
  ['informational', 'navigational', 'transactional', 'commercial', 'local', 'unclear'],
);
