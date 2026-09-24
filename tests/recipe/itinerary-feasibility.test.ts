import { itineraryFeasibility } from '../../recipes/itinerary-feasibility/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  itineraryFeasibility,
  {
    itinerary:
      'Saturday: 09:10 depart Boston Logan on a flight landing at New York JFK at 10:35. 11:00 to 12:30 private tour at the Metropolitan Museum of Art on the Upper East Side. 12:00 lunch reservation for four at a restaurant in Brooklyn Heights. 14:00 to 17:00 guided walk through Central Park. 17:30 check in at the hotel in Midtown. 20:00 Broadway show, curtain at 20:00 sharp.',
  },
  ['feasible', 'infeasible'],
);
