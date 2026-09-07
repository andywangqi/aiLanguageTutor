# AI Language Tutor 接口文档

**版本：** V1.0  
**日期：** 2026-08-26  
**适用范围：** 当前 Next.js 前端、Supabase 登录、Waffo 支付、本站业务接口、中央数据后台接口

这份文档是当前产品的正式接口契约。  
本项目采用“双层接口”模式：

- 前端直接走 Supabase Auth 登录
- 前端产品功能走本站 `/api/*`
- 浏览器埋点走中央数据后台 `writeKey`
- 本站服务端把业务数据同步到中央数据后台，并使用 `serverKey`
- 支付走 Waffo
- 数据落 Supabase Postgres
- 登录数据必须同步进我们自己的业务表

---

## 1. 技术约定

### 1.1 基础地址

```text
Web:              https://ailanguagetutor.online
Product API:      same-origin /api/*
Central Data API: https://zhyadmin.vercel.app
Site Type:        ai_language_tutor
Auth:             Supabase Auth + Google OAuth
Pay:              Waffo
DB:               Supabase Postgres
```

### 1.2 JSON 命名

- API JSON 使用 `camelCase`
- 数据库字段使用 `snake_case`
- 时间统一使用 ISO 8601 UTC
- ID 统一使用 UUID

### 1.3 本站业务接口请求头

```http
Content-Type: application/json
Authorization: Bearer <supabase_access_token>
X-Request-Id: <uuid>
Idempotency-Key: <uuid-or-stable-key>
```

### 1.4 中央数据后台请求头

浏览器埋点只允许使用 `writeKey`：

```http
Content-Type: application/json
```

在埋点 SDK 里，这个值通过 `X-Site-Key` 请求头传入；本质上就是你提供的
`writeKey`。不能把 `serverKey` 用在浏览器埋点。

```http
X-Site-Key: <NEXT_PUBLIC_ZHYADMIN_WRITE_KEY>
```

服务端同步必须使用 `serverKey`：

```http
Content-Type: application/json
X-Site-Secret: <ZHYADMIN_SERVER_KEY>
Idempotency-Key: <stable-idempotency-key>
```

`serverKey` 绝对不能传到浏览器、客户端 JS、HTML、localStorage 或公开日志。

### 1.5 统一响应

成功：

```json
{
  "data": {},
  "requestId": "req_..."
}
```

失败：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payload",
    "details": {}
  },
  "requestId": "req_..."
}
```

### 1.6 错误码

```text
UNAUTHENTICATED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
CONFLICT
RATE_LIMITED
PLAN_LIMIT_REACHED
PAYMENT_REQUIRED
PAYMENT_PENDING
VOICE_NOT_SUPPORTED
AI_PROVIDER_ERROR
INTERNAL_ERROR
```

### 1.7 环境变量

真实 key 由你提供，部署时配置到 Vercel / 本地 `.env.local`。文档和 Git 中只保留变量名，避免把 `serverKey` 提交到仓库。

```env
NEXT_PUBLIC_SITE_URL=https://ailanguagetutor.online

