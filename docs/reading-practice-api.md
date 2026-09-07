# 阅读练习页后端接口契约

本文档说明 AI Language Tutor 阅读练习页需要后端提供什么能力，以及前端如何从当前的浏览器本地实现迁移到后端接口。

## 1. 当前页面与目标

当前阅读练习页位于：

```text
/english-reading-practice
/{locale}/english-reading-practice
```

当前实现：

| 能力 | 当前实现 | 后端接入后的目标 |
| --- | --- | --- |
| 示例文章 | React 静态常量 | 后端提供可版本化的示例课程，前端保留静态 fallback |
| 自定义 `.txt` | 浏览器 `FileReader` | 上传/提交文本后创建阅读材料并持久化 |
| 词汇 | 静态常量 | 后端保存文章对应的词汇、释义和英文例句 |
| 理解题 | 静态常量 | 后端保存题目、选项、答案和作答记录 |
| 学习笔记 | 按身份分桶的 `localStorage` | 后端按用户和材料保存；匿名草稿在登录成功后合并到当前账号 |
| 朗读 | `speechSynthesis` | 第一阶段继续使用浏览器朗读；后端 TTS 作为可选增强 |
| 界面语言 | URL locale + 前端字典 | 继续由前端本地化操作界面；后端只接收 locale 并返回需要本地化的解释内容 |

文章标题、文章正文、英文词汇、英文例句、理解题原文和选项必须保持英文，不应随着界面语言改变。

## 2. 接口约定

### 2.1 基础路径

浏览器只调用本站同源接口：

```text
/api/reading/*
```

本站 `app/api/[...path]/route.ts` 将这些路径转发到中央后端。新增接口前，需要把对应路径加入本站 API allowlist；否则会返回 404。

### 2.2 请求头

登录用户请求：

```http
Authorization: Bearer <supabase-access-token>
Accept: application/json
Content-Type: application/json
X-Request-Id: req_<uuid>
Idempotency-Key: <key>          # 创建材料、提交答案等写操作建议提供
```

未登录请求只允许访问公开示例课程。匿名身份通过 `X-Browser-Id`（以及可选的
`X-Session-Id`）关联匿名数据；不同浏览器匿名 ID 必须相互隔离。后端不要信任
浏览器传入的 `userId`，登录用户身份必须从 Supabase access token 解析。

登录后的 `POST /api/auth/sync` 会携带此前的 `anonymousId`。后端必须将该匿名
身份下属于本站的数据原子、幂等地合并到 token 对应用户，包括阅读材料、阅读笔记、
作答记录以及其他学习数据。合并目标只能是 token 中的用户，不能由请求体中的
`userId` 指定。合并完成后，匿名记录应转移到该用户或标记为 consumed/merged，
不能继续以原匿名身份读取；不同登录用户之间不能共享这些记录。

### 2.3 统一响应格式

成功：

```json
{
  "data": {},
  "requestId": "req_...",
  "success": true
}
```

失败：

```json
{
  "error": {
    "code": "READING_MATERIAL_NOT_FOUND",
    "message": "Reading material was not found.",
    "details": {}
  },
  "requestId": "req_...",
  "success": false
}
```

建议错误码：

| HTTP | code | 使用场景 |
| --- | --- | --- |
| 400 | `INVALID_READING_REQUEST` | 字段缺失、文本过长、题目答案格式错误 |
| 401 | `UNAUTHENTICATED` | 需要登录但没有有效 session |
| 403 | `READING_ACCESS_DENIED` | 材料不属于当前用户 |
| 404 | `READING_MATERIAL_NOT_FOUND` | 材料或课程不存在 |
| 409 | `READING_DUPLICATE_SUBMISSION` | 相同幂等 key 已处理 |
| 413 | `READING_TEXT_TOO_LARGE` | 文本超过限制 |
| 422 | `READING_PROCESSING_FAILED` | 解析或 AI 生成失败 |
| 500 | `READING_INTERNAL_ERROR` | 服务端异常 |

## 3. 核心数据结构

### 3.1 ReadingMaterial

```ts
type ReadingMaterial = {
  id: string;
  kind: "sample" | "user_text";
  ownerUserId: string | null;
  title: string;
  content: string;
  contentLanguageCode: string; // 当前页面默认是 en
  sourceFileName: string | null;
  status: "ready" | "processing" | "failed";
  wordCount: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
};
```

### 3.2 VocabularyItem

