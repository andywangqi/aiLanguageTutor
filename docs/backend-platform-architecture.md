# AI Language Tutor 后端、后台与接口设计

**版本：** V1.0  
**日期：** 2026-08-24  
**适用范围：** 当前 Next.js 前端、Supabase、Supabase Google 登录、Waffo 支付，以及后续 AI / STT / TTS 服务接入。

这份文档不是把前端页面重新描述一遍，而是把当前产品页面映射成可以开发、测试、运营和扩展的后端系统。

---

## 1. 技术结论

### 1.1 推荐架构

```text
Next.js Web
  ├─ Supabase Browser Client
  │    └─ Google OAuth
  ├─ Next.js Route Handlers / Server Actions
  │    ├─ 用户与业务权限
  │    ├─ 对话编排
  │    ├─ AI Gateway
  │    ├─ Waffo Checkout
  │    └─ Waffo Webhook
  └─ Supabase
       ├─ Auth
       ├─ Postgres
       ├─ Storage
       └─ Realtime（后续需要时再启用）

Waffo
  ├─ 一次性支付
  ├─ 月付订阅
  ├─ 年付订阅
  └─ Webhook
```

### 1.2 责任边界

| 模块 | 负责内容 | 不应该负责 |
| --- | --- | --- |
| Next.js 前端 | 页面、交互、录音、展示状态 | 保存支付密钥、决定付费成功 |
| Supabase Auth | Google OAuth、session、refresh token | 产品订阅、学习进度、登录业务审计 |
| Supabase Postgres | 用户资料、对话、消息、卡片、订阅镜像、用量 | 直接调用 Waffo |
| Next.js 服务端 | 鉴权、业务规则、AI 编排、计费状态读取 | 把 service role key 发到浏览器 |
| Waffo | 创建支付、扣款、订阅周期、支付通知 | 维护我们的学习权益 |
| 后台 | 运营查询、用户支持、支付对账、风控 | 直接修改原始支付事件 |

### 1.3 三个必须坚持的原则

1. **Supabase Auth 不是业务用户表。** `auth.users` 只负责身份认证；产品自己的用户资料必须写入 `public.profiles`。
2. **浏览器支付成功页不是支付事实来源。** Waffo webhook 是支付和订阅最终状态来源，前端只显示 `pending / active / failed`。
3. **所有外部事件必须可重放、可幂等。** Google 登录回调、Waffo webhook、AI 回调都要保存原始事件和处理状态。

---

## 2. 当前前端功能对应的后端领域

| 当前前端功能 | 后端领域 | 主要数据 |
| --- | --- | --- |
| 登录弹窗、Google 登录 | Auth | `auth.users`、`profiles`、`user_identities`、`auth_login_events` |
| 首次选择语言 | Onboarding | `user_language_settings` |
| Say It / Translate | Conversation | `conversations`、`messages`、`message_outputs` |
| Talk / Conversation | Conversation | `conversations`、`messages`、`tutor_turns` |
| 长按语音、松开发送 | Voice | `voice_inputs`、`messages`、`ai_runs` |
| Listen / Slow | Audio | `audio_assets`、`message_outputs` |
| Translate / Grammar | Learning insight | `message_insights` |
| Save learning card | Review | `learning_cards` |
| Chat history | History | `conversations` |
| Saved cards | Review | `learning_cards` |
| Partners / Clara Ruiz | Tutor partner | `tutor_partners`、`user_partner_settings` |
| Free / Pro / Pro Annual | Billing | `plans`、`subscriptions`、`orders`、`entitlements` |
| 后台运营 | Admin | `admin_members`、`audit_logs`、`support_cases` |

当前前端中的静态数据，例如 `Clara Ruiz`、语言列表、价格、对话回复，只能作为 UI fallback。正式接入后要改成 API 数据。

---

## 3. Supabase Google 登录设计

### 3.1 登录方式

前端使用 Supabase Google OAuth：

