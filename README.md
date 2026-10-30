# Signal globe site

A one-page marketing site for an account-intelligence service. The hero is a live globe that flies between countries, drops a pin, and opens an evidence-backed account card for each one.

## Run it

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes a static site to `dist/`, which any static host (Vercel, Netlify, Cloudflare Pages) can serve.

## Make it yours

- **Brand name, email and demo link:** `src/brand.ts`. Also update the `<title>` and meta tags in `index.html`, and the logo in `src/components/Logo.tsx` and `public/favicon.svg`.
- **Accounts shown on the globe and the ticker:** `src/components/globe/signals.ts`. The companies there are fictional examples. Each entry's `country` must match a name in `world-atlas/countries-110m.json`, and `zoom` sets how far the globe zooms in.
- **Globe timing and look:** constants at the top of `src/components/globe/GlobeEngine.ts`.
