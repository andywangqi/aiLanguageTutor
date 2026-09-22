# AI Language Tutor 产品与 SEO 功能文档

**版本：** 1.0  
**日期：** 2026-09-22  
**产品：** AI Language Tutor  
**站点：** https://ailanguagetutor.online

## 1. 文档目的

本文将产品功能、用户流程、内容体系和 SEO 规则放在同一份规格中，作为产品、设计、前端、后端和内容团队的共同依据。

本文基于当前代码实现整理。标记为“当前”的内容是仓库中已经存在的能力；标记为“规划”的内容是为了形成完整产品和搜索增长闭环而需要补齐的能力，不代表已经上线。

## 2. 产品定位

AI Language Tutor 是一个以真实对话为核心的语言学习 Web 应用。用户可以先用自己的语言表达想法，再获得目标语言中的自然说法，听取 Tutor 的回复，复述关键句，并继续完成对话。

### 2.1 核心价值

- 降低开口门槛：不会表达时可以先用母语说明意思。
- 训练真实交流：每次练习都围绕一轮一轮的对话，而不是孤立背单词。
- 及时获得帮助：支持翻译、语法、自然表达和发音/复读反馈。
- 形成可复用素材：把有价值的表达保存为学习卡片，之后回看和复习。
- 以场景驱动学习：面试、旅行、IELTS-style speaking 等具体目标均有练习入口。

### 2.2 产品边界

- 这是语言练习工具，不是考试评分、招聘评估或官方 IELTS 产品。
- Tutor 的反馈用于练习和表达改写，不应被宣传为准确的语言等级、考试分数或录用预测。
- 语音能力依赖浏览器麦克风权限及浏览器支持；不支持时必须保留文本练习路径。
- 公开页面负责解释产品和承接搜索流量，登录后的 Workbench 负责完成练习和留存。

## 3. 目标用户与主要任务

| 用户 | 典型问题 | 主要任务 | 首选入口 |
| --- | --- | --- | --- |
| 想开口的初学者 | 知道意思但说不出来 | 用母语求助并得到自然表达 | 首页 -> Say It |
| 有基础但不流利的学习者 | 对话容易中断 | 在 Talk 中连续交流并请求单点帮助 | 首页 -> Talk |
| 出行者 | 不确定如何问时间、价格和方向 | 练习旅行对话和澄清表达 | `/learn/english-travel-conversation` |
| 求职者 | 难以用英语解释经历 | 练习面试问题和追问 | `/learn/english-job-interview` |
| IELTS 备考者 | 缺少口语机会 | 练习原创题目和观点表达 | `/learn/ielts-speaking` |
| 内容搜索用户 | 先想了解方法 | 阅读指南、博客和练习页后注册 | `/learn/*` |

## 4. 信息架构与页面职责

### 4.1 公开页面

| 页面 | 职责 | 主要转化 |
| --- | --- | --- |
| `/` | 英语默认首页，展示核心价值、模式、示例、FAQ 和 CTA | 开始试用、登录 |
| `/{locale}` | 日语、泰语、韩语、简体中文、繁体中文、西班牙语首页 | 本地化注册/试用 |
| `/learn/{slug}` | 练习方法、学习指南、会话主题等常青内容 | 进入 Workbench |
| `/learn/{scenario}` | 面试、旅行、IELTS 等场景落地页 | 带着明确目标开始练习 |
| `/learn/blog` | 博客列表，内容由中央后台提供 | 阅读文章、进入产品 |
| `/learn/blog/{postSlug}` | 博客详情页 | 内容消费、注册、内部链接 |
| `/english-reading-practice` | 英语阅读练习入口 | 开始阅读练习 |
| `/pricing` | 免费试用与 Pro 套餐说明 | 发起结账 |
| `/login` | Google OAuth 登录入口 | 登录并进入 `/app` |
| `/contact`、`/company/*` | 信任、联系和公司信息 | 建立可信度 |
| `/privacy`、`/terms`、`/legal/*` | 合规和 Cookie 说明 | 降低信任阻力 |

### 4.2 登录后页面

