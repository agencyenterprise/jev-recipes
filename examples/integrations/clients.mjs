import { createClient } from 'jev-recipes';

export function createDirectClient(options = {}) {
  return createClient({
    ...options,
    baseURL: 'https://api.typesafe.ai',
    defaultModel: 'jev-1.13.0',
  });
}

export function createGatewayClient({ apiKey = process.env.AI_GATEWAY_API_KEY, ...options } = {}) {
  if (!apiKey?.trim()) throw new Error('Set AI_GATEWAY_API_KEY before using Vercel AI Gateway.');
  return createClient({
    ...options,
    apiKey,
    baseURL: 'https://ai-gateway.vercel.sh/typesafe',
    defaultModel: 'typesafe-ai/jev',
  });
}
