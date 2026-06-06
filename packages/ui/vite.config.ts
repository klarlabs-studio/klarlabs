import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const componentsDir = resolve(__dirname, 'src/components');
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map((f) => [`components/${f.replace(/\.ts$/, '')}`, resolve(componentsDir, f)]),
);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id === 'lit' || id.startsWith('lit/') || id.startsWith('d3-') || id === 'zod',
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.ts'],
  },
});
