import type { MouseEvent } from 'react';

/** Inside the page, a use case opens as a panel from the URL hash, e.g. #use-case-cybersecurity. */
export const USE_CASE_HASH = /^use-case-(.+)$/;

/** Every use case also has its own page, which is what crawlers, search engines and shared links use. */
export const USE_CASE_PATH = /^\/use-cases\/([^/]+)\/?$/;
export const pathToUseCase = (id: string) => `/use-cases/${id}/`;

/**
 * Click handler for links to a use case page: a plain click opens the panel over the current page instead of
 * loading the page, as before. New-tab and other modified clicks still follow the real link.
 */
export function openUseCase(e: MouseEvent<HTMLAnchorElement>, id: string, replace = false) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (replace) window.location.replace(`#use-case-${id}`);
  else window.location.hash = `use-case-${id}`;
}
