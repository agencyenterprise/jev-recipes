import { fairHousingWording } from '../../recipes/fair-housing-wording/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  fairHousingWording,
  {
    listing:
      'Bright 1BR garden apartment on a quiet tree-lined street. Hardwood floors, updated kitchen, shared laundry in the basement, off-street parking for one car. $1,450/month, heat included. Perfect for a single professional or a quiet couple; not suitable for families with children. No smoking. Available October 1.',
  },
  ['flagged', 'clean'],
);
