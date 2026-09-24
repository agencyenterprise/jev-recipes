import { maintenanceHazardWording } from '../../recipes/maintenance-hazard-wording/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  maintenanceHazardWording,
  {
    request:
      "Unit 4B. Since this morning there's a strong gas smell in the kitchen, strongest near the stove even with all the burners off. I opened the windows. Can someone come take a look when they get a chance? Thanks.",
  },
  ['hazard', 'routine'],
);
