import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** The dev server has no build step to fill in each page's head, so it gets the home page's title. */
const devHead = (): Plugin => ({
  name: 'dev-head',
  apply: 'serve',
  transformIndexHtml: (html) => html.replace('<!--app-head-->', "<title>Databery | Know who's ready to buy</title>"),
});

export default defineConfig({
  plugins: [react(), devHead()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // The build renders every page to HTML in Node (scripts/prerender.mjs); bundling the dependencies into that
  // render keeps it independent of how each package ships for Node.
  ssr: { noExternal: true },
});
