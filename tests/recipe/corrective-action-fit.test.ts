import { correctiveActionFit } from '../../recipes/corrective-action-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  correctiveActionFit,
  {
    rootCause:
      'The torque wrench at station 4 was reading 15% low because the tooling register lists a 24-month calibration interval for this wrench model while the manufacturer specifies 12 months. The wrench passed its last register-scheduled check and drifted out of tolerance eight months later, so every assembly torqued at station 4 since then is suspect.',
    action:
      'Rework the 340 assemblies built since the last calibration to the specified torque and verify with a calibrated reference wrench. Send the station 4 wrench for recalibration and return it to service once it passes. Brief operators on checking the calibration sticker before each shift.',
  },
  ['addresses', 'misses'],
);
