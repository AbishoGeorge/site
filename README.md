# Signal globe site

A one-page marketing site for an account-intelligence service. The hero is a live globe that flies between countries, drops a pin, and opens an evidence-backed account card for each one.

## Run it

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes a static site to `dist/`, which any static host (Vercel, Netlify, Cloudflare Pages) can serve.

### Deploying to Cloudflare Workers

`wrangler.jsonc` serves `dist/` as static assets on a Worker named `site`. With Workers Builds connected to this repo, use build command `npm run build`, deploy command `npx wrangler deploy` and root directory `/`. To check the config locally: `npm run build && npx wrangler deploy --dry-run`.

The Worker needs these in the Cloudflare dashboard (Workers & Pages → site → Settings → Variables and Secrets):

- `RESEND_API_KEY`: type **Secret**, your Resend API key.
- `CONTACT_TO_EMAIL`: type **Text**, where submissions go (several addresses can be comma-separated).
- `CONTACT_FROM_EMAIL`: type **Text**, the sender on a domain verified in Resend, for example `Databery <abisho@databery.com>`.

`keep_vars` in `wrangler.jsonc` stops deploys from removing the dashboard variables. For `npx wrangler dev`, copy `.dev.vars.example` to `.dev.vars` (it is gitignored).

## Make it yours

- **Brand name, tagline, email and demo link:** `src/brand.ts`. The Databery mark is drawn in `src/components/BerryMark.tsx` (used by `Logo.tsx`, and copied into `public/favicon.svg`); the 3D berry in Who we are is `src/components/BerryOrb.tsx`.
- **Accounts shown on the globe:** `src/components/globe/signals.ts`. The companies there are fictional examples. Each entry's `country` must match a name in `world-atlas/countries-110m.json`, and `zoom` sets how far the globe zooms in.
- **Globe timing and look:** constants at the top of `src/components/globe/GlobeEngine.ts`.
- **Forms (book a demo, plan my next event, unlock top accounts):** all three post JSON to `/api/contact`, which `worker/index.ts` validates (required fields, email and website format, length limits, a hidden honeypot field) and emails through Resend, with reply-to set to the visitor. The booking form takes the company website from the work email and asks for it only when someone uses a personal address. Set `demoUrl` in `src/brand.ts` to send every "Book a demo" button to a booking link (for example Calendly) instead of the on-site booking page.
- **The two service lines (right after the hero):** `src/components/Services.tsx`. Account intelligence links to the "See my top accounts" flow; event intelligence links to the booking page set up for events (`#book-demo-event`, or `demoUrl` if set).
- **Event use cases:** `src/content/events.ts`, in the same format as the account use cases. The Use cases section switches between the two services, and each story opens at `#use-case-<id>`; `src/content/stories.ts` puts both lists together.
- **Industries and use cases:** `src/content/industries.ts`. One entry per industry (nine, including ERP testing) feeds both the "Different markets send different signals" explorer under the hero and the "See how it works in your market" strip, and gives each industry its own use case page (`#use-case-<id>`). Each entry holds what we watch in that market and who we help you reach, plus a `useCase`: one company described by what it sells, its specific problem, how we solve it, the signals used and the outcome. There are no client names or results figures; add real ones only once customers approve them. Icons and accent colors are in `src/components/usecases/industryStyle.ts`, the generated artwork in `src/components/usecases/IndustryArt.tsx`, and the icon for each signal is picked in `src/components/signalIcon.ts`.
- **Who we are:** `src/components/About.tsx`. The copy describes the product's approach; add your own story (when and why you started, the team, where you work).
- **Accounts in the "This is what your active targets look like" carousel:** `src/components/LiveAccounts.tsx`. They show the format of an account brief; the companies and people are invented, and the caption says the names are illustrative.
- **"See my top accounts" flow:** `src/components/accounts/`. The scan steps are in `AccountsFlow.tsx` and the locked preview rows in `ResultsStep.tsx`. Both pages open from the URL hash (`#top-accounts`, `#book-demo`), so any link can open them and the browser's Back button closes them.
- **Company logo on the scan screen:** loaded from Google's public favicon service using the website the visitor typed, with a lettered tile as fallback.
