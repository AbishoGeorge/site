import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Built pages arrive with their HTML already in place (see scripts/prerender.mjs), so React takes it over rather
// than drawing it again. The dev server sends an empty root and React draws the page as before.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