```ts
const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback?next=/app`
  }
});
```

服务端回调：

```text
GET /auth/callback?code=...&next=/app
  1. 用 code exchange session
  2. 读取 supabase.auth.getUser()
  3. upsert public.profiles
  4. upsert public.user_identities
  5. 写入 public.auth_login_events
  6. redirect 到 /app
```

`next` 只允许站内路径，例如 `/app`、`/pricing`，不能直接信任任意外部 URL。

### 3.2 登录数据必须保存到自有表

登录成功后至少保存：

- `auth.users.id`：Supabase 用户主键
- Google provider subject：写入 `user_identities.provider_subject`
- email 快照
- display name
- avatar URL
- 首次登录时间
- 最近登录时间
- 最近登录 provider
- 登录成功 / 失败事件
- user agent
- IP 哈希，而不是明文 IP

不要保存：

- Google access token
- Google refresh token
- Supabase refresh token
- OAuth client secret
- 原始密码

Supabase 的 session/token 仍由 Supabase Auth 管理。我们的表保存的是产品所需的用户资料和审计记录。

### 3.3 触发器与回调的分工

建议同时使用数据库触发器和 OAuth callback：

- `auth.users` 新用户触发器：只创建最小 `profiles` 记录。
- `/auth/callback`：补齐 Google provider 信息、登录事件、默认语言设置。
- 后续每次 session 恢复：只更新 `profiles.last_seen_at`，不要每次刷新都创建登录事件。

最小触发器示例：

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

生产环境需要在 Supabase migration 中维护这个函数和 trigger，不要只在控制台手动创建。

---

## 4. 数据库表设计

下面是 V1 的核心表。字段命名使用 `snake_case`，所有业务表统一使用 UUID，时间统一使用 `timestamptz`。

### 4.1 通用约定

所有用户业务表建议包含：

```sql
id uuid primary key default gen_random_uuid(),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

所有属于用户的表都必须有：

```sql
user_id uuid not null references public.profiles(id) on delete cascade
```

### 4.2 用户与登录

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  plan_code text not null default 'free',
  onboarding_completed boolean not null default false,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_subject text not null,
  email_snapshot text,
  provider_metadata jsonb not null default '{}'::jsonb,
  first_login_at timestamptz not null default now(),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subject)
);

create table public.auth_login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  provider text not null,
  event_type text not null check (event_type in ('login_success', 'login_failure', 'logout')),
  email_snapshot text,
  ip_hash text,
  user_agent text,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

### 4.3 语言、伙伴与设置

```sql
create table public.tutor_partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  gender text,
  location text,
  personality text,
  avatar_url text,
  supported_modes text[] not null default array['say_it', 'talk'],
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_language_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  native_language_code text not null default 'zh-CN',
  learning_language_code text not null default 'en',
  level_code text not null default 'auto',
  selected_partner_id uuid references public.tutor_partners(id) on delete set null,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_partner_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.tutor_partners(id),
  tone text,
  correction_level text not null default 'balanced',
  speech_rate numeric(4,2) not null default 1.00,
  custom_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 4.4 对话、消息与 AI 结果

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid references public.tutor_partners(id) on delete set null,
  mode text not null check (mode in ('say_it', 'talk')),
  native_language_code text not null,
  learning_language_code text not null,
  level_code text,
  status text not null default 'active'
    check (status in ('active', 'completed', 'abandoned', 'blocked')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  input_word_count integer not null default 0,
  message_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'tutor', 'system')),
  input_type text not null default 'text'
    check (input_type in ('text', 'voice')),
  source_language_code text,
  target_language_code text,
  content text not null,
  sequence_no integer not null,
  client_message_id text,
  created_at timestamptz not null default now(),
  unique (conversation_id, sequence_no),
  unique (user_id, client_message_id)
);

create table public.message_outputs (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  output_type text not null
    check (output_type in ('translation', 'grammar', 'natural_expression', 'pronunciation', 'reply')),
  content jsonb not null default '{}'::jsonb,
  model_name text,
  created_at timestamptz not null default now(),
  unique (message_id, output_type)
);

create table public.voice_inputs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  storage_path text,
  mime_type text,
  duration_ms integer,
  transcript text,
  detected_language_code text,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'transcribing', 'completed', 'failed', 'deleted')),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  provider text not null,
  operation text not null
    check (operation in ('chat', 'translation', 'grammar', 'tts', 'stt', 'pronunciation')),
  model_name text,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed')),
  input_tokens integer,
  output_tokens integer,
  input_duration_ms integer,
  output_duration_ms integer,
  estimated_cost numeric(12,6),
  latency_ms integer,
  error_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
```