| 页面/区域 | 职责 |
| --- | --- |
| `/app` | Workbench 主入口，加载账户、设置、权益、伙伴、最近对话和学习卡片 |
| Home | 新建练习、选择语言/等级/伙伴、查看今日状态 |
| History | 浏览历史对话并继续练习 |
| Cards | 查看、复习和管理已保存的学习卡片 |
| Reading | 阅读材料、词汇和理解练习 |

## 5. 核心用户流程

### 5.1 首次访问到首次练习

1. 用户从首页、场景页或自然搜索结果进入公开页面。
2. 用户选择目标语言或点击主要 CTA。
3. 用户使用 Google 登录；OAuth callback 交换 session，并同步 profile、identity 和默认设置。
4. Workbench 读取语言设置、伙伴和 entitlement。
5. 用户选择 `Say It` 或 `Talk`，创建新对话。
6. 用户发送文本或语音消息，获得 Tutor 回复。
7. 用户可翻译、查看语法、听取音频、请求更自然的表达，或保存学习卡片。

### 5.2 Say It

适合“我知道自己想说什么，但不会用目标语言表达”的场景。

- 用户可以先输入母语想法。
- Tutor 返回可直接使用的目标语言表达，并可以附带后续问题。
- Tutor 句子需要复述时，用户通过浏览器语音识别进行 Repeat Check。
- 通过后才进入下一轮；浏览器不支持语音时，必须显示文本替代路径和明确提示。

### 5.3 Talk

适合连续对话和真实交流节奏训练。

- Tutor 一次回复一个自然的对话轮次。
- 用户可以用文本或语音回答。
- 可在不中断主流程的情况下请求翻译、语法或自然表达帮助。
- 反馈应聚焦一个最有价值的改进点，避免每句话都变成纠错流程。

### 5.4 阅读练习

- 支持样例材料和用户材料。
- 材料包含标题、正文、语言、字数和预计阅读时长。
- 词汇项包含释义、例句、顺序和可选音频。
- 材料状态至少包括 `ready`、`processing`、`failed`。
- 处理失败时应保留重试或回到练习首页的路径。

### 5.5 付费流程

- 当前本地产品目录包含：1 分钟免费介绍性试用、Pro 月付 `$12.99`、Pro 年付 `$79.99`。
- 远端计费配置是最终权威；本地目录只用于初始展示和降级显示。
- 前端结账只提交 `planCode`，服务端返回 `orderId`/checkout URL 后再打开支付。
- 支付返回不能直接视为已付；必须以服务端确认的订单或 entitlement 为准。
- `PAYMENT_PENDING` 时提示用户等待确认，不应重复创建订单。

## 6. 功能规格

### 6.1 账户、设置和权益

- Google OAuth 登录、回调和注销。
- 账户资料：昵称、头像、时区和当前 plan。
- 学习设置：母语、学习语言、等级、Tutor partner。
- 权益字段：是否可开始对话、是否可使用语音、每日消息数、语音秒数、insight 次数和当前周期结束时间。
- 所有受限操作都以服务端 entitlement 为准，客户端只负责展示状态。

### 6.2 Tutor 和对话

- Tutor partner 包含名称、性别、地点、描述、性格、头像和支持模式。
- 对话包含模式、语言、等级、标题、摘要、消息列表和更新时间。
- 消息需要支持幂等客户端 ID，避免网络重试造成重复消息。
- AI 服务暂不可用时，保留已保存消息并显示可重试状态；不得伪装成成功回复。

### 6.3 学习工具

| 工具 | 输入 | 输出 | 目的 |
| --- | --- | --- | --- |
| Translation | 消息或短语 | 翻译文本 | 快速理解含义 |
| Grammar | 消息或短语 | 语法解释/建议 | 理解为什么这样说 |
| Natural expression | 用户想表达的内容 | 更自然的说法 | 直接用于下一轮交流 |
| Pronunciation / Repeat Check | 目标句与识别文本 | score、是否通过、纠正文本 | 训练开口和复述 |
| Audio | Tutor 文本 | 音频 URL | 听力和语音输入 |
| Learning card | 用户选择的表达 | prompt、answer、状态、复习时间 | 沉淀可复习内容 |

