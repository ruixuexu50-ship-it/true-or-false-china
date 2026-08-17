# PROJECT MAP — 目标架构

> 这份文件描述**目标状态**，不是当前状态。以仓库源码与测试为准。
> 目标状态由 PHASE 3–11 逐步落地，每一步都有代码和测试。
> **本文件不描述任何尚未打算实现的东西。** 不写愿景，只写这次要做到的边界。

核心原则：**Stable substrate, expressive surface.**
底层规则逐渐稳定，上层表达继续高度自由。substrate 的职责是让**身份稳定、事实唯一、错误可见** —— 不是让创作变得整齐。

---

## 1. 六层结构

```
┌─────────────────────────────────────────────────────────────┐
│ L6  DISTRIBUTION            发布 / 路由 / 反馈 / analytics   │
│     src/pages/**, src/lib/release/, feedback, analytics      │
├─────────────────────────────────────────────────────────────┤
│ L5  EXPERIENCE              界面表达 / 交互 / 规则           │
│     src/components/**, src/layouts/**, src/lib/rules/        │
├─────────────────────────────────────────────────────────────┤
│ L4  DESIGN CONTROLS         全站视觉控制项                    │
│     src/styles/design-controls.css                          │
├─────────────────────────────────────────────────────────────┤
│ L3  TOPIC CONTENT           内容事实（唯一来源）              │
│     content/topics/**/topic.json + src/content/registry      │
├─────────────────────────────────────────────────────────────┤
│ L2  PLATFORM CONTRACTS      契约与校验                        │
│     src/lib/contracts/**                                     │
├─────────────────────────────────────────────────────────────┤
│ L1  INFRASTRUCTURE          构建与语言配置                    │
│     package.json, astro.config.mjs, tsconfig.json            │
└─────────────────────────────────────────────────────────────┘
```

### 依赖方向：只允许向下

| 层 | 允许依赖 | 禁止依赖 |
|---|---|---|
| L6 Distribution | L2, L3, L4, L5 | — |
| L5 Experience | L2（type）, L4 | **L3（禁止直接 import 内容）**, L6 |
| L4 Design Controls | 无 | 全部 |
| L3 Topic Content | L2 | L4, L5, L6 |
| L2 Contracts | 无 | 全部 |
| L1 Infrastructure | 无 | 全部 |

**最重要的一条禁令：L5 不得 import L3。**

Experience 组件只能通过 **props** 接收内容。这是"UI 里不许存放事实"（`PROTOTYPE-ASSUMPTIONS.md` A6/A7/A8）的机器可执行版本 —— 组件在物理上无法访问内容层，就不可能在里面硬编码事实。

这条由测试强制：扫描 `src/components/` 下所有文件，任何指向 `content/` 或 `src/content/` 的 import 一律测试失败。

---

## 2. 每一层的职责与边界

### L1 — Infrastructure

| 内容 | 说明 |
|---|---|
| `package.json` | 依赖与 scripts。保持 Astro static + Node 内置 test runner，不引入新框架 |
| `astro.config.mjs` | `output: "static"`、`trailingSlash: "always"` —— **不改** |
| `tsconfig.json` | strict、`verbatimModuleSyntax`；PHASE 5 需确认 `resolveJsonModule` |

**明确不做**：不加打包器插件、不加 CSS 框架、不加测试框架、不加 SSR、不加 adapter。

### L2 — Platform Contracts

契约层定义"什么样的数据允许进入系统"，并提供**运行时校验函数**。

| 文件（目标） | 职责 |
|---|---|
| `src/lib/contracts/topic-package.ts` | Topic Package Contract v1 的类型与 `validateTopicPackage()` |
| `src/lib/contracts/release.ts` | `RELEASE_STATES` 与 release 决策类型 |
| `src/lib/contracts/experience.ts` | `experienceImplementationId` 的类型与注册契约 |

**硬要求**：契约必须在 **build 时对全部内容执行**（修复 A16）。类型检查不算执行；只有被调用的校验函数才算。

