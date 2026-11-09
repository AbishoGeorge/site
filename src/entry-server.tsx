import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** The page's HTML for one address, as the build writes it to dist. */
export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  );
}

export { pages, headTags, robotsTxt, sitemapXml, llmsTxt } from './seo';