### 4.5 学习卡片与查询结果

```sql
create table public.learning_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_message_id uuid references public.messages(id) on delete set null,
  phrase text not null,
  meaning text,
  explanation text,
  language_code text not null,
  card_type text not null default 'phrase'
    check (card_type in ('word', 'phrase', 'grammar', 'pronunciation')),
  review_state text not null default 'new'
    check (review_state in ('new', 'learning', 'reviewing', 'mastered')),
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.message_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  input_text text not null,
  insight_mode text not null check (insight_mode in ('translate', 'grammar')),
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

### 4.6 计划、权益、订单与订阅

价格不能写死在 `PricingPage.tsx`。后台应能停用旧计划、创建新价格、设置展示顺序。

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  billing_type text not null
    check (billing_type in ('free', 'subscription', 'one_time')),
  interval text check (interval in ('month', 'year')),
  currency text not null default 'USD',
  amount numeric(10,2) not null default 0,
  waffo_product_id text,
  waffo_price_id text,
  feature_config jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  provider text not null default 'waffo',
  provider_subscription_id text unique,
  status text not null
    check (status in ('pending', 'active', 'past_due', 'cancelled', 'expired', 'failed')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  provider text not null default 'waffo',
  provider_order_id text unique,
  provider_checkout_id text,
  status text not null
    check (status in ('created', 'checkout_opened', 'pending', 'paid', 'failed', 'cancelled', 'refunded')),
  currency text not null,
  amount numeric(10,2) not null,
  checkout_url text,
  idempotency_key text not null unique,
  paid_at timestamptz,
  provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text,
  event_type text not null,
  signature_valid boolean not null default false,
  payload jsonb not null,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processing', 'processed', 'ignored', 'failed')),
  processing_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

create table public.usage_daily (
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null,
  conversation_seconds integer not null default 0,
  voice_seconds integer not null default 0,
  ai_messages integer not null default 0,
  input_words integer not null default 0,
  primary key (user_id, usage_date)
);
```

### 4.7 后台与审计

```sql
create table public.admin_members (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'support', 'finance', 'content')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  request_id text,
  created_at timestamptz not null default now()
);

create table public.support_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  category text not null default 'general',
  subject text not null,
  description text not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. RLS 与权限模型

### 5.1 用户数据

普通用户只能访问自己的数据：

```sql
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.learning_cards enable row level security;
alter table public.subscriptions enable row level security;

create policy "users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "users can read own conversations"
on public.conversations for select
to authenticated
using (user_id = auth.uid());

create policy "users can read own messages"
on public.messages for select
to authenticated
using (user_id = auth.uid());

