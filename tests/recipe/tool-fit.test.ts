import { toolFit } from '../../recipes/tool-fit/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  toolFit,
  {
    task: 'Read the current incident status.',
    tool: 'Status reader: retrieves active incidents. It cannot create or modify incidents.',
  },
  ['fits', 'does_not_fit', 'unclear'],
  ['context'],
);