### 6.4 可用性与错误处理

- 所有异步操作展示 loading、成功、失败和重试状态。
- 麦克风拒绝、浏览器不支持、AI 超时、权益不足和支付待确认必须分别提示。
- 错误提示不泄露服务端密钥、内部堆栈或供应商敏感信息。
- 关键请求携带 `X-Request-Id`；创建支付和发送消息使用幂等键。
- 文本练习永远是语音失败时的可用降级方案。

## 7. 内容与 SEO 总策略

SEO 的目标不是把登录后的功能页暴露给搜索引擎，而是用真实、有帮助的公开内容覆盖“问题 -> 方法 -> 场景 -> 产品”的路径。

### 7.1 搜索意图分层

| 层级 | 意图 | 页面类型 | 示例主题 |
| --- | --- | --- | --- |
| 认知 | 用户想知道如何学 | 指南/博客 | AI language tutor、英语口语练习方法 |
| 场景 | 用户有明确生活目标 | 场景落地页 | 英语面试、旅行英语、IELTS speaking practice |
| 解决方案 | 用户正在比较工具 | 首页/功能页/定价页 | AI conversation practice、pronunciation practice |
| 转化 | 用户准备开始 | 登录、定价、产品入口 | 免费试用、Pro plan |

### 7.2 关键词原则

- 每个页面只设一个主搜索意图，不堆叠无关关键词。
- 页面标题、H1、首段、内部链接锚文本和正文要表达同一主题。
- 本地化页面必须由目标语言自然改写，不用机器直译的英文关键词硬塞进标题。
- 关键词只用于帮助检索和理解，不替代清晰的产品价值说明。
- 场景页优先覆盖长尾词；首页承接品牌词和泛产品词；博客覆盖问题型和比较型查询。

### 7.3 当前支持的语言

当前 locale 为：`en`、`ja`、`th`、`ko`、`zh-CN`、`zh-TW`、`es`。默认英语使用根路径 `/`，其他语言使用 `/{locale}`。

## 8. 页面级 SEO 规格

### 8.1 首页

- `title` 和 `description` 使用对应语言字典中的 SEO 文案。
- 设置 canonical、所有 locale 的 hreflang 和 `x-default` 英语地址。
- Open Graph 和 Twitter 使用同一语言的标题、描述和 canonical。
- 当前首页输出 `SoftwareApplication`、`FAQPage`、`Organization`、`WebSite` JSON-LD。
- 首页 H1 应直接说明产品或核心结果；首屏 CTA 指向登录/开始练习。
- FAQ 内容必须在页面可见区域真实出现，不能只为结构化数据生成隐藏内容。

### 8.2 功能与内容页

- 使用 `createLocalizedPageMetadata(locale, path, title, description)` 生成 metadata。
- 每页必须有唯一 title、description、canonical、hreflang、Open Graph 和 robots 指令。
- H1、lead、更新时间和正文由对应语言字典或内容数据提供。
- 页面至少包含一个指向相关练习或 Workbench 的内部 CTA。
- 场景页应链接到相邻主题、定价页和产品入口，形成可爬取的主题集群。

### 8.3 博客

- 博客列表和详情从中央博客接口读取，按 locale 请求内容。
- 使用文章的 `seo.title`、`seo.description`；没有专属 SEO 字段时回退到标题和摘要。
- 文章详情应使用真实的 `publishedAt`/`updatedAt`、作者、阅读时长、目录和相关文章。
- 规划增加 `Article` 或 `BlogPosting` JSON-LD，且只输出页面实际存在的作者、日期和图片。
- 文章不可用时返回可索引的 404 页面，不生成空壳内容。

### 8.4 场景页

当前场景包括英语面试、旅行对话和 IELTS-style speaking。每个场景页应包含场景定义、适用人群、Tutor prompt、典型问题、参考表达、常见误区、推荐练习流程、FAQ 和 Workbench CTA。

规划为场景页增加 `FAQPage`（仅当 FAQ 在页面真实展示）和 `HowTo`（仅当步骤足够具体且页面真实展示）。

### 8.5 登录后页面

