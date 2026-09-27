import { diffHazards } from '../../recipes/diff-hazards/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  diffHazards,
  {
    diff: "--- a/src/payments.ts\n+++ b/src/payments.ts\n@@ -1,6 +1,9 @@\n import { Stripe } from 'stripe';\n-const stripe = new Stripe(process.env.STRIPE_KEY);\n+const stripe = new Stripe('sk_prod_51Hq9zLKj3mD8vXyZ2pQ7rT4wN6bF0cE1gA5hJ8kL');\n+console.log('DEBUG charge payload', payload);\n export async function charge(payload) {\n   return stripe.charges.create(payload);\n }",
  },
  ['secretLeak', 'destructiveCommand', 'debugLeftover', 'testsWeakened', 'dependencyChange'],
  ['context'],
);