**明确不做**：不引入 zod / io-ts 等校验库。手写校验函数已经存在且够用，加依赖只会扩大 substrate。

### L3 — Topic Content

**唯一的事实来源（Single Source of Substantive Truth）。**

```
content/topics/
  qr-payment-stack/
    topic.json          ← 一个完整的 Topic Package
  chinamaxxing-inference/
    topic.json
```

| 归属 L3 的东西（内容事实） | 不归属 L3 的东西 |
|---|---|
| 核心判断（core judgment）、结论句 | 页面布局、组件结构 |
| claims 及其证据状态 | 颜色、字体、动效 |
| sources（来源）与 claim→source 引用 | 首页展示哪几篇（属 L6 editorial） |
| counterexamples（反例） | Experience 的视觉设计 |
| unknowns（明示未知） | URL 结构 |
| 分享文案、CTA 文字（这些是内容措辞） | 按钮长什么样 |
| revisions（修订历史） | — |

**目录名是表达，`topicId` 是身份。** 目录可以改名（方便人阅读），身份不变。

**为什么用 JSON 而不是 TypeScript**：内容是数据，不是代码。JSON 无法夹带逻辑，因此"content-studio 交付 → 网站消费"这条边界在物理上成立。详见 `DECISIONS.md` D-003。

`src/content/topic-registry.ts` 是**显式**注册入口：逐个 import JSON、逐个跑契约校验、导出只读集合。没有目录自动扫描 —— 加内容必须显式登记，这是有意的摩擦。

### L4 — Design Controls

单一入口：`src/styles/design-controls.css`，被 `SiteLayout.astro` 导入。

集中**且仅集中**这些控制项：

```
字体族（正文 / 标题）
颜色（ink / 背景 / 主色 / 强调色若干）
间距刻度（spacing scale）
最大宽度（content max-width）
边框（宽度 / 样式）
阴影
动效时长与缓动
```

**明确不做**（这是 CREATIVE FREEDOM 区域，工程不得收紧）：
- 不建设计系统，不建组件库
- 不强制所有样式必须使用 token
- 不禁止组件内自定义样式
- 不规定每篇 Topic 必须声明完整视觉配置

L4 的目的只有一个：**让"我想统一调整全站观感"有一个入口。** 不是给创作加锁。

### L5 — Experience

界面表达与交互规则。**自由度最高的一层。**

| 子部分 | 文件 | 职责 |
|---|---|---|
| 规则（rules） | `src/lib/qr-diagnosis.ts`、`inference-test.ts`、`interaction-state.ts` | 纯函数、零 UI 依赖、可独立测试。**当前已经是干净的，保留不动** |
| Experience 组件 | `src/components/experiences/**` | 渲染交互。**通过 props 接收内容，不得 import 内容层** |
| Experience 注册表 | `src/components/experiences/registry.ts` | `experienceImplementationId → component`。**不再 keyed by slug** |
| 页面骨架 | `src/components/TopicShell.astro` | 只负责布局与结构，**不知道任何具体内容**。所有 `topic.slug === "..."` 判断消失 |
| 布局 | `src/layouts/SiteLayout.astro` | `<html>`、导入 L4、a11y 基线 |
| 首页 / Explore | `src/components/home/**`、explore 相关 | 视觉完全自由；只固定"数据从哪来" |

**一个 Experience 实现可被多个 Topic 使用** —— 这是 registry 改用稳定 ID 之后自然获得的能力。

**明确不做**：不建 `UniversalTopicPage`、不建 `UniversalExperience`、不建"配置驱动的通用渲染器"。每个 Experience 可以是完全定制的手写界面。**万能页面会把 expressive surface 压成模板，这是本次重建明确禁止的方向。**

### L6 — Distribution

