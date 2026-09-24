import { reconciliationMatch } from '../../recipes/reconciliation-match/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  reconciliationMatch,
  {
    record:
      '2024-03-14 | Adobe Creative Cloud team subscription, monthly, design team | Vendor: Adobe Inc.',
    statementLine: '03/16 ADOBE *CREATIVE CLD 800-833-6687 CA PURCHASE',
  },
  ['same', 'different'],
);
