// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://klarlabs.de',
  vite: {
    // Lit + @klarlabs-studio/ui resolve from the workspace
    ssr: {
      noExternal: ['@klarlabs-studio/ui'],
    },
  },
});
