import { listenerRequestKind } from '../../recipes/listener-request-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  listenerRequestKind,
  { message: 'can you slow it down a bit? feels kinda frantic rn' },
  ['mood', 'tempo', 'style', 'specific_piece', 'dynamics', 'stop', 'unclear'],
  ['context'],
);
