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
- **Forms (book a demo, unlock top accounts):** set `formEndpoint` in `src/brand.ts` to a form service URL that accepts a JSON POST (for example Formspree); each submission includes a `type` of `demo` or `top-accounts`. Until it is set, submitting opens the visitor's email app with their details, addressed to `email`. Set `demoUrl` to send every "Book a demo" button to a booking link (for example Calendly) instead of the on-site booking page.
- **Example accounts in the "Accounts showing buying signals right now" carousel:** `src/components/LiveAccounts.tsx`. They are invented companies and people.
- **"See my top accounts" flow:** `src/components/accounts/`. The scan steps are in `AccountsFlow.tsx` and the locked preview rows in `ResultsStep.tsx`. Both pages open from the URL hash (`#top-accounts`, `#book-demo`), so any link can open them and the browser's Back button closes them.
- **Company logo on the scan screen:** loaded from Google's public favicon service using the website the visitor typed, with a lettered tile as fallback.