create policy "users can read own cards"
on public.learning_cards for select
to authenticated
using (user_id = auth.uid());
```

### 5.2 重要安全规则

- 浏览器只能使用 Supabase anon/publishable key。
- Supabase service role key 只能在 Next.js server、Edge Function 或受保护的 worker 中使用。
- Waffo secret、Google client secret、AI provider key 不允许进入 `NEXT_PUBLIC_*`。
- 后台接口不能只根据前端传来的 `role` 判断权限，必须从 `admin_members` 服务端查询。
- 用户不能直接写 `subscriptions.status`、`orders.status`、`payment_events`。
- 付费权益由服务端根据订阅镜像和用量计算，不能由浏览器传 `plan=pro` 直接解锁。
- webhook 只允许写入 `payment_events`，业务状态更新必须经过幂等处理函数。

### 5.3 后台权限

| 角色 | 用户 | 对话 | 支付 | 内容 | 系统 |
| --- | --- | --- | --- | --- | --- |
| owner | 读写 | 读写 | 读写 | 读写 | 读写 |
| admin | 读写 | 读写 | 查看 | 读写 | 查看 |
| support | 查看、备注 | 查看 | 查看有限信息 | 查看 | 无 |
| finance | 查看 | 无 | 读写退款/对账 | 无 | 查看 |
| content | 无 | 无 | 无 | 读写伙伴/提示词 | 无 |

---

## 6. API 约定

### 6.1 基础约定

```text
Base URL: /api
Content-Type: application/json
鉴权：Supabase session cookie
```

统一成功响应：

```json
{
  "data": {},
  "requestId": "req_..."
}
```

统一错误响应：

```json
{
  "error": {
    "code": "PLAN_LIMIT_REACHED",
    "message": "Your free conversation has ended.",
    "details": {}
  },
  "requestId": "req_..."
}
```

错误码至少统一为：

```text
UNAUTHENTICATED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
PLAN_LIMIT_REACHED
PAYMENT_REQUIRED
PAYMENT_PENDING
CONFLICT
RATE_LIMITED
AI_PROVIDER_ERROR
VOICE_NOT_SUPPORTED
INTERNAL_ERROR
```

### 6.2 Auth 与当前用户

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/auth/callback` | Google OAuth code 换 session |
| `GET` | `/api/me` | 返回 profile、语言设置、当前权益 |
| `PATCH` | `/api/me` | 修改昵称、时区等资料 |
| `GET` | `/api/me/settings` | 获取 native/learning/level/partner |
| `PUT` | `/api/me/settings` | 保存首次语言弹窗和后续设置 |
| `POST` | `/api/auth/sync` | 前端恢复 session 后同步 profile |
| `POST` | `/api/auth/logout` | 注销 session，并写 logout event |

`GET /api/me` 推荐响应：

```json
{
  "data": {
    "profile": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "Alex",
      "avatarUrl": null
    },
    "settings": {
      "nativeLanguage": "zh-CN",
      "learningLanguage": "en",
      "level": "auto",
      "partnerId": "uuid"
    },
    "entitlement": {
      "plan": "free",
      "status": "active",
      "conversationSecondsRemaining": 60,
      "canUseVoice": true
    }
  }
}
```

### 6.3 Workbench

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/workbench` | 一次返回首页工作台所需数据 |
| `GET` | `/api/partners` | 获取可用 AI tutor partners |
| `PATCH` | `/api/me/partner` | 更换或定制伙伴 |
| `POST` | `/api/conversations` | 创建新对话 |
| `GET` | `/api/conversations` | 对话历史列表 |
| `GET` | `/api/conversations/:id` | 对话详情与消息 |
| `POST` | `/api/conversations/:id/messages` | 发送文字消息 |
| `POST` | `/api/conversations/:id/end` | 结束对话并结算用量 |
| `POST` | `/api/conversations/:id/reset` | New conversation |

创建对话：

```json
{
  "mode": "say_it",
  "nativeLanguageCode": "zh-CN",
  "learningLanguageCode": "en",
  "levelCode": "auto",
  "partnerId": "uuid"
}
```

发送消息：

```json
{
  "clientMessageId": "client-uuid",
  "inputType": "text",
  "content": "我明天可能会迟到。",
  "sourceLanguageCode": "zh-CN"
}
```

服务端处理顺序：

```text
1. 校验 session
2. 校验 conversation 属于当前 user
3. 校验用户是否仍有使用权益
4. 写入 user message
5. 调用 AI Gateway
6. 写入 tutor message
7. 写入 translation / grammar / natural_expression
8. 更新 usage_daily
9. 返回本轮完整结果
```

### 6.4 语音输入

当前前端用浏览器 `SpeechRecognition` 做 demo。生产版本建议保留两个层级：

**MVP：**

```text
浏览器 SpeechRecognition
  -> transcript
  -> POST /api/conversations/:id/messages
