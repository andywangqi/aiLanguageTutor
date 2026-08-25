# AI Language Tutor

SEO-first, multilingual Next.js landing page for an AI speaking tutor.

## Run locally

```bash
npm install
npm run dev
```

The default English page is available at `http://127.0.0.1:3000/`.

## Routes

- `/` English
- `/ja` Japanese
- `/th` Thai
- `/ko` Korean
- `/zh-CN` Simplified Chinese
- `/zh-TW` Traditional Chinese
- `/es` Spanish

## Reusable structure

- `lib/i18n/config.ts`: locale list, labels, URL helpers, and hreflang values.
- `lib/i18n/dictionaries.ts`: all landing copy in one typed dictionary.
- `lib/seo/metadata.ts`: reusable title, description, canonical, Open Graph, robots, FAQ schema, and SoftwareApplication schema.
- `components/landing`: reusable landing sections and product demo.
- `app/sitemap.ts` and `app/robots.ts`: generated technical SEO files.
- `screenshots/reference`: screenshots captured from the reference site for visual comparison.
- `screenshots/local`: screenshots captured from this implementation.

Set `NEXT_PUBLIC_SITE_URL` before deploying so canonical URLs, language alternates, sitemap, and JSON-LD point to the production domain. If the variable is missing or empty, the app safely falls back to `https://www.ailanguagetutor.com`; on Vercel, either remove an empty variable or set it to the real production URL.

## Verification

```bash
npm run lint
npm run build
```
