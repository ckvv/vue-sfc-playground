import { URL, fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePluginVueCode } from './plugins/vite-plugin-vue-code';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginVueCode(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
