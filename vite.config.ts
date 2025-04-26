import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    port: 3000, // 將這裡的 3000 替換成你想要的 port 號碼
  },
});
