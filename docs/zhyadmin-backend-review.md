# zhyadmin 后端审计与 AI Language Tutor 对接报告

审计日期：2026-09-03  
审计对象：`D:\work\web\zhyadmin`  以及当前前端的调用方式  
审计范围：只读检查，未修改 `zhyadmin` 项目

## 结论摘要

`zhyadmin` 不是空后台。它已经具备：

- Next.js 16 + Supabase 的中央管理台；
- 多站点隔离模型，使用 `site_id` 区分网站；
- AI Tutor 的用户、设置、导师、会话、消息、卡片、语音、AI Run、套餐和支付事件表；
- 面向网站的产品 API；
- 后台的用户、订单、订阅、事件、业务记录、计划和导师管理接口；
- 匿名身份合并和统一事件采集能力。

但目前还不能直接认为它已经可以支撑生产环境。主要原因是：

1. 前端和后台的部分 JSON 字段名称不一致，导致即使 API 成功，前端也会丢数据或误判数据。
2. 前端新增的手动查词接口在后台尚未实现。
3. Waffo 支付只做了接口占位，checkout、webhook、订阅取消目前会返回 `PAYMENT_PENDING` 或 `501`。
4. 语音输入目前只保存上传记录，后台没有完成转写任务和转写查询接口。
5. 免费额度、时长、每日用量等 entitlement 规则还没有真正落地。
6. 后台管理员角色参数目前没有真正做权限限制；默认管理员账号和密码也不适合生产使用。

## 项目结构与运行检查

### 技术栈

- Next.js `16.2.10`
- React `19.1.0`
- TypeScript `5.8`
- Supabase JS `2.110.6`
- Next.js App Router
- Supabase Service Role 负责服务端中央数据读写

### 已有主要模块

| 模块 | 位置 | 状态 |
| --- | --- | --- |
| 中央站点与统一数据 | `lib/central-tables.ts`、`supabase/schema.sql` | 已实现 |
| AI Tutor 产品 API | `lib/ai-tutor-product.ts`、`app/api/[...product]/route.ts` | 主流程已实现 |
| 管理后台 API | `app/api/admin/*` | 已实现部分管理查询和写入 |
| Supabase Auth 同步 | `lib/site-auth.ts` | 已实现 |
| 匿名身份合并 | `zhyadmin_merge_anonymous_identity` | 已实现 SQL 函数 |
| OpenAI Tutor 回复 | `openAiText()` | 已实现，但依赖密钥 |
| OpenAI TTS | `audioOutput()` | 已实现，但依赖密钥和 Storage |
| Waffo 支付 | `checkout()`、`webhookWaffo()` | 未完成 |

### 检查结果

- `npm run typecheck`：通过。
- `npm run lint`：失败。当前脚本是 `next lint`，Next.js 16 已将该命令视为项目路径，报错 `Invalid project directory ...\\lint`。需要改为 ESLint 9 的正式配置和命令。
- `npm run build`：本次检查因 Windows 下 `.next/trace` 无法打开而失败，错误为 `EPERM`。通常与正在运行的开发服务、`.next` 文件锁或目录权限有关；不是 TypeScript 编译错误，但部署前应在干净构建环境验证。
- `zhyadmin` Git 工作区：检查时无未提交改动。

## 后台已经实现的产品 API

后台的统一入口是：

```text
/api/[...product]
```

已实现的 AI Tutor 产品路径：

| 方法 | 路径 | 代码状态 |
| --- | --- | --- |
| POST | `/api/auth/sync` | 已实现 |
| POST | `/api/auth/logout` | 已实现 |
| GET/PATCH | `/api/me` | 已实现 |
| GET/PUT | `/api/me/settings` | 已实现 |
| PATCH | `/api/me/partner` | 已实现 |
| GET | `/api/workbench` | 已实现，但返回字段与前端有差异 |
| GET | `/api/partners` | 已实现 |
| GET/POST | `/api/conversations` | 已实现 |
| GET | `/api/conversations/:id` | 已实现 |
| POST | `/api/conversations/:id/messages` | 已实现 |
| POST | `/api/conversations/:id/messages/from-voice` | 已实现 |
| POST | `/api/conversations/:id/end` | 已实现 |
| POST | `/api/conversations/:id/reset` | 已实现 |
| POST | `/api/voice/upload-url` | 已实现 |
| POST | `/api/voice/inputs` | 已实现注册记录 |
| POST | `/api/messages/:id/translate` | 已实现 |
| POST | `/api/messages/:id/grammar` | 已实现 |
| POST | `/api/messages/:id/audio` | 已实现，依赖 OpenAI TTS |
| POST | `/api/messages/:id/cards` | 已实现 |
| GET/PATCH/DELETE | `/api/cards`、`/api/cards/:id` | 已实现 |
| GET | `/api/billing/plans` | 已实现 |
| GET | `/api/billing/me` | 已实现 |
| POST | `/api/billing/checkout` | 占位，Waffo 未接入 |
| POST | `/api/billing/subscriptions/:id/cancel` | 占位，Waffo 未接入 |
| POST | `/api/webhooks/waffo` | 占位，未做验签和入账 |

