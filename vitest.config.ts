import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the `~/*` alias from tsconfig so tests import the same way app code does.
  plugins: [tsconfigPaths()],
  test: {
    // Colocated with the code under test.
    include: ['app/**/*.test.ts', 'app/**/*.test.tsx'],
    environment: 'node',
    restoreMocks: true,
  },
});