```ts
type VocabularyItem = {
  id: string;
  materialId: string;
  word: string;             // 英文原词
  meaning: string;          // 根据 interfaceLocale 返回的解释
  example: string;          // 英文例句，必须保持英文
  displayOrder: number;
  audioUrl?: string | null; // 可选；没有时由浏览器 speechSynthesis 朗读
};
```

`word` 和 `example` 不随界面语言翻译。`meaning` 可以根据查询参数 `interfaceLocale` 返回对应语言版本。

### 3.3 ComprehensionQuestion

```ts
type ComprehensionQuestion = {
  id: string;
  materialId: string;
  prompt: string;           // 英文原题
  options: string[];        // 英文原选项
  displayOrder: number;
};
```

正确答案不建议在普通课程详情接口中返回，避免客户端直接暴露答案。作答后由后端计算分数并返回结果。

### 3.4 ReadingNotes

```ts
type ReadingNotes = {
  materialId: string;
  content: string;
  updatedAt: string;
};
```

## 4. 接口清单

### 4.1 获取公开示例课程

```http
GET /api/reading/lessons/sample?interfaceLocale=zh-CN
```

无需登录。示例课程应稳定返回当前页面使用的英文文章：

```json
{
  "data": {
    "material": {
      "id": "reading-sample-daily-walk-v1",
      "kind": "sample",
      "ownerUserId": null,
      "title": "The quiet power of a daily walk",
      "content": "A short walk can change the shape of a busy day...",
      "contentLanguageCode": "en",
      "sourceFileName": null,
      "status": "ready",
      "wordCount": 117,
      "estimatedMinutes": 3,
      "createdAt": "2026-09-04T00:00:00.000Z",
      "updatedAt": "2026-09-04T00:00:00.000Z"
    },
    "vocabulary": [
      {
        "id": "vocab-shape",
        "materialId": "reading-sample-daily-walk-v1",
        "word": "shape",
        "meaning": "影响某件事的发展方式",
        "example": "Small choices shape our routines.",
        "displayOrder": 1,
        "audioUrl": null
      }
    ],
    "questions": [
      {
        "id": "question-daily-walk-1",
        "materialId": "reading-sample-daily-walk-v1",
        "prompt": "What can a short walk give your mind?",
        "options": ["A few quiet minutes", "A faster commute", "A difficult task"],
        "displayOrder": 1
      }
    ],
    "ui": {
      "category": "日常英语",
      "duration": "阅读约 3 分钟",
      "keyIdea": "核心概念：习惯",
      "tipTitle": "阅读提示",
      "tipBody": "不必逐词翻译。先找出每个段落的主要意思。"
    }
  },
  "requestId": "req_...",
  "success": true
}
```

`ui` 是可选字段。操作按钮、状态提示、导航和页面说明仍由前端 `readingCopy` 负责；后端只需返回文章相关的动态解释时才使用 `ui`。

### 4.2 创建用户阅读材料

第一阶段按当前页面能力接收纯文本 JSON，不需要马上实现 PDF/DOCX。

```http
POST /api/reading/materials
Authorization: Bearer <token>
Idempotency-Key: reading_import_<uuid>
```

请求：

```json
{
  "title": "my-reading-material",
  "content": "A short English text to practice...",
  "contentLanguageCode": "en",
  "sourceFileName": "my-reading-material.txt",
  "interfaceLocale": "zh-CN"
}
```

服务端要求：

- `content` 必须是 UTF-8 文本；
- 建议限制为 16,000 字符，与当前前端 `content.slice(0, 16000)` 保持一致；
- 校验文本非空；
- `title` 为空时使用 `sourceFileName` 去掉 `.txt` 后的文件名；
- `contentLanguageCode` 当前默认 `en`，不要把界面语言当成文章语言；
- 创建材料后生成词汇和理解题；
- 如果生成是异步任务，返回 `status: "processing"`，不要让请求长时间阻塞。

同步完成时响应：

```json
{
  "data": {
    "material": {
      "id": "rm_123",
      "kind": "user_text",
      "ownerUserId": "user_123",
      "title": "my-reading-material",
      "content": "A short English text to practice...",
      "contentLanguageCode": "en",
      "sourceFileName": "my-reading-material.txt",
      "status": "ready",
      "wordCount": 8,
      "estimatedMinutes": 1,
      "createdAt": "2026-09-04T01:00:00.000Z",
      "updatedAt": "2026-09-04T01:00:00.000Z"
    },
    "vocabulary": [],
    "questions": []
  },
  "requestId": "req_...",
  "success": true
}
```

