import { commitMessageFit } from '../../recipes/commit-message-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  commitMessageFit,
  {
    message: 'Fix off-by-one in pagination cursor',
    change: 'Changed the end index in paginate() from offset + limit to offset + limit - 1.',
  },
  ['fits', 'mismatched'],
);
