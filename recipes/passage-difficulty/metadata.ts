import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-difficulty',
  title: 'Grade the difficulty of a musical passage',
  description:
    'How hard is the passage described in passage for a player of instrument, from beginner to virtuoso?',
  category: 'knowledge',
  tags: ['music', 'practice', 'difficulty', 'education', 'score', 'grading'],
  useWhen:
    "You are building a practice app, lesson planner, or repertoire search and need to grade described passages or pieces so they can be matched to a player's level.",
  related: [
    {
      id: 'task-complexity',
      reason:
        'Use task-complexity to grade how involved a general task is, rather than how hard a musical passage is to play.',
    },
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to check whether content suits a described audience, rather than to place a passage on a difficulty scale.',
    },
  ],
  limitations: [
    'Grades the passage as described in text, not from a score or recording. Tempo, key, range, and technique count only when the description states them.',
    'Difficulty is relative to typical players of the named instrument; when instrument is omitted the grade assumes whatever instrument the description implies.',
    "Does not know a particular student's level. Matching a grade to a player belongs in application code.",
  ],
} satisfies RecipeMetadata;
