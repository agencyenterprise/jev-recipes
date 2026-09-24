import { planCompleteness } from '../../recipes/plan-completeness/index.js';
import { testScore } from './helpers/score.js';

testScore(
  planCompleteness,
  {
    task: 'Add a CSV export button that respects the current filters and works for guests.',
    plan: '1. Add the button. 2. Create the export endpoint. 3. Pass the active filters through.',
  },
  ['none', 'partial', 'mostly', 'nearly', 'complete'],
  'completeness',
);