```

**生产语音版本：**

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/voice/upload-url` | 获取 Supabase Storage signed upload URL |
| `POST` | `/api/voice/inputs` | 创建 voice input 记录 |
| `POST` | `/api/voice/inputs/:id/transcribe` | 启动 STT |
| `GET` | `/api/voice/inputs/:id` | 查询转写状态 |
| `POST` | `/api/conversations/:id/messages/from-voice` | 将 transcript 作为消息发送 |

长按语音的前端状态：

```text
pointerdown -> recording
pointermove -> recording + waveform
pointerup   -> upload / transcribe / send
pointercancel -> discard
```

不要把一段未经确认的语音永久保存为公开 Storage 文件。Storage bucket 必须 private，读取使用短时 signed URL。

### 6.5 Translate / Grammar / Listen / Save card

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/messages/:id/translate` | 生成翻译 |
| `POST` | `/api/messages/:id/grammar` | 生成语法解释 |
| `POST` | `/api/messages/:id/natural-expression` | 生成更自然表达 |
| `POST` | `/api/messages/:id/audio` | 生成或获取 TTS |
| `POST` | `/api/messages/:id/cards` | 保存学习卡片 |
| `GET` | `/api/cards` | Saved cards 列表 |
| `PATCH` | `/api/cards/:id` | 更新 review 状态 |
| `DELETE` | `/api/cards/:id` | 删除卡片 |

重复点击时必须使用 idempotency key，避免同一条消息创建多张相同学习卡。

### 6.6 Pricing 与 Waffo 支付

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/billing/plans` | 返回当前公开计划 |
| `GET` | `/api/billing/me` | 当前订单、订阅、权益 |
| `POST` | `/api/billing/checkout` | 创建本地订单并创建 Waffo checkout |
| `GET` | `/api/billing/orders/:id` | 查询订单状态 |
| `POST` | `/api/billing/subscriptions/:id/cancel` | 设置周期结束取消 |
| `POST` | `/api/webhooks/waffo` | 接收 Waffo webhook |

创建 checkout 请求：

```json
{
  "planCode": "pro_monthly",
  "successPath": "/app?payment=success",
  "cancelPath": "/pricing?payment=cancelled"
}
```

服务端处理：

```text
1. 根据 planCode 从 plans 查询金额，不信任前端 amount
2. 创建 orders(status=created, idempotency_key=...)
3. 调用 Waffo API
4. 保存 Waffo order / checkout / subscription id
5. 更新 orders.status=checkout_opened
6. 返回 checkoutUrl
```

### 6.7 Waffo 接入要求

Waffo 相关密钥只能放服务端：

```env
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_API_VERSION=1.0.0
WAFFO_WEBHOOK_PUBLIC_KEY=
```

根据 Waffo 官方开发文档，服务端请求需要按其 API 版本和签名要求发送认证信息；Waffo 的 webhook 需要在接收时校验签名。具体字段、签名原文、接口路径和测试环境参数以当前 Waffo 账户后台及官方 API reference 为准，不要把猜测的字段直接写进生产代码。

Webhook 处理必须是：

```text
POST /api/webhooks/waffo
  1. 读取 raw body
  2. 验证 signature
  3. 解析 provider event id
  4. insert payment_events
  5. 若 event 已处理，直接返回 200
  6. 根据 event type 更新 orders / subscriptions
  7. 重新计算用户 entitlement
  8. 写 audit_logs
  9. 返回 200
```

不要根据 `?payment=success` 直接把用户改成 Pro。浏览器回跳只能触发状态刷新：

```text
GET /api/billing/me
```

最终以已经验签、已处理的 Waffo webhook 为准。

---

## 7. 订阅和权益模型

### 7.1 计划建议

