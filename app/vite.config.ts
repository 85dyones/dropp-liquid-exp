import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// O app lê o sistema de design direto da pasta design/, sem cópia.
// /prototipos/ publica os protótipos navegáveis, lidos de design/prototipo-* (scripts/prototipos.mjs).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./index.html', import.meta.url)),
        prototipos: fileURLToPath(new URL('./prototipos/index.html', import.meta.url)),
        ver: fileURLToPath(new URL('./prototipos/ver.html', import.meta.url)),
        rodar: fileURLToPath(new URL('./prototipos/rodar.html', import.meta.url))
      }
    }
  },
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
