import { logLineKind } from '../../recipes/log-line-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  logLineKind,
  {
    line: '2026-09-23T14:02:11Z WARN db.pool: connection pool at 87% capacity, above the 80% threshold; new requests may queue',
  },
  ['error', 'warning', 'lifecycle', 'request', 'metric', 'debug', 'unclear'],
);
