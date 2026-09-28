import { supportConfig } from './config.mjs';

export const supportRoutes = supportConfig.routes;

export const scenarios = {
  ready: {
    label: 'Clear match',
    request: 'Please explain the extra charge on my invoice.',
    choice: 'billing',
    confidence: 0.96,
  },
  escalation: {
    label: 'Second look',
    request: 'I paid, but my workspace still says my plan is inactive.',
    choice: 'billing',
    confidence: 0.62,
  },
  review: {
    label: 'Ask and continue',
    request: 'Something is wrong. Can you help?',
    choice: 'technical',
    confidence: 0.93,
    clarification: 'missing',
    reply: 'The app crashes when I export a report.',
  },
  unresolved: {
    label: 'Still unclear',
    request: 'Something is wrong. Can you help?',
    choice: '__review__',
    confidence: 0.93,
    clarification: 'missing',
    reply: 'It just does not work.',
    afterReply: 'ambiguous',
  },
  conflict: {
    label: 'Conflicting context',
    request: 'I cannot sign in, but sign-in works. I am not sure what failed.',
    choice: '__review__',
    confidence: 0.93,
    clarification: 'ambiguous',
    reply: 'Both are true. I still cannot tell what failed.',
    afterReply: 'ambiguous',
  },
  noFit: {
    label: 'No matching queue',
    request: 'Would your company sponsor my community event?',
    choice: '__review__',
    confidence: 0.95,
  },
  mixed: {
    label: 'Separate requests',
    request: 'Please refund the duplicate charge. Separately, exports crash.',
    choice: '__review__',
    confidence: 0.96,
  },
  indirect: {
    label: 'Indirect request',
    request: 'My card statement has two identical entries from you for the same month.',
    choice: 'billing',
    confidence: 0.95,
  },
  failure: {
    label: 'Service failure',
    request: 'The app crashes when I export a report.',
    failure: true,
  },
};

// Hand-authored responses exercise control flow; they do not simulate model accuracy.
export function scenarioOptions(name, answered = false) {
  const scenario = scenarios[name];
  if (!scenario) throw new Error('Unknown fixture scenario.');
  return {
    client: {
      systemOne: async (request) => {
        if (scenario.failure) throw new Error('Simulated provider outage.');
        return {
          model: 'support-fixture',
          usage: { input_tokens: 0, output_tokens: 0 },
          answers: Object.fromEntries(
            Object.entries(request.questions).map(([name, question]) => {
              const choice =
                name === 'route'
                  ? scenario.choice
                  : answered
                    ? (scenario.afterReply ?? 'present')
                    : (scenario.clarification ?? 'present');
              return [
                name,
                {
                  type: 'choice',
                  choice,
                  confidence: name === 'route' ? scenario.confidence : 0.98,
                  probabilities: Object.fromEntries(
                    Object.keys(question.criteria).map((key) => [key, key === choice ? 1 : 0]),
                  ),
                },
              ];
            }),
          ),
        };
      },
    },
    fallback: async () => ({ status: 'ready', route: 'technical', model: 'fallback-fixture' }),
  };
}
