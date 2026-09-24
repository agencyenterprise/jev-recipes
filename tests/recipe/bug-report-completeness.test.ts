import { bugReportCompleteness } from '../../recipes/bug-report-completeness/index.js';
import { testScore } from './helpers/score.js';

testScore(
  bugReportCompleteness,
  { report: 'The export button does nothing when I click it.' },
  ['bare', 'symptom', 'partial', 'nearly', 'complete'],
  'completeness',
);
