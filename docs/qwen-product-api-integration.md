# Qwen Product API Integration

This project now has a local product API layer for the AI Language Tutor core experience. The browser still calls same-origin `/api/*`; the route decides whether to handle the request locally or forward it to the central backend.

## What Is Implemented

- Qwen chat adapter: `lib/ai/qwen.ts`
- Tutor prompt layer for `Say It` and `Talk`: `lib/ai/tutor.ts`
- Local product API handler: `lib/api/local-product.ts`
- Supabase service client for server-side writes: `lib/supabase/server.ts`
- Catch-all route integration: `app/api/[...path]/route.ts`

## Runtime Mode

Use local mode when this website should own the tutor workflow and call Qwen directly:

```env
PRODUCT_API_BACKEND=local
```

Use central mode when all product routes should be forwarded to the central backend:

```env
PRODUCT_API_BACKEND=central
```

If `PRODUCT_API_BACKEND` is not set, only AI-related routes are handled locally when a Qwen API key exists. Other routes continue to forward to the central backend.

## Qwen Variables Needed From You

```env
QWEN_API_KEY=
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

`DASHSCOPE_API_KEY`, `DASHSCOPE_MODEL`, and `DASHSCOPE_BASE_URL` are also accepted as aliases, but the project standard should be the `QWEN_*` names.

## Supabase Variables Needed From You

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_VOICE_BUCKET=voice-inputs
```

Supabase Auth handles Google sign-in in the browser. The server uses `SUPABASE_SERVICE_ROLE_KEY` to upsert product-owned rows into:

- `profiles`
- `user_identities`
- `auth_login_events`
- `user_language_settings`
- `conversations`
- `messages`
- `message_outputs`
- `voice_inputs`
- `learning_cards`

If Supabase is not configured, the API uses an in-memory fallback so development can continue, but this is not production persistence.

## Routes Currently Handled Locally

```text
POST /api/auth/sync
POST /api/auth/logout
GET  /api/me
PATCH /api/me
GET  /api/me/settings
PUT  /api/me/settings
PATCH /api/me/partner
GET  /api/workbench
GET  /api/partners
POST /api/conversations
GET  /api/conversations
GET  /api/conversations/:id
POST /api/conversations/:id/messages
POST /api/conversations/:id/messages/from-voice
POST /api/conversations/:id/reset
POST /api/conversations/:id/end
POST /api/messages/:id/translate
POST /api/messages/:id/grammar
POST /api/messages/:id/audio
POST /api/messages/:id/cards
GET  /api/cards
PATCH /api/cards/:id
DELETE /api/cards/:id
POST /api/voice/upload-url
POST /api/voice/inputs
GET  /api/billing/plans
GET  /api/billing/me
POST /api/billing/checkout
```

## Current AI Behavior

`Say It` mode:

- User can type or speak in their native language.
- Qwen understands the meaning.
- The tutor replies with a natural target-language expression first.
- The tutor keeps the explanation short so the learner can practice speaking.

`Talk` mode:

- User speaks or types in the target language.
- Qwen continues the conversation in the target language.
- Corrections are brief and embedded naturally.

Learning actions:

- `translate` uses Qwen to produce learner-friendly translation output.
- `grammar` uses Qwen to explain the selected phrase.
- `audio` currently returns a reserved browser-speech response until a production TTS provider is chosen.
- `cards` saves the selected tutor phrase to `learning_cards` when Supabase is configured.

## Central Data Backend

Browser analytics still use the public write key through `/api/track`. Server-side product sync uses `ZHYADMIN_SERVER_KEY` when present. Central sync is best effort and will not block the tutor experience.

Required central variables:

```env
NEXT_PUBLIC_ZHYADMIN_ENDPOINT=https://zhyadmin.vercel.app
NEXT_PUBLIC_ZHYADMIN_WRITE_KEY=
ZHYADMIN_SERVER_KEY=
```

## Waffo Status

`GET /api/billing/plans` returns the current local product plans. `POST /api/billing/checkout` returns `PAYMENT_PENDING` until the final Waffo merchant API base URL, checkout contract, secret, and webhook signature rules are provided.

Needed later:

```env
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_WEBHOOK_PUBLIC_KEY=
```