| code | 展示名 | 类型 | 权益 |
| --- | --- | --- | --- |
| `free` | Free | free | 首次 1 分钟完整体验 |
| `pro_monthly` | Pro | subscription/month | 无限练习，按月扣款 |
| `pro_annual` | Pro Annual | subscription/year | 年付优惠 |
| `lifetime` | Lifetime | one_time | 后续测试，不作为当前主推 |

### 7.2 权益计算

不要只依赖 `profiles.plan_code`。它可以作为缓存，但实际权益由以下数据计算：

```text
active subscription
  + current_period_end > now()
  + order paid
  + plan feature_config
  + usage_daily
```

建议服务端提供一个统一函数：

```ts
type Entitlement = {
  planCode: "free" | "pro_monthly" | "pro_annual" | "lifetime";
  status: "active" | "pending" | "past_due" | "expired";
  canStartConversation: boolean;
  canUseVoice: boolean;
  canUseTts: boolean;
  conversationSecondsRemaining: number | null;
};
```

### 7.3 Free 方案

当前产品文案是“一次 1-minute free trial”。实现上建议：

```text
free_trial_seconds = 60
free_trial_started_at
free_trial_consumed_seconds
free_trial_completed_at
```

如果业务以后改成每天 5 分钟，只调整 `feature_config` 和权益计算，不改前端逻辑。

---

## 8. 后台管理系统设计

后台建议独立路由：

```text
/admin
/admin/users
/admin/users/:id
/admin/conversations
/admin/subscriptions
/admin/orders
/admin/payment-events
/admin/usage
/admin/partners
/admin/plans
/admin/support
/admin/audit-logs
/admin/settings
```

### 8.1 Dashboard

第一版显示：

- 注册用户数
- 今日活跃用户
- 今日新登录数
- 今日对话数
- 今日 AI 消息数
- 语音使用时长
- Free -> Pro 转化率
- 月收入 / 年收入
- Waffo pending / failed webhook 数
- AI provider error 数
- 平均每个用户 AI 成本

### 8.2 用户管理

用户列表支持：

- email、昵称、注册时间、最近登录
- 当前 plan 和 subscription status
- native language / learning language
- 总对话数、最近对话时间
- voice 使用时长
- 搜索、分页、导出

用户详情支持：

- profile
- 登录事件
- 语言设置
- 对话历史
- saved cards
- 订单 / 订阅
- 支持工单
- 管理员备注

客服管理员默认只能查看，不允许直接修改支付状态。

### 8.3 支付管理

订单页：

- local order id
- Waffo order id
- 用户
- plan
- amount / currency
- order status
- created / paid time
- checkout id

订阅页：

- Waffo subscription id
- current period
- cancel at period end
- last webhook time
- 原始 provider payload

支付事件页：

- event type
- provider event id
- signature valid
- processing status
- retry
- processing error
- received / processed time

管理员不能删除 payment_events，只能标记 `ignored` 或重新处理。原始支付数据必须保留用于对账。

### 8.4 Content / Tutor Partner

后台可以维护：

- partner name
- gender / location / personality
- avatar
- supported modes
- supported language
- correction style
- speech rate
- system prompt version
- enabled / disabled

系统 prompt 不应该散落在前端组件里。存储时建议区分：

```text
tutor_partners
tutor_prompt_versions
tutor_prompt_assignments
```

每次 AI 调用都把 prompt version 写入 `ai_runs.metadata`，便于回溯。

---

## 9. Next.js 项目接入改造清单

### 9.1 登录页

当前 `components/app/LoginPage.tsx` 的 Google 按钮只是跳到 `/app`，生产接入要替换为：

