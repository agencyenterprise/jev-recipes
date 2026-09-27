import { route } from 'jev-recipes/route';
import { createDirectClient, createGatewayClient } from './clients.mjs';

const provider = process.argv[2];
if (
  !['direct', 'gateway'].includes(provider) ||
  process.argv[3] !== '--live' ||
  process.argv.length !== 4
)
  throw new Error('Usage: node examples/integrations/run.mjs direct|gateway --live');
const client = provider === 'gateway' ? createGatewayClient() : createDirectClient();
const result = await route(
  {
    request: 'Please correct the extra charge on my invoice.',
    routes: { billing: 'Invoices and payments', technical: 'Errors and product failures' },
  },
  { client },
);
console.log(JSON.stringify({ provider, result }, null, 2));
