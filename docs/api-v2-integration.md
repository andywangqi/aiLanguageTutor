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

# Server only
ZHYADMIN_SERVER_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_WEBHOOK_PUBLIC_KEY=
```

The two Supabase public variables are required for real Google OAuth. The
central endpoint and write key enable central plan reads and browser event
tracking. The write key must belong to an active website registration in the
central console; the server key is only available to server modules.

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
- voice upload registration;
- translation, grammar, audio, and learning cards;
- billing plans, checkout, and subscription cancellation;
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
              -> POST /api/conversations/:id/messages/from-voice
```

If microphone recording is unavailable but browser speech recognition returns
a transcript, the transcript still reaches the voice-message endpoint without
an uploaded audio object.

## 6. Billing and Waffo

The pricing page reads plans from:

```text
GET /api/billing/plans
```

Checkout submits only a plan code:

```json
{
  "planCode": "pro_monthly",
  "successPath": "/app?payment=success",
  "cancelPath": "/pricing?payment=cancelled"
}
```

The frontend never submits an amount. Until the official Waffo merchant
checkout and webhook signing contract is configured in the central backend,
the UI reports that checkout is pending instead of sending an invented payment
payload.

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
