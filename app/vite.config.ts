import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// O app lê o sistema de design direto da pasta design/, sem cópia.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': fileURLToPath(new URL('../design/sistema-de-design/project', import.meta.url))
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: { allow: ['..'] }
  }
});
