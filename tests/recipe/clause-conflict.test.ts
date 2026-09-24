import { clauseConflict } from '../../recipes/clause-conflict/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  clauseConflict,
  {
    firstClause: 'The Customer shall pay each undisputed invoice within thirty days.',
    secondClause: 'All invoices are payable in full within fourteen days.',
  },
  ['conflict', 'compatible'],
  'verdict',
);