- `/app`、历史、学习卡片和用户数据页不应作为 SEO 着陆页。
- 规划统一 `noindex, nofollow` 或至少 `noindex`，避免索引个性化内容、空状态和登录重定向。
- SEO 价值应由公开的 practice guide、场景页、功能页承接。

## 9. 技术 SEO 规则

### 9.1 URL 和 canonical

- 使用小写、稳定、可读的 slug；场景 slug 不因文案改动而随意变化。
- `NEXT_PUBLIC_SITE_URL` 是 canonical、hreflang、sitemap 和 JSON-LD 的站点根地址；缺失时当前实现回退到正式域名。
- 默认英语首页 canonical 为 `/`；其他语言 canonical 为 `/{locale}`。
- 同一内容的语言版本必须互相列入 hreflang，并提供 `x-default`。
- 根路径与 `/{locale}` 的重复页面必须保持明确的 canonical 关系，不能让两份内容互相竞争。

### 9.2 Sitemap

- 当前 sitemap 覆盖首页、定价、阅读练习、内容页、博客、信息页和场景页。
- 博客 `lastModified` 优先使用 `updatedAt`，其次使用 `publishedAt`。
- 新增公开、可索引页面时必须同步加入 sitemap 和页面级 metadata。
- 需要修正当前场景 sitemap 的语言覆盖：现有场景条目使用根路径 `/learn/{slug}`，应确认是否需要为每个 locale 生成 `/{locale}/learn/{slug}`，并与实际路由保持一致。
- 不将登录后页面、API、错误页和空内容页加入 sitemap。

### 9.3 Robots、索引和渲染

- 当前 robots 允许公开路径抓取并指向 `/sitemap.xml`。
- robots 不是访问控制；私密数据仍必须由认证和服务端权限保护。
- 生产环境检查 canonical、hreflang、JSON-LD、sitemap URL 是否使用生产域名，而不是 preview 域名。
- 页面必须在无客户端交互时仍输出主要标题、正文和 CTA，保证搜索引擎和无障碍工具可读取。

### 9.4 结构化数据

当前：`SoftwareApplication`、`FAQPage`、`Organization`、`WebSite`。  
规划：场景页 `FAQPage`/`HowTo`、博客 `BlogPosting`、BreadcrumbList。

结构化数据规则：

- 只输出页面可见且事实准确的内容。
- 价格、试用时长和产品功能必须与远端计费/产品实际状态一致。
- 不使用虚假评分、评论、排名、考试认证或官方背书字段。
- 上线后用 Google Rich Results Test 和 Schema Markup Validator 检查。

## 10. 内容生产规范

### 10.1 场景页模板

1. H1：场景 + 用户结果。
2. 简短说明：适用人群和产品边界。
3. “你会练习什么”：问题、表达和追问。
4. 示例练习：真实可复用的 Tutor prompt。
5. 常见误区：避免夸大产品效果。
6. 推荐流程：母语起草 -> Say It -> Repeat -> Talk -> 保存卡片。
7. FAQ：解决搜索用户的具体疑问。
8. CTA：进入对应模式或开始免费试用。

### 10.2 博客模板

- 一个明确的问题型标题。
- 开头直接给出读者要解决的问题。
- 使用可朗读、可复用的句子示例，而非泛泛介绍。
- 至少一个链接到相关场景页、一个链接到指南页、一个链接到 Workbench/定价页。
- 文章结尾给出下一步练习，而不是只留下营销 CTA。
- 标注更新时间；内容变化较大时更新 `updatedAt`。

### 10.3 多语言内容

- 翻译后由母语编辑检查自然度、礼貌程度和搜索表达习惯。
- 每种语言维护自己的 title、description、FAQ 和 CTA，不只替换几个词。
- locale 版本缺少高质量内容时，应回退到安全的页面策略，而不是生成低质量薄内容。

## 11. 数据、埋点与增长指标

### 11.1 产品核心指标

- 首次练习启动率、首次有效回复率、练习完成率和 D1/D7 留存。
- 学习卡片保存率和复习率。
- 语音使用率、Repeat Check 通过率和失败原因。
- 试用到付费转化率、支付待确认率和退款/取消率。

