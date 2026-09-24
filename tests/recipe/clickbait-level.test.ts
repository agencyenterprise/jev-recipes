import { clickbaitLevel } from '../../recipes/clickbait-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  clickbaitLevel,
  { headline: 'This One Kitchen Habit Is Secretly Destroying Your Health - Doctors Are Stunned' },
  ['none', 'mild', 'moderate', 'heavy', 'extreme'],
  'bait',
);
