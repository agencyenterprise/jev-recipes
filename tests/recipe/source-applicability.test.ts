import { sourceApplicability } from '../../recipes/source-applicability/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  sourceApplicability,
  {
    passage: 'Workspace owners can delete the workspace. These instructions are for owners only.',
    scenario: 'A workspace guest wants to delete the workspace.',
  },
  ['applies', 'does_not_apply', 'unclear'],
);
