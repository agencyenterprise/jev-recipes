import { safetyIncidentKind } from '../../recipes/safety-incident-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  safetyIncidentKind,
  {
    report:
      'Warehouse B, 14:20. A forklift reversing out of aisle 7 came within about a metre of a contractor walking through the marked pedestrian crossing. The driver stopped when the spotter shouted. No contact, no injuries, nothing damaged. The contractor was not wearing a high-visibility vest and the mirror at the aisle end is missing.',
  },
  [
    'near_miss',
    'first_aid',
    'medical_treatment',
    'property_damage',
    'environmental_release',
    'unsafe_condition',
    'unclear',
  ],
);