| 子部分 | 文件（目标） | 职责 |
|---|---|---|
| 路由 | `src/pages/**` | route 定义、`getStaticPaths()`、组装 props |
| Editorial 决策 | `src/config/site-editorial.ts` | `featuredTopicIds`（首页展示哪几篇）等**网站侧编辑决策** |
| Release | `src/lib/release/**`（现 `release-guard.ts`） | 哪些内容允许公开 |
| Review | `src/data/owner-review.ts` 拆分后 | 结构页 review 与内容 review 分离 |
| Feedback | `src/components/FeedbackForm.astro`、`src/lib/feedback.ts` | 必须诚实声明是否真的发送 |
| Analytics | `src/lib/analytics*.ts`、`AnalyticsBridge.astro` | shell-only、opt-in、默认 no-op。**当前已正确，保留** |

**关键区分**：Topic Package 由内容侧拥有（未来由 content-studio 交付）；**"首页展示哪几篇"是网站侧的编辑决策**，属于 L6，不属于 L3。同一批内容，不同网站可以有不同的展示选择。

---

## 3. 三种身份，互不混用

当前系统崩坏的根源是**用一样东西承担了三种身份**。目标架构严格区分：

| 身份 | 属于 | 稳定性 | 用途 | 举例 |
|---|---|---|---|---|
| `topicId` | 内容 | **永不改变** | 所有跨层引用 | `9f2c...`（UUID v4） |
| `slug` | URL 表达 | 可自由改 | 只决定 URL | `qr-payment-stack` |
| `experienceImplementationId` | 代码实现 | 稳定，可版本化 | registry 查表 | `qr-route-diagnosis-v1` |

改 slug **只影响 URL**。改标题**只影响显示**。改数组顺序**没有任何语义**。

这是 "stable substrate, expressive surface" 第一次真正成立的地方。

---

## 4. 数据流（目标）

### build 时

```
content/topics/*/topic.json          ← 内容事实（JSON，纯数据）
        │
        ▼
src/content/topic-registry.ts        ← 显式 import + 逐个 validateTopicPackage()
        │                               不合契约 → build 立即失败（LOUD）
        │
        ├──────────────────────────────────────────────┐
        ▼                                              ▼
src/lib/release/plan.ts                    src/config/site-editorial.ts
  决定哪些 Topic 允许成页                     featuredTopicIds（首页显式选择）
        │                                              │
        ▼                                              ▼
src/pages/topics/[slug].astro              src/pages/index.astro
  getStaticPaths ← releasePlan                只渲染 featuredTopicIds 指向的内容
  registry[topic.experienceImplementationId]   引用不存在的 id → build 失败
        │                                              │
        ▼                                              ▼
  TopicShell（不知内容） + Experience（props 接收内容）
        │
        ▼
      dist/**.html
```

### 访客浏览器里

```
静态 HTML → DOM → client script
                    │
                    └─→ import src/lib/ 的规则模块（qr-diagnosis / inference-test / interaction-state）
                        点击 → 更新 state → 改 DOM
                        全程不联网、无 API、无数据库
```

---

## 5. "我要改 X，该动哪里"

这张表是这份架构对日常工作的实际价值。

| 我想做的事 | 改哪里 | 不用碰 |
|---|---|---|
| 修正一句论断 / 加一条来源 | `content/topics/<dir>/topic.json` | 任何 UI 代码 |
| 加第三篇 Topic | 新建 `topic.json` + 在 `topic-registry.ts` 登记 + 在 `site-editorial.ts` 决定是否上首页 | release guard、TopicShell、explore 筛选器（这些会自动适应） |
| 改某篇的 URL | 改 `topic.json` 的 `slug` | 其它全部（registry / 样式 / review 都不受影响） |
| 改某篇标题 | 改 `topic.json` 的 title | 其它全部 |
| 给某篇做全新交互 | 新建 Experience 组件 + 在 `registry.ts` 登记新 `experienceImplementationId` + 在 `topic.json` 指向它 | 内容事实、其它 Topic |
| 让两篇共用一个交互 | 两个 `topic.json` 指向同一个 `experienceImplementationId` | 组件代码 |
| 统一调整全站观感 | `src/styles/design-controls.css` | 各组件 |
| 改某篇独有的视觉 | 该 Experience 组件的 `<style>` | 全局样式 |
| 改首页展示哪几篇 | `src/config/site-editorial.ts` | 内容、数组顺序 |
| 改发布门槛 | `src/lib/release/**` | 内容 |
| 改某个页面的 owner 审阅说明 | 结构页 → review 配置；内容 → `topic.json` | 页面代码 |

