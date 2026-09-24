import { rootCauseDepth } from '../../recipes/root-cause-depth/index.js';
import { testScore } from './helpers/score.js';

testScore(
  rootCauseDepth,
  {
    analysis:
      'Line 3 stopped twice this week because the conveyor drive motor tripped on overtemperature. The motor overheated because the cooling fan intake was packed with cardboard dust. The intake was clogged because the weekly intake cleaning task was not performed for about eleven weeks. That task was dropped when the preventive maintenance schedule was migrated to the new CMMS in June: the migration checklist had no step to reconcile task counts between the old and new systems, and no one was assigned to own the migration, so the missing task was never noticed.',
  },
  ['symptom', 'immediate', 'contributing', 'systemic', 'verified'],
  'depth',
);
