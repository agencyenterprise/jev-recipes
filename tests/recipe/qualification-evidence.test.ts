import { qualificationEvidence } from '../../recipes/qualification-evidence/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  qualificationEvidence,
  {
    requirement: 'Three or more years operating Kubernetes in production.',
    profile:
      'Platform Engineer, 2020 to present. Own the production EKS platform (12 clusters); led the 2022 migration with zero downtime.',
  },
  ['evidenced', 'unevidenced'],
);