```ts
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${location.origin}/auth/callback?next=/app`
  }
});
```

需要新增：

```text
lib/supabase/browser.ts
lib/supabase/server.ts
middleware.ts
app/auth/callback/route.ts
app/api/auth/sync/route.ts
```

### 9.2 Workbench

当前 `WorkbenchPage.tsx` 中以下内容是本地 state，生产要改成 API：

- `messages`
- `nativeLanguage`
- `learningLanguage`
- `level`
- `mode`
- `selectedPhrase`
- partner
- conversation stats
- saved card
- voice transcript

建议使用：

```text
GET  /api/workbench
POST /api/conversations
POST /api/conversations/:id/messages
POST /api/conversations/:id/messages/from-voice
POST /api/messages/:id/cards
```

### 9.3 Pricing

当前 `PricingPage.tsx` 中的价格和 features 是静态常量。改为：

```text
GET /api/billing/plans
```

前端只负责：

1. 展示后端公开计划。
2. 点击 CTA 调 `POST /api/billing/checkout`。
3. 跳到 Waffo checkoutUrl。
4. 回到站内后重新请求 `/api/billing/me`。

### 9.4 登录数据同步

`/api/auth/sync` 必须做 upsert：

```text
profiles
user_identities
user_language_settings
auth_login_events
```

以 `auth.users.id` 为唯一关联，不要用 email 作为业务主键。

---

## 10. 环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
# Google Client ID / Secret 应配置在 Supabase Dashboard OAuth Provider，
# 这里不需要把 secret 暴露给 Next.js 前端。

# Waffo
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_API_VERSION=1.0.0
WAFFO_WEBHOOK_PUBLIC_KEY=

# AI Gateway
AI_PROVIDER=
AI_API_KEY=
AI_CHAT_MODEL=
AI_STT_MODEL=
AI_TTS_MODEL=

# App
NEXT_PUBLIC_SITE_URL=
APP_ENCRYPTION_KEY=
```

`.env.local` 不能提交 Git。生产环境还要为 webhook、AI provider、service role key 做单独 secret rotation。

---

## 11. API 实现建议

### 11.1 目录结构

```text
app/
  api/
    auth/
      sync/route.ts
      logout/route.ts
    me/route.ts
    workbench/route.ts
    conversations/
      route.ts
      [id]/
        route.ts
        messages/route.ts
        end/route.ts
    messages/
      [id]/
        translate/route.ts
        grammar/route.ts
        audio/route.ts
        cards/route.ts
    billing/
      plans/route.ts
      checkout/route.ts
      me/route.ts
    webhooks/
      waffo/route.ts
    admin/
      overview/route.ts
      users/route.ts
      orders/route.ts
      subscriptions/route.ts
      payment-events/route.ts
      audit-logs/route.ts
  auth/
    callback/route.ts

lib/
  supabase/
    browser.ts
    server.ts
    admin.ts
  auth/
    require-user.ts
    require-admin.ts
  billing/
    entitlement.ts
    waffo-client.ts
    waffo-webhook.ts
  ai/
    gateway.ts
  conversations/
    service.ts
  voice/
    service.ts
  validation/
    schemas.ts
```

### 11.2 服务端 handler 规范

每个 handler 按这个顺序：

```text
1. 生成 requestId
2. 读取 session
3. 验证 role / ownership
4. 验证 JSON schema
5. 执行业务 service
6. 写审计或用量
7. 返回统一 envelope
8. 记录错误但不把 secret / provider raw token 返回前端
```

### 11.3 幂等

必须幂等的接口：

- `POST /api/auth/sync`
- `POST /api/conversations/:id/messages`
- `POST /api/messages/:id/cards`
- `POST /api/billing/checkout`
- `POST /api/webhooks/waffo`

策略：

```text
客户端请求：Idempotency-Key
消息：user_id + client_message_id
订单：user_id + idempotency_key
支付事件：provider + provider_event_id
学习卡：user_id + source_message_id + phrase hash
```

---

## 12. 观察、成本与风控

### 12.1 AI 成本

每次 AI、STT、TTS 调用必须落 `ai_runs`：

- provider
- model
- operation
- input/output tokens
- audio duration
- latency
- estimated cost
- error code

后台可以按：

