import { entityMatch } from '../../recipes/entity-match/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  entityMatch,
  {
    firstRecord: '{"name":"Acme Corp.","city":"Portland, OR","phone":"(503) 555-0147"}',
    secondRecord: 'ACME Corporation, Portland Oregon. Tel 503-555-0147.',
  },
  ['same', 'different'],
  'verdict',
  ['context'],
);
