import { repetitionLevel } from '../../recipes/repetition-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  repetitionLevel,
  {
    recentMaterial:
      'C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 (all quarter notes, same dynamic, no rests)',
  },
  ['varied', 'some', 'repetitive', 'looping', 'stuck'],
  'repetition',
);
