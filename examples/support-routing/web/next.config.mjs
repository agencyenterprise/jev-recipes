import { fileURLToPath } from 'node:url';

export default {
  agentRules: false,
  outputFileTracingRoot: fileURLToPath(new URL('../../../..', import.meta.url)),
};
