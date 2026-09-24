import { resultPlausibility } from '../../recipes/result-plausibility/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  resultPlausibility,
  {
    request: 'Return the current temperature in Lisbon in Celsius.',
    result: '{"city": "Lisbon", "temperature_c": 24, "observed_at": "2026-09-23T13:00:00Z"}',
  },
  ['plausible', 'implausible'],
);