## 前后端硬不兼容问题

这些问题需要在后端修复，或者明确由前端适配。建议最终统一 API 契约，不要长期靠两边猜字段。

### 1. Workbench 返回字段不一致

后台实际返回：

```json
{
  "savedCards": [],
  "today": {
    "messageCount": 0
  }
}
```

当前前端类型和页面主要读取：

```json
{
  "cards": [],
  "todayMessageCount": 0
}
```

影响：工作台首次加载后，学习卡片和今日消息数不会被正确显示。

建议后台兼容返回：

```json
{
  "cards": [],
  "todayMessageCount": 0
}
```

也可以短期同时返回旧字段：

```json
{
  "cards": [],
  "savedCards": [],
  "todayMessageCount": 0,
  "today": { "messageCount": 0 }
}
```

### 2. Tutor Partner 字段不一致

后台 `presentPartner()` 返回：

```json
{
  "id": "uuid",
  "displayName": "Clara Ruiz",
  "personality": "...",
  "avatarUrl": "..."
}
```

当前前端主要使用：

```json
{
  "id": "uuid",
  "name": "Clara Ruiz",
  "description": "...",
  "avatarUrl": "..."
}
```

影响：导师名称和描述可能回退到前端默认值，后台选择的导师无法完整展示。

建议统一为前端更直观的字段：

```json
{
  "id": "uuid",
  "name": "Clara Ruiz",
  "gender": "female",
  "location": "Valencia",
  "description": "Calm, observant, gently witty",
  "avatarUrl": null
}
```

如果保留中央后台字段命名，则前端必须稳定适配 `displayName`、`personality`，不建议两种命名长期并存。

### 3. Billing Plan 字段不一致

后台 `presentPlan()` 返回：

```json
{
  "code": "pro_monthly",
  "name": "Pro",
  "type": "subscription",
  "currency": "USD",
  "amount": 12.99,
  "billingInterval": "month",
  "entitlements": {},
  "isActive": true
}
```

当前前端价格组件主要读取：

```text
planCode / code
interval
amount / price
popular
features
```

影响：中央计划返回后，前端可能无法识别月付/年付；没有 `interval` 时会错误地把数组第一项当作月付计划。`popular` 和 `features` 也不会从后台同步。

建议后台返回兼容字段：

```json
{
  "code": "pro_monthly",
  "planCode": "pro_monthly",
  "name": "Pro",
  "type": "subscription",
  "currency": "USD",
  "amount": 12.99,
  "interval": "month",
  "billingInterval": "month",
  "popular": true,
  "features": [],
  "entitlements": {},
  "isActive": true
}
```

### 4. 手动查词接口缺失

前端工作台现在支持没有对应消息 ID 的手动短语查询，需要：

```text
POST /api/messages/translate
POST /api/messages/grammar
```

请求示例：

```json
{
  "text": "Could you say that more slowly?",
  "sourceLanguageCode": "en",
  "targetLanguageCode": "zh-CN"
}
```

当前后台只实现了：

```text
POST /api/messages/:id/translate
POST /api/messages/:id/grammar
```

建议抽出统一的 `generateMessageInsight()`，支持 `messageId` 和纯文本两种输入，并对文本长度、语言代码和用户额度做校验。

### 5. 自然表达接口缺失

当前产品文档和前端能力规划还需要：

```text
POST /api/messages/:id/natural-expression
```

建议返回：

```json
{
  "id": "output-uuid",
  "type": "natural_expression",
  "content": {
    "original": "...",
    "suggestion": "...",
    "explanation": "..."
  },
  "generatedAt": "2026-09-03T00:00:00.000Z"
}
```

数据库的 `message_outputs.output_type` 也要增加 `natural_expression`，或者将这类结果统一放入 metadata。

## 后端逻辑风险

### 1. 免费额度没有真正执行

`ensureDefaultPlans()` 创建的 free entitlement 目前只包含：

```json
{
  "canStartConversation": true,
  "canUseVoice": true
}
```

