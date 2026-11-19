// Site público da DROPP Liquid Experience: espanhol na raiz, português em /pt/.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dropp-site.vercel.app',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'pt'],
    routing: { prefixDefaultLocale: false }
  },
  build: { format: 'directory' }
});
