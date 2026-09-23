import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'take-turn',
  title: 'Assess whether a player can act now',
  description:
    "Interpret game rules and current state to label a player's turn or reaction opportunity as act, wait, inactive, or unclear.",
  category: 'workflow',
  tags: [
    'gameplay',
    'game',
    'take turn',
    'whose turn',
    'act now',
    'wait',
    'reaction',
    'players',
    'simulation',
  ],
  useWhen:
    "You need to decide whether it is a player's turn to act or react using narrative game rules, state, and previous actions.",
  related: [
    {
      id: 'choose-action',
      reason: 'Use choose-action to compare candidate moves after establishing the player can act.',
    },
    {
      id: 'step-complete',
      reason:
        'Use step-complete to check whether a defined turn-completion condition was met; take-turn assesses the current opportunity to act.',
    },
    {
      id: 'response-needed',
      reason:
        'Use response-needed for conversational follow-through, rather than turn and reaction eligibility under game rules.',
    },
  ],
  limitations: [
    'Assesses narrative turn eligibility, not a legality proof. When a game engine provides an exact turn or reaction flag, use that directly.',
    'Does not take a turn, select an action, update state, or verify that a player already completed a turn.',
    'Act includes optional reactions and does not mean using that opportunity is strategically best. Missing or conflicting facts require review.',
  ],
} satisfies RecipeMetadata;