- 用户
- plan
- 日期
- 模型
- operation

查看真实成本，避免无限 Pro 用户造成成本失控。

### 12.2 限流

初始建议：

```text
未登录：IP + route
已登录：user_id + route
AI 对话：user_id + minute
语音上传：user_id + minute + byte limit
Waffo webhook：provider event id
后台：admin user_id + route
```

### 12.3 需要告警的情况

- Waffo webhook 验签失败
- 同一 webhook 重复大量到达
- paid order 没有对应 subscription
- subscription active 但没有 paid order
- AI provider error rate 超过阈值
- 单用户短时间异常消耗
- voice 文件大小或时长异常
- service role key 或 Waffo secret 可能泄露

---

## 13. 开发顺序

### Phase 1：身份和基础数据

1. 建 Supabase project。
2. 配 Google OAuth redirect。
3. 创建 `profiles`、`user_identities`、`auth_login_events`。
4. 建 `user_language_settings` 和 `tutor_partners`。
5. 加 RLS 和 callback。
6. 将登录弹窗接成真实 Google 登录。

### Phase 2：对话闭环

1. 创建 conversations/messages。
2. 接 `GET /api/workbench`。
3. 接文字消息。
4. 保存对话历史。
5. 接 Translate / Grammar。
6. 接 learning cards。

### Phase 3：语音

1. 先保留浏览器 SpeechRecognition。
2. 保存 transcript 为 `input_type=voice`。
3. 接 Storage private bucket。
4. 再接服务端 STT 和 TTS。
5. 记录 `voice_inputs` 和 `ai_runs`。

### Phase 4：支付

1. 在 `plans` 建 free / monthly / annual。
2. Waffo 配置 sandbox。
3. 完成订单创建和 checkout redirect。
4. 完成 webhook 验签和幂等。
5. 完成 entitlement。
6. 前端 pricing 改成 API 数据。
7. 生产环境做一笔真实小额测试和退款测试。

### Phase 5：后台

1. admin_members + require-admin。
2. dashboard。
3. users / conversations。
4. orders / subscriptions / payment-events。
5. partners / plans。
6. audit logs 和 support cases。

---

## 14. 上线前验收清单

### Auth

- Google 登录成功后 `auth.users`、`profiles`、`user_identities` 都有数据。
- 每次真正登录都有一条 `auth_login_events`。
- session 刷新不会重复制造登录事件。
- 注销后不能访问用户接口。
- 删除 Supabase 用户会级联清理或按策略匿名化业务数据。

### Conversation

- 用户只能读自己的 conversations/messages/cards。
- 换浏览器刷新后对话仍然存在。
- 同一 `clientMessageId` 重试不会产生两条消息。
- Free 用户超过限制时服务端返回 `PLAN_LIMIT_REACHED`。
- AI 错误不会把会话状态卡死。

### Voice

- 长按开始、松开发送、取消不发送。
- 没有麦克风权限时有清晰提示。
- 语音文件不是 public bucket。
- 音频和 transcript 可以按用户删除。

### Payment

- 前端不能伪造 Pro。
- checkout amount 从数据库计划读取。
- Waffo webhook 验签失败不会改变订单。
- 重放同一 webhook 不会重复开通权益。
- pending、failed、cancelled、expired 都有对应页面状态。
- 退款后权益会按产品规则收回或保留到周期结束。

### Admin

- support 角色不能改支付状态。
- 所有管理员修改都有 audit log。
- payment event 原文不可从前端删除。
- 用户详情不会泄露 OAuth token 或支付敏感信息。

---

## 15. 官方资料

- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Auth with Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Database Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
- [Waffo Developer Docs](https://waffo.com/docs/en/developer-docs/)

Waffo 的 API 字段、签名原文、webhook event payload 和测试环境参数，必须在接入时以 Waffo 当前官方 reference 和商户后台配置为准。文档里的 Waffo 部分已经固定了系统边界和数据模型，但不应把未经账户验证的字段名硬编码到生产环境。

