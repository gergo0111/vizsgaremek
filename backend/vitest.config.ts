import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'generated/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/index.ts',
        '**/main.ts',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'test/**/*.spec.ts'],
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      src: '/Users/szaboloveygergo/Documents/vizsgaremek/vizsgaremek/backend/src',
    },
  },
});
