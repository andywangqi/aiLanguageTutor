# AI Language Tutor API V2 Integration

This project integrates the AI Language Tutor V2 contract with a same-origin
Next.js API proxy. The browser never receives a central `serverKey`.

## 1. Environment

Copy `.env.example` to `.env.local` and fill the values in the deployment
environment:

```env
NEXT_PUBLIC_SITE_URL=https://ailanguagetutor.online
NEXT_PUBLIC_ZHYADMIN_ENDPOINT=https://zhyadmin.vercel.app
NEXT_PUBLIC_ZHYADMIN_WRITE_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Route product calls through the documented zhyadmin API.
PRODUCT_API_BACKEND=central
```

The two Supabase public variables are required for real Google OAuth. The
central endpoint and write key enable central plan reads and browser event
tracking. The write key must belong to an active website registration in the
central console. Supabase service-role, OpenAI, and Waffo credentials belong
to `zhyadmin`; this website must not receive them.

The browser client only sends analytics when the current hostname matches the
configured production site URL (with an optional `www.` prefix). Localhost,
`127.0.0.1`, preview deployments, and other non-production hosts are ignored
so development traffic cannot inflate production visitor counts.

If `/api/track` returns `The requested website is not registered`, register the
website in the central console with the production URL first, then update the
Vercel environment variable with that registration's write key.

## 2. Google OAuth

The login button calls Supabase:

```text
supabase.auth.signInWithOAuth({ provider: "google" })
```

The redirect URI is:

```text
https://<site-origin>/auth/callback?next=/app
```

The callback exchanges the OAuth code for a Supabase session and writes the
session cookies with `@supabase/ssr`. After the browser has a session, the
workbench calls:

```text
POST /api/auth/sync
Authorization: Bearer <supabase-access-token>
```

The central service is responsible for upserting the site user, identity,
default settings, login event, and anonymous data merge.

## 3. Same-origin API proxy

`app/api/[...path]/route.ts` forwards only the documented product routes:

- auth sync and logout;
- profile, settings, partner, workbench, and partner list;
- conversations and messages;
- voice upload registration, transcription, and status polling;
- translation, grammar, natural-expression, audio, and learning cards;
- billing plans, checkout, order status, and subscription cancellation/resume;
- browser analytics tracking.

The proxy adds `siteUrl` as a query parameter and forwards:

```text
Authorization
Content-Type
X-Request-Id
Idempotency-Key
X-Site-Key (analytics only)
```

Admin endpoints and Waffo webhooks are intentionally not exposed through this
browser proxy.

## 4. Workbench flow

```text
GET /api/workbench
PUT /api/me/settings
POST /api/conversations
POST /api/conversations/:id/messages
GET /api/conversations/:id
```

The UI keeps a local practice preview when Supabase is not configured. Once a
valid Supabase session exists, the same controls use the central API and show
a recoverable notice if the central service is unavailable.

## 5. Voice flow

The workbench keeps the requested press-and-hold interaction:

```text
pointer down -> SpeechRecognition + MediaRecorder
pointer up   -> stop recognition and recorder
              -> POST /api/voice/upload-url
              -> direct PUT to the signed upload URL
              -> POST /api/voice/inputs
              -> POST /api/voice/inputs/:id/transcribe
              -> GET /api/voice/inputs/:id until succeeded
              -> POST /api/conversations/:id/messages/from-voice
```

Uploaded audio is limited to 10 MiB, and the API receives the normalized base
audio MIME type. If recording is unavailable but browser speech recognition
returns a transcript, the transcript can still reach the voice-message
endpoint without an uploaded audio object.

## 6. Billing and Waffo

The pricing page reads plans from:

```text
GET /api/billing/plans
```

Checkout submits only a plan code:

```json
{
  "planCode": "pro_monthly",
  "successPath": "/app",
  "cancelPath": "/pricing?payment=cancelled"
}
```

The frontend never submits an amount. It opens the returned checkout URL in a
new tab and never logs or persists it. On the success return, the workbench
polls `GET /api/billing/orders/:orderId`. It refreshes the entitlement and
records payment success only after the order becomes `paid`; the browser
return alone is not proof of payment.

## 7. Central server sync

`lib/central/server.ts` contains the server-only helpers:

- `registerCentralSite()`
- `syncCentralEntity()`
- `centralServerRequest()`

They use `X-Site-Secret` and `ZHYADMIN_SERVER_KEY`. They are intentionally not
imported into client components. Product conversation, user, billing, and
voice records should be written through the central product API to avoid
duplicating those records with a second client-side sync path.

## 8. Analytics

`lib/analytics/client.ts` creates stable anonymous and session identifiers in
browser storage and posts events to the same-origin `/api/track` proxy. The
proxy forwards the public write key as `X-Site-Key`; the event payload uses the
central analytics contract's `eventName` and `occurredAt` fields.

Tracked events include:

```text
app_opened
login_started
conversation_started
message_submitted
voice_recording_started
voice_transcribed
learning_card_saved
```

Analytics errors are deliberately ignored so tracking cannot interrupt a
learning action.

## 9. Verification

```bash
npm run typecheck
npm run build
```

Before production, configure the following external callbacks and providers:

1. Supabase Google provider and the `/auth/callback` redirect URI.
2. Supabase database/storage policies required by the central API.
3. Central site registration for `ai_language_tutor`.
4. Waffo merchant credentials and its official webhook signature contract.
