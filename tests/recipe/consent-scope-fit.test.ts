import { consentScopeFit } from '../../recipes/consent-scope-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  consentScopeFit,
  {
    consent:
      'I authorize Riverside Family Clinic to share my visit summaries and lab results with my cardiologist, Dr. Anita Patel, for the purpose of coordinating my heart care. This authorization expires one year from the date signed.',
    use: "Send the patient's lab results to a pharmaceutical company's research registry for a hypertension study.",
  },
  ['covered', 'uncovered'],
);
