# AI Language Tutor

AI Language Tutor is a web-based AI speaking tutor for practicing languages through real conversations.

🌐 **Website:** https://ailanguagetutor.online/

Practice speaking, understand unfamiliar expressions, and continue conversations with an AI language tutor.

## Features

- AI-powered speaking practice
- Multilingual landing pages
- Real conversation-based language learning
- Translation and language assistance
- Pronunciation and speaking practice
- SEO-friendly multilingual architecture

## Run locally

```bash
npm install
npm run dev

The default English page is available at http://127.0.0.1:3000/.

Routes
/ English
/ja Japanese
/th Thai
/ko Korean
/zh-CN Simplified Chinese
/zh-TW Traditional Chinese
/es Spanish
Reusable structure
lib/i18n/config.ts: locale list, labels, URL helpers, and hreflang values.
lib/i18n/dictionaries.ts: all landing copy in one typed dictionary.
lib/seo/metadata.ts: reusable title, description, canonical, Open Graph, robots, FAQ schema, and SoftwareApplication schema.
docs/api-spec.md: frontend/backend interface contract for Supabase, Waffo, conversations, voice, and admin.
lib/api/client.ts: browser-safe client for the V2 product API.
app/api/[...path]/route.ts: allowlisted same-origin proxy to the central backend.
app/auth/callback/route.ts: Supabase Google OAuth code exchange and session cookie handoff.
lib/central/server.ts: server-only central sync helper; never import it into client components.
components/landing: reusable landing sections and product demo.
app/sitemap.ts and app/robots.ts: generated technical SEO files.
screenshots/reference: screenshots captured from the reference site for visual comparison.
screenshots/local: screenshots captured from this implementation.

Set NEXT_PUBLIC_SITE_URL before deploying so canonical URLs, language alternates, sitemap, and JSON-LD point to the production domain. If the variable is missing or empty, the app safely falls back to https://ailanguagetutor.online; on Vercel, either remove an empty variable or set it to the real production URL.

For API integration, copy .env.example to .env.local and configure the Supabase values plus the public central endpoint and write key. Keep Supabase service-role, OpenAI, and Waffo credentials on the central zhyadmin backend. The browser calls the same-origin /api/* proxy, which forwards only documented product routes with siteUrl, bearer token, request ID, and checkout idempotency key. Payment buttons submit only planCode; the workbench confirms the returned orderId before treating a checkout return as paid.

Verification
npm run lint
npm run build
