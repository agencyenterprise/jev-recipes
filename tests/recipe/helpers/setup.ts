import { beforeEach, afterEach, vi } from 'vitest';
import { TypeSafeClient } from '@typesafe-ai/sdk';

beforeEach(() => {
  vi.spyOn(TypeSafeClient.prototype, 'systemOne').mockImplementation(() => {
    throw new Error('Recipe tests must supply a mock Jev client.');
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(() => {
      throw new Error('Recipe tests cannot make network requests.');
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