### 4.3 查询材料详情

```http
GET /api/reading/materials/:id?interfaceLocale=zh-CN
Authorization: Bearer <token>
```

返回材料、词汇、理解题和当前用户的笔记摘要：

```json
{
  "data": {
    "material": {},
    "vocabulary": [],
    "questions": [],
    "notes": {
      "content": "",
      "updatedAt": null
    },
    "progress": {
      "answeredCount": 0,
      "questionCount": 2,
      "correctCount": 0
    }
  },
  "requestId": "req_...",
  "success": true
}
```

### 4.4 保存学习笔记

```http
PUT /api/reading/materials/:id/notes
Authorization: Bearer <token>
```

请求：

```json
{
  "content": "I want to remember the phrase about building a habit."
}
```

响应：

```json
{
  "data": {
    "materialId": "rm_123",
    "content": "I want to remember the phrase about building a habit.",
    "updatedAt": "2026-09-04T01:02:00.000Z"
  },
  "requestId": "req_...",
  "success": true
}
```

前端采用 debounce 保存。未登录用户写入 `reading-practice-notes:anonymous:<anonymousId>`；
登录用户写入 `reading-practice-notes:user:<userId>`。登录时，前端调用
`POST /api/auth/sync`，成功后把当前匿名草稿迁移到当前用户 key 并删除匿名副本；
迁移必须只发生在当前 Supabase session 的用户范围内，不能读取或覆盖其他用户的 key。

### 4.5 提交理解题答案

```http
POST /api/reading/materials/:id/attempts
Authorization: Bearer <token>
Idempotency-Key: reading_attempt_<uuid>
```

请求：

```json
{
  "answers": [
    { "questionId": "question-daily-walk-1", "optionIndex": 0 },
    { "questionId": "question-daily-walk-2", "optionIndex": 1 }
  ]
}
```

响应：

```json
{
  "data": {
    "attemptId": "attempt_123",
    "materialId": "rm_123",
    "score": 2,
    "total": 2,
    "answers": [
      {
        "questionId": "question-daily-walk-1",
        "selectedOptionIndex": 0,
        "correct": true,
        "correctOptionIndex": 0
      }
    ],
    "completedAt": "2026-09-04T01:03:00.000Z"
  },
  "requestId": "req_...",
  "success": true
}
```

如果产品要求用户每点击一个选项就立即显示对错，可以增加单题接口；第一阶段建议整组提交，减少请求数量：

```http
POST /api/reading/materials/:id/questions/:questionId/answer
```

### 4.6 查询阅读进度

```http
GET /api/reading/materials/:id/progress
Authorization: Bearer <token>
```

响应：

```json
{
  "data": {
    "materialId": "rm_123",
    "readCompleted": true,
    "vocabularyViewed": true,
    "questionCount": 2,
    "answeredCount": 2,
    "correctCount": 2,
    "notesUpdatedAt": "2026-09-04T01:02:00.000Z",
    "lastOpenedAt": "2026-09-04T01:03:00.000Z"
  },
  "requestId": "req_...",
  "success": true
}
```

### 4.7 可选：材料列表

登录后的阅读工作区需要显示用户以前导入的材料时提供：

```http
GET /api/reading/materials?limit=20&cursor=<cursor>
Authorization: Bearer <token>
```

返回：

```json
{
  "data": {
    "items": [
      {
        "id": "rm_123",
        "title": "my-reading-material",
        "sourceFileName": "my-reading-material.txt",
        "status": "ready",
        "wordCount": 120,
        "updatedAt": "2026-09-04T01:00:00.000Z"
      }
    ],
    "nextCursor": null
  },
  "requestId": "req_...",
  "success": true
}
```

## 5. PDF/DOCX 扩展方案

PDF/DOCX 不应通过浏览器直接把完整文件内容塞进 JSON。建议复用现有语音上传的 signed URL 思路：

```text
POST /api/reading/uploads/upload-url
        -> 返回 private Storage signed upload URL
PUT <signed upload URL>
POST /api/reading/materials
        -> 提交 objectPath、文件名、interfaceLocale
GET /api/reading/materials/:id
        -> 轮询 status: processing | ready | failed
```

扩展请求示例：

```json
{
  "sourceType": "storage_object",
  "objectPath": "reading/user_123/2026/09/material.docx",
  "sourceFileName": "material.docx",
  "contentLanguageCode": "en",
  "interfaceLocale": "zh-CN"
}
```

