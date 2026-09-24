import { careUrgencyWording } from '../../recipes/care-urgency-wording/index.js';
import { testScore } from './helpers/score.js';

testScore(
  careUrgencyWording,
  {
    message:
      'My daughter has had a fever of 101 since last night and now she says her ear really hurts. She is drinking fine and otherwise seems okay. Can someone see her today or tomorrow? I do not think it is an emergency, but I would rather not wait until next week.',
  },
  ['routine', 'soon', 'prompt', 'urgent', 'emergency'],
  'urgency',
);
