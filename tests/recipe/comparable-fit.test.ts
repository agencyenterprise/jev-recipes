import { comparableFit } from '../../recipes/comparable-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  comparableFit,
  {
    subject:
      'Single-family ranch, 3 bedrooms, 2 baths, 1,650 sq ft, built 1978, updated kitchen and roof (2019), attached 2-car garage, 0.3-acre lot on a quiet suburban cul-de-sac in Maple Grove.',
    comparable:
      'Condominium, 2 bedrooms, 2 baths, 1,100 sq ft, built 2015, 14th floor of a downtown high-rise with concierge, one deeded parking space, HOA dues $610/month.',
  },
  ['comparable', 'dissimilar'],
);
