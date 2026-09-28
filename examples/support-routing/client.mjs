import { createClient } from 'jev-recipes';

export function createGatewayClient({
  apiKey = process.env.VERCEL_GATEWAY_API_KEY ?? process.env.AI_GATEWAY_API_KEY,
  ...options
} = {}) {
  if (!apiKey?.trim()) throw new Error('Set VERCEL_GATEWAY_API_KEY or AI_GATEWAY_API_KEY.');
  return createClient({
    ...options,
    apiKey,
    baseURL: 'https://ai-gateway.vercel.sh/typesafe',
    defaultModel: 'typesafe-ai/jev',
  });
}
