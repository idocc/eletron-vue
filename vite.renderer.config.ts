import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue';
import { title } from './src/config/config';

// Vite 配置文档：https://vitejs.dev/config
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'inject-app-title',
      transformIndexHtml(html) {
        return html.replace('%APP_TITLE%', title);
      },
    },
  ],
   resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
