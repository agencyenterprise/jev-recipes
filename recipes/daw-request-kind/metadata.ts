import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'daw-request-kind',
  title: 'Classify a request to a music program',
  description:
    'What does request ask a DAW or music program to do: record, edit, mix, apply an effect, arrange, export, or unclear?',
  category: 'workflow',
  tags: ['music', 'daw', 'audio', 'voice-control', 'routing', 'classification'],
  useWhen:
    'You are building voice or chat control for a DAW, notation program, or recording app and need to route each spoken or typed request to the handler that owns that kind of operation.',
  related: [
    {
      id: 'route',
      reason:
        'Use route when the destinations are your own caller-defined list rather than this fixed set of music production operations.',
    },
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent to classify the conversational role of a turn, such as a question or a correction, rather than which production operation it asks for.',
    },
  ],
  limitations: [
    'Classifies the kind of operation requested, not its parameters. Extract track names, times, values, and file formats in a separate step.',
    'A request that chains several operations is classified by the one it asks for first or presses most. Split compound requests in code when each step needs its own handler.',
    'Does not judge whether the operation is possible in the current project or safe to perform without confirmation.',
  ],
} satisfies RecipeMetadata;