# Central data backend
NEXT_PUBLIC_ZHYADMIN_ENDPOINT=https://zhyadmin.vercel.app
NEXT_PUBLIC_ZHYADMIN_WRITE_KEY=<provided-write-key>
ZHYADMIN_SERVER_KEY=<provided-server-key>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Waffo
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_WEBHOOK_PUBLIC_KEY=
```

### 1.8 前端实际需要调用的接口

前端只应该直接调用这些接口或 SDK：

| 场景 | 前端调用 | 是否需要登录 | 是否需要 `writeKey` | 是否允许 `serverKey` |
| --- | --- | --- | --- | --- |
| Google 登录 | Supabase `signInWithOAuth` | 否 | 否 | 否 |
| 登录同步 | `/api/auth/sync` | 是 | 否 | 否 |
| 当前用户 | `/api/me` | 是 | 否 | 否 |
| 语言弹窗 | `/api/me/settings` | 是 | 否 | 否 |
| 工作台首屏 | `/api/workbench` | 是 | 否 | 否 |
| 伙伴列表 | `/api/partners` | 是 | 否 | 否 |
| 新对话 | `/api/conversations` | 是 | 否 | 否 |
| 发消息 | `/api/conversations/:id/messages` | 是 | 否 | 否 |
| 语音消息 | `/api/conversations/:id/messages/from-voice` | 是 | 否 | 否 |
| 翻译/语法/音频 | `/api/messages/:id/*` | 是 | 否 | 否 |
| 学习卡片 | `/api/cards`、`/api/messages/:id/cards` | 是 | 否 | 否 |
| 定价页 | `/api/billing/plans` | 否 | 否 | 否 |
| 创建支付 | `/api/billing/checkout` | 是 | 否 | 否 |
| 支付状态 | `/api/billing/me` | 是 | 否 | 否 |
| 页面/事件埋点 | `https://zhyadmin.vercel.app/analytics.js` + `/api/track` | 否 | 是 | 否 |

中央业务数据同步不由浏览器直接调，统一由本站服务端调中央后台。

---

## 2. 登录与用户

### 2.1 Google 登录

前端用 Supabase Google OAuth。

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${location.origin}/auth/callback?next=/app`
  }
});
```

### 2.2 `GET /auth/callback`

用途：OAuth code 换 session。

处理顺序：

1. 用 code 换 Supabase session
2. 读取 Supabase user
3. upsert `profiles`
4. upsert `user_identities`
5. 写入 `auth_login_events`
6. 跳转到 `next`

### 2.3 `POST /api/auth/sync`

用途：前端已拿到 session 后，同步业务用户数据。

请求：

```json
{
  "next": "/app"
}
```

响应：

```json
{
  "data": {
    "profileSynced": true,
    "identitySynced": true,
    "settingsCreated": true
  },
  "requestId": "req_..."
}
```

### 2.4 `POST /api/auth/logout`

用途：注销 session，并写 logout 事件。

### 2.5 `GET /api/me`

返回当前用户、语言设置和权益。

```json
{
  "data": {
    "profile": {
      "id": "uuid",
      "email": "learner@example.com",
      "displayName": "Alex",
      "avatarUrl": null,
      "planCode": "free"
    },
    "settings": {
      "nativeLanguageCode": "zh-CN",
      "learningLanguageCode": "en",
      "levelCode": "auto",
      "partnerId": "uuid"
    },
    "entitlement": {
      "planCode": "free",
      "status": "active",
      "canStartConversation": true,
      "canUseVoice": true
    }
  },
  "requestId": "req_..."
}
```

### 2.6 `PATCH /api/me`

修改昵称、头像、时区等基础资料。

### 2.7 `GET /api/me/settings`

读取首次语言选择和后续设置。

### 2.8 `PUT /api/me/settings`

保存语言、等级、伙伴选择。

```json
{
  "nativeLanguageCode": "zh-CN",
  "learningLanguageCode": "en",
  "levelCode": "beginner",
  "partnerId": "uuid"
}
```

---

## 3. 工作台

### 3.1 `GET /api/workbench`

工作台首页一次性拿到所有首屏数据。

返回建议包含：

- 用户资料
- 语言设置
- 当前权益
- 伙伴卡片
- 当前对话
- 今日统计
- 最近对话列表
- 保存卡片预览
- 风险提示 / 额度提示

### 3.2 `GET /api/partners`

返回可用 tutor partner 列表。

字段建议：

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "clara-ruiz",
      "displayName": "Clara Ruiz",
      "gender": "female",
      "location": "Valencia",
      "personality": "Calm, observant, gently witty",
      "avatarUrl": "https://...",
      "supportedModes": ["say_it", "talk"]
    }
  ]
}
```

### 3.3 `PATCH /api/me/partner`

切换伙伴或保存个性化配置。

```json
{
  "partnerId": "uuid",
  "tone": "warm",
  "correctionLevel": "balanced",
  "speechRate": 1
}
```

---

## 4. 对话接口

### 4.1 `POST /api/conversations`

创建新对话。

```json
{
  "mode": "say_it",
  "nativeLanguageCode": "zh-CN",
  "learningLanguageCode": "en",
  "levelCode": "auto",
  "partnerId": "uuid"
}
```

### 4.2 `GET /api/conversations`

查询会话历史。

可选参数：

- `status`
- `mode`
- `limit`
- `cursor`

### 4.3 `GET /api/conversations/:id`

返回单个对话详情和消息列表。

### 4.4 `POST /api/conversations/:id/messages`

发送一条文本消息。

```json
{
  "clientMessageId": "msg-uuid",
  "content": "我明天可能会迟到。",
  "inputType": "text",
  "sourceLanguageCode": "zh-CN"
}
```

服务端处理顺序：

1. 校验 session
2. 校验 conversation 属于当前用户
3. 校验权益
4. 写入 user message
5. 调用 AI
6. 写入 tutor reply
7. 写入翻译 / 语法 / 解释
8. 计入用量

### 4.5 `POST /api/conversations/:id/messages/from-voice`

语音转写后发送。

```json
{
  "clientMessageId": "msg-uuid",
  "transcript": "I would like a coffee.",
  "audioId": "uuid"
}
```

### 4.6 `POST /api/conversations/:id/end`

结束当前对话，写入统计。

### 4.7 `POST /api/conversations/:id/reset`

重开一轮新对话，等价于前端的 `New conversation`。

---

## 5. 语音、翻译、语法、卡片

### 5.1 `POST /api/voice/upload-url`

获取语音文件上传地址。Storage 必须是 private bucket。

### 5.2 `POST /api/voice/inputs`

创建语音输入记录。

```json
{
  "conversationId": "uuid",
  "audioPath": "voice/2026/08/..webm",
  "mimeType": "audio/webm",
  "durationMs": 3800
}
```

### 5.3 `POST /api/messages/:id/translate`

生成翻译。

### 5.4 `POST /api/messages/:id/grammar`

生成语法解释。

### 5.5 `POST /api/messages/:id/audio`

生成或返回 TTS。

### 5.6 `POST /api/messages/:id/cards`

保存学习卡片。

```json
{
  "cardType": "phrase",
  "phrase": "I might be late tomorrow.",
  "meaning": "我明天可能会迟到。",
  "explanation": "Use might for possibility."
}
```

### 5.7 `GET /api/cards`

返回已保存卡片。

### 5.8 `PATCH /api/cards/:id`

更新复习状态。

### 5.9 `DELETE /api/cards/:id`

删除卡片。

---

## 6. 付费与 Waffo

### 6.1 计划

建议后端公开这些计划：

| code | 名称 | 类型 |
| --- | --- | --- |
| `free` | Free | free |
| `pro_monthly` | Pro | subscription |
| `pro_annual` | Pro Annual | subscription |
| `lifetime` | Lifetime | one_time |

### 6.2 `GET /api/billing/plans`

返回首页和定价页可展示的价格、额度、权益。

### 6.3 `GET /api/billing/me`

返回当前订单、订阅和权益状态。

### 6.4 `POST /api/billing/checkout`

创建本地订单并生成 Waffo checkout。

```json
{
  "planCode": "pro_monthly",
  "successPath": "/app?payment=success",
  "cancelPath": "/pricing?payment=cancelled"
}
```

规则：

- 金额必须从数据库的 `plans` 读取
- 不能信任前端传入的价格
- 必须写入 `orders`
- 必须使用幂等 key

### 6.5 `POST /api/billing/subscriptions/:id/cancel`

设置周期结束取消。

### 6.6 `POST /api/webhooks/waffo`

接收 Waffo webhook。

处理要求：

1. 先验签
2. 再写 `payment_events`
3. 事件幂等
4. 更新 `orders` / `subscriptions`
5. 重新计算用户权益

说明：

- Waffo 具体事件名、签名字段、测试环境参数，以 Waffo 官方文档和商户后台为准
- 不要把未确认字段硬编码到生产环境
- 浏览器回跳不是支付最终事实，webhook 才是

---

## 7. 后台接口

后台统一放在 `/api/admin/*`，仅管理员可访问。

### 7.1 `GET /api/admin/overview`

后台首页统计。

### 7.2 `GET /api/admin/users`

用户列表、搜索、分页。

### 7.3 `GET /api/admin/users/:id`

用户详情、登录事件、会话、订单、卡片、工单。

### 7.4 `PATCH /api/admin/users/:id`

修改标签、备注、状态。

### 7.5 `GET /api/admin/conversations`

对话检索和审计。

### 7.6 `GET /api/admin/orders`

订单列表和对账。

### 7.7 `GET /api/admin/subscriptions`

订阅状态、周期、取消标记。

### 7.8 `GET /api/admin/payment-events`

Webhook 原始事件和处理结果。

### 7.9 `POST /api/admin/payment-events/:id/reprocess`

重放失败事件。

### 7.10 `GET /api/admin/audit-logs`

审计日志。

### 7.11 `GET/POST/PATCH /api/admin/partners`

管理 Clara 这类 tutor partner。

### 7.12 `GET/POST/PATCH /api/admin/plans`

管理 Free / Pro / Annual / Lifetime。

---

## 8. 中央数据后台接口

中央后台用于统一埋点、网站业务数据归档和匿名用户合并。  
AI Language Tutor 的站点类型固定为 `ai_language_tutor`。

### 8.1 `POST /api/sites`

用途：在中央后台创建或更新站点登记信息。

请求头：

```http
X-Site-Secret: <serverKey>
```

请求：

```json
{
  "siteType": "ai_language_tutor",
  "siteName": "AI Language Tutor",
  "siteUrl": "https://ailanguagetutor.online",
  "active": true,
  "metadata": {}
}
```

### 8.2 `POST /api/sync`

用途：同步本站业务实体到中央后台。

同步对象包括：

- 用户档案快照
- 登录事件
- 会话摘要
- 消息摘要
- 学习卡片
- 语音输入摘要
- AI 调用记录
- 订单摘要
- 订阅摘要

请求头：

```http
X-Site-Secret: <serverKey>
Idempotency-Key: <stable-key>
```

请求示例：

```json
{
  "siteType": "ai_language_tutor",
  "entityType": "conversation",
  "externalId": "conversation_001",
  "userId": "auth-user-uuid",
  "anonymousId": "anon_xxx",
  "payload": {
    "mode": "say_it",
    "title": "English roleplay",
    "status": "active",
    "startedAt": "2026-08-25T09:00:00.000Z"
  }
}
```

### 8.3 `POST /api/track`

用途：浏览器事件埋点。

请求头：

```http
Content-Type: application/json
```

请求：

```json
{
  "siteUrl": "https://ailanguagetutor.online",
  "eventName": "conversation_started",
  "anonymousId": "anon_xxx",
  "userId": null,
  "sessionId": "session_xxx",
  "path": "/",
  "referrer": "",
  "occurredAt": "2026-08-25T09:01:00.000Z",
  "properties": {
    "mode": "say_it",
    "language": "en"
  }
}
```

建议埋点事件：

| 事件名 | 漏斗 |
| --- | --- |
| `app_opened` | activation |
| `onboarding_completed` | activation |
| `conversation_started` | activation |
| `message_submitted` | learning_loop |
| `voice_recording_started` | voice_learning |
| `voice_transcribed` | voice_learning |
| `learning_card_saved` | learning_loop |
| `checkout_opened` | purchase |
| `payment_completed` | purchase |

### 8.4 `POST /api/identity/merge`

用途：匿名用户登录后合并 anonymousId 与 userId。

```json
{
  "siteType": "ai_language_tutor",
  "anonymousId": "anon_xxx",
  "userId": "auth-user-uuid"
}
```

The preferred browser flow is `POST /api/auth/sync` after Supabase session
creation. It carries the anonymous identity and uses a stable idempotency key
per `(siteType, anonymousId, authenticated user)`. The server must derive the
authenticated user from the bearer token, merge the anonymous records
atomically, and consume or rebind the source identity after success. A later
request made with the source anonymous identity must not expose the merged
records. The merge must never move records between two authenticated users.

### 8.5 中央后台给本站的回包约定

建议中央后台对所有写接口返回：

```json
{
  "success": true,
  "data": {},
  "requestId": "req_..."
}
```

失败：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payload"
  },
  "requestId": "req_..."
}
```

---

## 9. 数据表映射

核心表建议：

| 表 | 作用 |
| --- | --- |
| `profiles` | 用户主档 |
| `user_identities` | OAuth 身份映射 |
| `auth_login_events` | 登录审计 |
| `user_language_settings` | 语言和等级设置 |
| `tutor_partners` | 伙伴配置 |
| `conversations` | 会话主表 |
| `messages` | 会话消息 |
| `message_outputs` | 翻译 / 语法 / 回复结果 |
| `voice_inputs` | 语音输入 |
| `learning_cards` | 学习卡片 |
| `plans` | 公开套餐 |
| `orders` | 订单 |
| `subscriptions` | 订阅 |
| `payment_events` | Waffo webhook 原始事件 |
| `usage_daily` | 日用量 |
| `admin_members` | 后台权限 |
| `audit_logs` | 后台审计 |
| `support_cases` | 工单 |

中央后台对应的归档表建议保持 `zhyadmin_aitutor_` 前缀，和中央后台里的其他网站数据隔离。

---

## 10. 关键流程

### 9.1 首次登录

```text
Google OAuth -> Supabase session -> /auth/callback
-> /api/auth/sync -> profiles + user_identities + login event
-> /api/me/settings -> 首次语言选择
-> /api/conversations -> 开始练习
```

### 9.2 语音消息

```text
按住说话 -> 浏览器录音 / SpeechRecognition
-> transcript -> /api/conversations/:id/messages/from-voice
-> AI 回复 -> message_outputs
```

### 9.3 购买 Pro

```text
/pricing -> /api/billing/plans
-> /api/billing/checkout
-> Waffo checkout
-> webhook
-> subscriptions active
-> /api/billing/me 刷新权益
```

---

## 11. 安全要求

- Supabase service role key 只能在服务端
- Waffo secret 只能在服务端
- Google OAuth 由 Supabase 处理
- RLS 必须开启
- 用户只能读自己的数据
- 管理员接口必须校验 `admin_members`
- webhook 必须验签
- 所有支付/订阅状态以 webhook 为准
- 语音、音频、导出文件默认 private
- `writeKey` 只能用于浏览器埋点
- `serverKey` 只能用于本站服务端调用中央后台
- 不能把 `serverKey` 以任何形式返回给前端

---

## 12. 与前端页面的对应关系

| 前端页面 | 主要接口 |
| --- | --- |
| `/login` | Supabase Google OAuth, `/api/auth/sync` |
| `/app` | `/api/workbench`, `/api/conversations/*`, `/api/partners` |
| 语言弹窗 | `/api/me/settings` |
| 语音长按 | `/api/conversations/:id/messages/from-voice`, `/api/voice/*` |
| `/pricing` | `/api/billing/plans`, `/api/billing/checkout`, `/api/billing/me` |
| `/contact` | 静态页，可后续接 `/api/support-cases` |
| `/privacy` | 静态页 |
| `/terms` | 静态页 |
| 浏览器埋点 | `https://zhyadmin.vercel.app/analytics.js`、`/api/track` |
| 业务归档同步 | 中央后台 `/api/sync`、`/api/identity/merge` |

---

## 13. 备注

当前仓库里如果还有旧的 `writeKey / serverKey` 草稿，它现在可以作为中央后台模型的一部分使用。  
这份文档才是当前 AI Language Tutor 的前后端接口基线，且同时覆盖中央后台同步。
