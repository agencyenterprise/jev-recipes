import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tool-call-gate',
  title: 'Gate an agent tool call',
  description:
    'Should an agent run toolCall now, ask a person first, or refuse it, given request and policy, with irreversible, destructive, out-of-scope, exfiltration, and injection risks flagged in the same call?',
  category: 'workflow',
  tags: [
    'agent',
    'tool-call',
    'permission',
    'guardrail',
    'safety',
    'injection',
    'pre-tool-use',
    'harness',
  ],
  useWhen:
    'A coding or browsing agent proposes a tool call and you need to review that action: an allow, ask, or deny decision plus the specific risks, in one fast request.',
  related: [
    {
      id: 'action-scope',
      reason:
        'Use action-scope when you only need to know whether an action stays within the request.',
    },
    {
      id: 'action-reversibility',
      reason: 'Use action-reversibility for a five-level grade of how reversible one action is.',
    },
    {
      id: 'action-effects',
      reason: 'Use action-effects to label what kinds of side effects an action has.',
    },
    {
      id: 'injection-signal',
      reason:
        'Use injection-signal to screen text for embedded instructions before an agent reads it.',
    },
  ],
  limitations: [
    'Judges the call as described in toolCall. Pass the actual tool name and arguments, not a summary written by the agent.',
    'Deterministic rules such as allowlists, path restrictions, and rate limits are cheaper and more reliable for what they cover; run them first and use this recipe for the cases they leave open.',
    'A review or ask outcome means a person should look; it does not itself block execution. The application must enforce the action.',
  ],
} satisfies RecipeMetadata;
