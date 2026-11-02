import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    hookTimeout: 300000, // 5 minutes to download in-memory mongodb binary on first run
    testTimeout: 60000,
    globals: true,
  },
});

