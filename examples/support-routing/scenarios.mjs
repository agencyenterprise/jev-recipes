import { fixture } from '../shared/fixtures.mjs';

export const supportRoutes = {
  billing: 'Invoice amounts, charges, refunds, and subscription payments.',
  account: 'Sign-in, passwords, account access, and account profile changes.',
  technical: 'Product errors, broken features, crashes, and service outages.',
};

export const scenarios = {
  ready: {
    request: 'Please explain the extra charge on my invoice.',
    choice: 'billing',
    confidence: 0.96,
  },
  escalation: {
    request: 'I paid, but my workspace still says my plan is inactive.',
    choice: 'billing',
    confidence: 0.62,
  },
  review: { request: 'Something is wrong. Can you help?', choice: '__review__', confidence: 0.93 },
  failure: { request: 'The app crashes when I export a report.', failure: true },
};

export function scenarioOptions(name) {
  const scenario = scenarios[name];
  if (!scenario) throw new Error('Unknown fixture scenario.');
  return {
    client: {
      systemOne: scenario.failure
        ? async () => {
            throw new Error('Simulated provider outage.');
          }
        : fixture({ route: scenario.choice }, scenario.confidence),
    },
    fallback: async () => ({ status: 'ready', route: 'technical', model: 'fallback-fixture' }),
  };
}