---

## 6. 失败必须是响亮的（LOUD）

目标架构的一条通用规则：**宁可 build 失败，也不要静默显示错误内容。**

当前系统里"查不到就用默认值"的地方（A5 owner review、A9 registry、A14）一律改为"查不到就 throw"。

build 必须在以下情况**立即失败**：

| 情况 | 原因 |
|---|---|
| Topic Package 不满足契约 | 修复 A16 |
| `topicId` 重复 | 身份必须唯一 |
| `slug` 重复 | URL 必须唯一 |
| `claim.sourceIds` 指向不存在的 source | 证据链必须完整 |
| `experienceImplementationId` 在 registry 中不存在 | 修复 A9/A10 |
| `featuredTopicIds` 指向不存在的 `topicId` | 修复 A4 |
| 内容 review 元信息解析不到 | 修复 A5/A14 |
| public build 中存在未 approved 的内容 | 保留原 guard 的真实意图 |
| Experience 组件 import 了内容层 | 保证 L5 ↛ L3（由测试执行） |

---

## 7. 明确不做的事（DEFERRED，且不得偷偷开始）

- CMS、database、后端服务、API
- auth、accounts、用户系统、CRM
- 自建 analytics 平台
- sound engine、game engine
- `UniversalTopicPage` / `UniversalExperience` / 配置驱动的通用页面渲染器
- 目录自动扫描注册内容（必须显式登记）
- 设计系统 / 组件库 / CSS 框架
- 校验库依赖（zod 等）
- SSR / adapter / 服务端渲染

**"为将来做准备"是这些能力偷偷进入系统的常见借口。** 需要时再做，届时有真实需求可以判断。

---

## 8. Content System 与 Website 的边界

原则：**Content System 拥有 Topic 身份，Website 消费身份。**

| 未来（content-studio 存在时） | 现在（PHASE 5 落地的） |
|---|---|
| content-studio 生成 versioned Topic Package | 手写 `topic.json`，格式已符合 Package Contract v1 |
| 人工复制 package 到 website | 同一个仓库内，但内容与代码目录分离 |
| website 通过显式 registry 接入 | `src/content/topic-registry.ts` 显式 import |
| build 时校验 package | `validateTopicPackage()` 在 build 时执行 |

**现在就把格式和边界定好，将来接 content-studio 不需要改架构。** 但 content-studio 本身不在本次范围内 —— 不为它写任何脚手架、不建同步机制、不建版本比对工具。

---

## 9. 落地顺序

| Phase | 动作 | 修复的假设 |
|---|---|---|
| 3 | 先写 P0 测试（含"第三篇 Topic 可加入"） | A17, A18, A19 |
| 4 | Stable Topic Identity（`topicId`） | **A3（地基）** |
| 5 | Topic Package Contract v1 + 单一事实来源 + 契约接线 | A2, A6, A7, A8, A16 |
| 6 | Experience Registry 改用稳定 ID | A9, A10 |
| 7 | 移除 exactly-two | A1 |
| 8 | 显式 featured 选择 + 派生 taxonomy | A4, A11, A12, A13, A15 |
| 9 | Layered review / release 分层 | A5, A14, A26 |
| 10 | Feedback / Analytics 诚实性固化 | A24, A25 |
| 11 | Design Controls 集中 | A20, A21 |
| 12 | AGENTS.md / Feature Cards / CHANGE-GUIDE | A22, A23（标注） |
| 13 | 完整验证 + Migration Report | — |
