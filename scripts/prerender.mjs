// Writes every public page to dist as finished HTML, so search engines, AI tools and anything else that does not
// run JavaScript gets the full text. In the browser React takes over the same HTML (src/entry-client.tsx).
// Also writes robots.txt, sitemap.xml and llms.txt. Runs after `vite build` and `vite build --ssr`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, pages, headTags, robotsTxt, sitemapXml, llmsTxt } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);
const template = await readFile(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> or <!--app-html--> placeholder');
}

for (const page of pages) {
  const html = template.replace('<!--app-head-->', headTags(page)).replace('<!--app-html-->', render(page.path));
  const file = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`prerendered ${page.path}`);
}

// The homepage must be the finished page, not the empty app shell Vite writes first: stop the build otherwise, so a
// shell can never be deployed.
const home = await readFile(join(dist, 'index.html'), 'utf8');
const checks = {
  'canonical link': home.includes('<link rel="canonical" href="'),
  'og:image tag': home.includes('<meta property="og:image"'),
  'JSON-LD': home.includes('application/ld+json'),
  'one h1': (home.match(/<h1[ >]/g) || []).length === 1,
  'rendered body': !home.includes('<div id="root"></div>') && !home.includes('<!--app-html-->'),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) throw new Error(`dist/index.html is not the prerendered homepage (missing: ${failed.join(', ')})`);
console.log('checked dist/index.html: prerendered homepage');

await writeFile(join(dist, 'robots.txt'), robotsTxt());
await writeFile(join(dist, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)));
await writeFile(join(dist, 'llms.txt'), llmsTxt());
console.log('wrote robots.txt, sitemap.xml, llms.txt');

await rm(ssrDir, { recursive: true, force: true });