### 11.2 SEO 核心指标

- 按 locale 的自然曝光、点击、CTR 和平均排名。
- 首页、场景页、指南页和博客的自然注册转化率。
- 搜索入口到首次练习启动的转化率。
- 已收录页面数、索引覆盖问题、重复 canonical 数量。
- Core Web Vitals、移动端性能、404 和抓取错误。
- 各语言页面的内容覆盖率和 hreflang 错误率。

### 11.3 建议事件

事件应包含 `locale`、`path`、匿名 session 标识、用户状态和必要的 `requestId`，不得采集消息原文、语音内容或敏感个人信息。

建议事件：`page_view`、`cta_clicked`、`auth_started`、`auth_completed`、`conversation_started`、`message_sent`、`tutor_reply_received`、`learning_tool_used`、`repeat_check_passed`、`repeat_check_failed`、`learning_card_saved`、`reading_started`、`reading_completed`、`pricing_viewed`、`checkout_started`、`payment_confirmed`。

## 12. 安全、隐私和合规要求

- 浏览器只允许使用公开的 central endpoint 和 analytics write key；Supabase service role、OpenAI、Waffo 和 central server key 只能在服务端。
- 对话文本、语音、翻译结果和学习卡片属于用户学习数据，日志中默认脱敏。
- SEO 内容不得展示真实用户对话、邮箱、语音或个性化数据。
- 隐私、条款和 Cookie 页面必须保持可访问，并从页脚和相关表单可达。
- 删除账户、删除对话和数据保留策略应与中央后台、Supabase 和存储层保持一致。

## 13. 上线验收清单

### 产品

- [ ] 未登录用户能从首页进入登录，登录后能到达 Workbench。
- [ ] 首次设置能保存母语、学习语言、等级和 Tutor partner。
- [ ] Say It 和 Talk 均能创建对话、发送消息并处理失败重试。
- [ ] 文本、语音、翻译、语法、音频、Repeat Check 和学习卡片的状态完整。
- [ ] entitlement 限制在服务端生效，前端不自行授予权益。
- [ ] 支付以订单/entitlement 确认结果为准，待确认状态可恢复。
- [ ] 阅读材料 processing/failed 状态有用户可理解的处理路径。

### SEO

- [ ] 每个公开页面有唯一 title、description、H1、canonical 和 hreflang。
- [ ] 多语言页面互相引用且 `x-default` 指向英语默认页面。
- [ ] sitemap 只包含公开、可索引、返回 200 的页面。
- [ ] 场景 sitemap 与实际 locale 路由一致。
- [ ] `/app` 和个性化页面不会被搜索引擎索引。
- [ ] JSON-LD 与页面可见内容一致，无虚假评价或官方背书。
- [ ] 博客文章具备真实发布时间、更新时间和文章结构化数据（上线规划完成后）。
- [ ] 移动端、无 JS 首屏和分享卡片均能正确显示。
- [ ] Google Search Console、Bing Webmaster Tools、Rich Results Test 和 Lighthouse 检查通过。

## 14. 优先级路线图

### P0：当前产品闭环

- 稳定登录、语言设置、Workbench、Say It/Talk、文本消息和错误处理。
- 校验计费确认、权益限制和语音降级路径。
- 修正 sitemap 场景 URL 与实际多语言路由的关系。
- 为登录后页面设置明确的 noindex 策略。

### P1：SEO 与留存增强

- 为场景页补齐页面级 FAQ/HowTo（仅输出真实可见内容）。
- 为博客详情页增加 BlogPosting、BreadcrumbList 和相关文章内链。
- 建立 Search Console 与产品埋点的页面到注册、首次练习归因。
- 补充阅读练习的公开介绍页和高质量语言版本。

### P2：内容规模化

- 建立按 locale 管理的关键词、内容 brief、审核和更新流程。
- 围绕工作、旅行、日常社交、发音和考试准备扩展场景集群。
- 根据自然搜索和产品行为数据更新 prompt、FAQ 和内部链接。
- 建立薄内容、重复内容、过期内容和低转化页面的下线机制。