文件解析、病毒扫描、页数/大小限制和 Storage 权限都由后端负责。文件内容必须存储在 private bucket，不能把 service-role key 暴露给浏览器。

## 6. 朗读与音频

第一阶段无需新增 TTS 接口。前端继续：

```ts
const utterance = new SpeechSynthesisUtterance(articleText);
utterance.lang = "en-US";
window.speechSynthesis.speak(utterance);
```

如果需要统一音色、离线缓存或更稳定的移动端体验，可以增加：

```http
POST /api/reading/materials/:id/audio
Authorization: Bearer <token>
```

请求：

```json
{
  "voice": "default-en-US",
  "rate": 0.88,
  "format": "mp3"
}
```

响应：

```json
{
  "data": {
    "audioUrl": "https://...",
    "expiresAt": "2026-09-04T02:00:00.000Z"
  },
  "requestId": "req_...",
  "success": true
}
```

音频地址应为短期 signed URL。不要把永久公开的用户材料音频 URL 写入响应。

## 7. 前端接入顺序

后端准备完成后，前端按以下顺序替换：

1. 页面加载时请求 `GET /api/reading/lessons/sample`；失败时回退当前静态 `sampleArticle`。
2. 用户导入 `.txt` 后调用 `POST /api/reading/materials`；成功后使用返回的材料、词汇和题目。
3. 词汇页使用后端 `vocabulary`；`word` 和 `example` 保持英文，`meaning` 使用 `interfaceLocale`。
4. 理解题页使用后端 `questions`；提交时调用 `POST /attempts`。
5. 笔记页登录后调用 `PUT /notes`；未登录时继续保存本地草稿。
6. 首次打开用户材料时调用 `GET /materials/:id`，恢复笔记、答题结果和状态。
7. 朗读先继续使用浏览器 API，后续再接可选 TTS。

页面 URL 的 `locale` 是界面语言。例如：

```text
/zh-CN/english-reading-practice
```

前端请求：

```text
GET /api/reading/lessons/sample?interfaceLocale=zh-CN
```

这不代表要把文章翻译成中文；只代表后端返回的动态解释可使用简体中文。

## 8. 数据库建议

建议至少建立以下表：

| 表 | 关键字段 |
| --- | --- |
| `reading_materials` | `id`, `user_id`, `kind`, `title`, `content`, `content_language_code`, `source_file_name`, `status`, `word_count` |
| `reading_vocabulary` | `id`, `material_id`, `word`, `meaning_by_locale`, `example`, `display_order` |
| `reading_questions` | `id`, `material_id`, `prompt`, `options`, `correct_option_index`, `display_order` |
| `reading_notes` | `material_id`, `user_id`, `content`, `updated_at` |
| `reading_attempts` | `id`, `material_id`, `user_id`, `score`, `total`, `completed_at` |
| `reading_answers` | `attempt_id`, `question_id`, `selected_option_index`, `is_correct` |

权限要求：

- `sample` 材料可公开读取；
- `user_text` 只能由所属用户读取、修改；
- 笔记、答题记录只能由所属用户读取；
- 正确答案只在提交答案时由后端计算；
- 所有写入接口支持幂等处理；
- 删除接口若暂不需要可以不实现，前端当前没有删除材料功能。

## 9. 第一阶段交付范围

后端最小可用版本只需实现：

```text
GET  /api/reading/lessons/sample
POST /api/reading/materials
GET  /api/reading/materials/:id
PUT  /api/reading/materials/:id/notes
POST /api/reading/materials/:id/attempts
```

暂不要求：

- PDF/DOCX 上传；
- 后端 TTS；
- AI 动态生成多套题目；
- 材料删除和材料列表；
- 独立的阅读统计报表。

## 10. 验收标准

- 未登录访问示例课程不报错；
- 登录用户导入一个 `.txt` 后，刷新页面仍能恢复文章内容；
- 用户 A 不能读取用户 B 的材料、笔记和答题记录；
- 简体中文、繁体中文、日文、西班牙文等界面语言都能获得对应动态释义；
- 英文文章、英文例句、理解题原文和选项在所有界面语言下完全一致；
- 重复提交相同 `Idempotency-Key` 不会创建重复材料或重复答题记录；
- 处理中的材料可以通过 `GET /materials/:id` 查询状态；
- 所有响应符合统一 envelope，并带 `requestId`；
- 站点 API proxy 的 allowlist 已覆盖上述路径；
- 前端中央服务不可用时仍可回退到当前示例内容和本地笔记体验。