`currentEntitlement()` 也只判断计划和订阅，没有检查：

- 免费 60 秒时长；
- 每日消息数；
- 每日语音数或语音时长；
- 订阅过期后的降级；
- 用量统计和并发请求。

建议新增或使用 `usage_daily` 表，并在创建会话、发送消息、上传语音前做原子额度检查。额度检查不能只在前端完成。

### 2. AI 调用发生在数据库幂等写入之后

发送消息的流程是：

1. 写入用户消息；
2. 调用 OpenAI；
3. 写入 Tutor 回复。

如果客户端超时后重试，现有查询可以识别 `clientMessageId`，但当第一次请求已经写入用户消息、AI 请求尚未完成时，重试会直接拿到 `tutorMessage: null`，不会自动恢复正在处理的 AI 任务。并发重试也可能产生重复 AI 调用。

建议：

- 对 `site_id + external_message_id` 保持唯一约束；
- 增加消息处理状态：`pending / generating / succeeded / failed`；
- 将 AI run 与用户消息建立唯一关联；
- 对同一个消息使用数据库锁或任务队列；
- 重试时优先返回已有成功结果，或继续查询已有 AI run。

### 3. 部分数据库更新错误没有处理

例如更新 conversation 的 `last_message_at` 和站点 `last_event_at` 的调用有些没有检查返回错误。生产中会出现主业务已成功但统计字段没有更新的情况。

建议所有 Supabase 写操作统一使用：

```ts
const { error } = await query;
if (error) throw error;
```

对必须保持一致的多表写入，建议使用 Postgres RPC 或明确的补偿任务。

### 4. Tutor ID 设计需要统一

数据库中的 `partner_id` 是 UUID 外键。前端旧的本地 Demo 使用 `clara-ruiz` 作为字符串 ID。

生产模式下必须保证：

- 工作台返回真实 UUID；
- `/api/me/settings` 保存真实 UUID；
- 前端不再把 slug 当作外键；
- slug 只用于展示、配置或 URL。

### 5. `siteUrl` 和 Origin 需要部署时核对

中央 API 通过 `siteUrl`、请求 Origin 和 `zhyadmin_sites.origin` 查找站点。当前前端默认配置为：

```text
https://ailanguagetutor.online
https://zhyadmin.vercel.app
```

Supabase 中必须存在：

- `site_type = ai_language_tutor`；
- `origin = https://ailanguagetutor.online`；
- `status = active`。

如果生产域名带 `www`、预览域名或本地域名，必须明确是否注册为独立站点，不能依赖模糊匹配。

## 支付状态

当前代码明确没有启用真实支付，原因是 Waffo 商户契约尚未配置。以下环境变量在后台当前环境中未发现：

```env
WAFFO_API_BASE_URL=
WAFFO_API_KEY=
WAFFO_API_SECRET=
WAFFO_WEBHOOK_PUBLIC_KEY=
```

在没有官方字段和验签文档之前，保持 `PAYMENT_PENDING` 是正确的安全行为，不能直接猜测支付请求格式。

正式接入必须完成：

1. 创建本地订单并保存 `external_order_id`。
2. 调用 Waffo checkout。
3. 校验返回订单和金额是否与本地 plan 一致。
4. webhook 验签和时间窗口校验。
5. `provider_event_id` 唯一幂等。
6. 处理支付成功、失败、退款、取消、续费。
7. 更新统一订单表、订阅表和 entitlement。
8. 提供订单查询接口：

```text
GET /api/billing/orders/:id
```

## 语音状态

当前后台已经有：

```text
POST /api/voice/upload-url
POST /api/voice/inputs
```

但是 `/api/voice/inputs` 只是登记音频并将 `transcription_status` 设为 `pending`。产品还需要：

```text
POST /api/voice/inputs/:id/transcribe
GET  /api/voice/inputs/:id
```

建议转写状态统一为：

```text
pending -> processing -> succeeded
                         -> failed
```

还需要限制：文件大小、音频时长、MIME 类型、Storage 私有权限、签名 URL 有效期和过期清理。

## 管理后台风险

### 1. 管理员角色没有真正限制

`assertAdmin()` 接收 `_allowedRoles` 参数，但实际只检查是否存在有效管理员 session，没有检查当前账号的 role 是否在允许列表内。

结果是：只要登录后台，`viewer` 理论上也可能调用所有管理接口，包括计划和导师写入接口。

建议：

- session 中绑定管理员 ID，而不是只绑定 email；
- 查询账号 role 和 active 状态；
- 每个路由传入明确的允许角色；
- 所有写入接口记录 audit log。

