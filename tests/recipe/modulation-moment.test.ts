import { modulationMoment } from '../../recipes/modulation-moment/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  modulationMoment,
  {
    recentMaterial:
      'Bar 3 of a four-bar phrase. The melody is climbing F4 G4 A4 toward the phrase peak on an upbeat, the harmony has just moved from ii to V, and there has been no cadence or rest since the phrase began.',
    key: 'C major',
  },
  ['suitable', 'unsuitable'],
);