### 2. 默认管理员账号不适合生产

`README.md` 和 `supabase/schema.sql` 都包含默认账号信息：

```text
zhy@admin.com / admin666
```

密码使用无盐 SHA-256，安全性不足。生产环境必须：

- 删除默认账号或首次启动强制改密；
- 使用 Argon2id、bcrypt 或 Supabase Auth；
- 禁止在 README 和 migration 中保存默认生产密码；
- 增加登录失败次数限制和审计事件；
- 管理员 session 增加轮换和主动撤销机制。

### 3. Admin API 与产品 API 是两个边界

后台管理接口位于：

```text
/api/admin/*
```

并使用 `zhy-admin-session` cookie。它不会自动成为 AI Language Tutor 网站的公开 API。前端网站当前的 `/api/[...path]` 只允许产品 API 路径，因此 `/api/admin/users` 在网站端返回 404 是预期行为。

如果希望从语言学习网站内嵌管理员入口，需要单独设计管理员域名、反向代理和 CSRF 防护，不应把后台 cookie 接口直接暴露给普通用户站点。

## 数据库部署要求

首次部署顺序：

1. 在 Supabase 执行 `supabase/schema.sql`。
2. 如果中央基础表已经存在，确认 AI Tutor 表也已执行；不要只执行 `ai-tutor-product.sql` 而遗漏基础表。
3. 创建或确认 `zhyadmin_sites` 中的 AI Language Tutor 站点。
4. 创建默认 Tutor Partner，并记录真实 UUID。
5. 在后台创建 free、monthly、annual 计划。
6. 检查 RLS 已启用，并确认没有意外开放给 anon/authenticated 的 policy。
7. 配置 Storage 私有 bucket。
8. 用真实 bearer token 做端到端 API 验证。

当前 SQL 已包含大量表、索引、trigger、函数和 RLS enable；但 SQL 文件不是版本化 migration。正式环境应拆成有序 migration，并在 CI 中验证从空库和已有库都能升级。

## 推荐修复顺序

### P0：先让前后端稳定连通

1. 核对 Vercel 后台环境变量和 Supabase 项目。
2. 确认 `zhyadmin_sites` 的 origin、site type、status。
3. 确认所有 AI Tutor 表存在。
4. 统一 `workbench`、`partner`、`plan` 的响应字段。
5. 增加 API contract test，覆盖前端实际 payload 和 response。

### P1：完成核心学习闭环

1. 手动文本翻译接口。
2. 手动文本语法接口。
3. Tutor 自然表达接口。
4. 免费时长和每日用量限制。
5. 消息处理状态和并发幂等。
6. 语音转写状态查询。
7. 所有 Supabase 写操作错误处理。

### P2：支付和生产安全

1. Waffo checkout。
2. Waffo webhook 验签和幂等。
3. 订单/订阅/entitlement 状态机。
4. 管理员 RBAC。
5. 默认密码和 SHA-256 登录替换。
6. 真实 migration、备份、监控和告警。

## 交付前验收清单

```text
[ ] 未登录访问受保护产品 API 返回 401
[ ] 错误 siteUrl/origin 返回 403 或 404，且不会跨站读数据
[ ] auth/sync 可以创建 site user 和默认 settings
[ ] workbench 返回前端约定的 cards、todayMessageCount、partner 字段
[ ] 创建会话不会重复创建
[ ] 同一个 clientMessageId 重试不会重复消耗 AI 额度
[ ] AI Provider 失败后可重试，且不会产生孤立消息
[ ] 翻译、语法、自然表达接口可用并持久化结果
[ ] 语音上传、转写、查询完整闭环
[ ] 免费用户超过额度后服务端拒绝
[ ] billing/me 与实际订单、订阅、entitlement 一致
[ ] Waffo webhook 重放不会重复开通权益
[ ] viewer 管理员不能修改计划、导师和用户状态
[ ] 所有敏感日志不包含 token、密码、支付签名和完整音频内容
[ ] 生产构建在干净环境通过
```

## 是否建议现在开始修复后端

建议先由你确认两件事，再开始修改：

1. 最终以“后台字段适配前端”，还是“前端适配后台字段”为主。推荐以文档中的稳定产品 API 契约为准，由后台输出兼容字段，前端保留少量向后兼容读取。
2. Waffo、AI Provider、Supabase Storage 的正式环境变量和官方接口资料是否已经准备好。

如果暂时不接支付，也可以先只修 P0/P1，把会话、消息、查词、卡片和语音转写流程打通，再单独接入 Waffo。
