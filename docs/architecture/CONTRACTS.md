# CONTRACTS — 契约规格

> 契约 = **跨层的强制约定**。不满足契约的数据不允许进入系统，build 必须失败。
> 本文件定义目标契约。落地见 PHASE 4–9。
> 三类规则的区分（**这是本文件最重要的结构**）：
>
> | 类别 | 含义 | 强制方式 |
> |---|---|---|
> | **MACHINE-ENFORCEABLE** | 机器可判定的对错 | 代码校验 + build 失败 + 测试 |
> | **HUMAN-JUDGMENT-GATED** | 需要人判断，但必须留下显式记录 | 字段必填 + 人工填写；机器只检查"有没有填"，不判断"填得对不对" |
> | **CREATIVE FREEDOM** | 不受契约约束 | **禁止**加校验 |

---

## 0. 一个真实的反面例证（为什么契约必须接线）

审计中发现的**当前就存在的引用断裂**：

`src/data/topics.ts` 中

```ts
judgment.evidence: ["S01", "S02", "S03", "S04"]        // 大写
judgment.evidence: ["S01", "S02", "S03", "S04", "R00"] // 大写 + R00
```

而实际的 source id 是：

```ts
sources: [{ id: "s01", ... }, { id: "s02", ... }, ...]  // 小写
```

因此：

- **全部 8 个 evidence 引用都是悬空的**（大小写不匹配）
- `"R00"` **在整个仓库里不存在任何对应对象**

而 `src/lib/contracts.ts` 对 `evidence` 的处理只有两处：第 14 行类型声明 `evidence: string[]`，第 192 行检查该字段**存在**。**从未校验引用是否指向真实 source。**

这就是 `PROTOTYPE-ASSUMPTIONS.md` A16 的实证：**契约写了 365 行，但因为没有接线，一个"每条判断都有证据支撑"的网站，其证据链实际上是断的，而且没人发现。**

一个以诚实和证据为核心卖点的网站，出现悬空的证据引用，是实质性的可信度问题 —— 不是代码洁癖问题。

**结论：referential integrity 必须是 MACHINE-ENFORCEABLE，且必须在 build 时执行。**

---

## 1. Topic Package Contract v1

### 1.1 定位

| 属性 | 值 |
|---|---|
| 名称 | Topic Package Contract v1 |
| 载体 | `content/topics/<dir>/topic.json` |
| 格式 | JSON（纯数据，不可含逻辑） |
| 校验函数 | `validateTopicPackage(value: unknown): TopicPackage`（`src/lib/contracts/topic-package.ts`） |
| 执行时机 | **build 时，对全部 package 逐个执行** |
| 失败行为 | `throw` → build 中断（LOUD） |
| 未来来源 | content-studio 生成并人工复制；现阶段手写 |

### 1.2 顶层字段

```jsonc
{
  // ── 契约与身份（MACHINE-ENFORCEABLE）───────────────────────
  "contractVersion": 1,              // 必须等于 1
  "topicId": "…uuid-v4…",            // 永不改变；全局唯一
  "packageVersion": 3,               // 整数，内容每次实质修改递增

  // ── URL 与展示表达（可自由改）──────────────────────────────
  "slug": "qr-payment-stack",        // 只决定 URL；全局唯一
  "category": "Everyday systems",    // 自由字符串；taxonomy 从内容派生
  "eyebrow": "EVERYDAY SYSTEMS / CHINA",
  "openingQuestion": "…",
  "deck": "…",
  "effort": "60 seconds",
  "searchTerms": ["payment", "QR"],

  // ── 内容事实（Single Source of Substantive Truth）──────────
  "coreJudgmentLine": "The QR is not the payment.",   // ← 从 TopicShell 迁入
  "workingAnswer": "…",
  "shareText": "…",                                   // ← 从 TopicShell 迁入
  "primaryActionLabel": "Diagnose my route",          // ← 从 TopicShell 迁入
  "boundaryHeading": "…",
  "boundaryCopy": "…",

  "judgment": { /* §1.3 */ },
  "claims": [ /* §1.4，从 ChinamaxxingExperience 迁入 */ ],
  "framings": [ /* §1.5，从 ChinamaxxingExperience 迁入 */ ],
  "answerLayers": [ /* §1.6 */ ],
  "explanation": ["…"],
  "counterexamples": [{ "title": "…", "body": "…" }],
  "sources": [ /* §1.7 */ ],
  "relatedRabbitHoles": [{ "id": "…", "label": "…", "href": "/explore/#…" }],
  "sourceIntro": "…",
  "relatedIntro": "…",

  // ── 实现绑定（MACHINE-ENFORCEABLE）─────────────────────────
  "experienceImplementationId": "qr-route-diagnosis-v1",

  // ── 表达配置（CREATIVE FREEDOM，可选）─────────────────────
  "presentation": { /* §1.9 */ },

  // ── 审阅与发布（HUMAN-JUDGMENT-GATED）─────────────────────
  "review": { /* §1.8 */ },
  "revisions": [{ "version": 1, "date": "2026-08-13", "note": "…" }]
}
```

### 1.3 `judgment`（保留现有结构，修正引用）

```jsonc
"judgment": {
  "recommendation": "…",        // 必填
  "importance": "…",            // 必填
  "audienceSignal": ["…"],      // 至少 1 条
  "evidenceSourceIds": ["s01", "s02"],   // ← 改名 + 强制引用完整性
  "counterSignal": ["…"],       // 至少 1 条 —— 反面信号必填是有意的
  "unknowns": ["…"],            // 至少 1 条 —— 明示未知必填是有意的
  "webPayoff": "…",
  "nextTest": "…"
}
```

**`evidence` → `evidenceSourceIds` 改名的理由**：旧名字掩盖了"这是引用而不是自由文本"这一事实，正是大小写错配没被发现的原因之一。新名字让"必须指向 source"在字段名上就显而易见。

**`counterSignal` 与 `unknowns` 必填**（`minItems: 1`）—— 机器无法判断内容质量，但可以强制"你必须写出反面信号和未知"。这是把编辑纪律做成 MACHINE-ENFORCEABLE 的最有效方式。

### 1.4 `claims`（从 UI 迁入，A7）

```jsonc
"claims": [
  {
    "claimId": "c01",                    // package 内唯一
    "text": "…",
    "evidenceStatus": "supported-by-observation",
    // 枚举：supported-by-observation | inference | contested | unknown
    "sourceIds": ["s01"],                // 引用完整性强制
    "note": "…"                          // 可选
  }
]
```

`evidenceStatus` 用**受控枚举**而非自由文本 —— 原来在 UI 里是显示字符串（`SUPPORTED BY OBSERVATION`），改为语义值后，"怎么显示"归 L5，"是什么状态"归 L3。

**关键约束：`evidenceStatus` 不为 `unknown` 时，`sourceIds` 必须非空。** 声称有观察支撑却不给来源，是机器可以抓住的不诚实。

### 1.5 `framings`（从 UI 迁入，A7）

```jsonc
"framings": [
  {
    "framingId": "projection",
    "label": "…",
    "body": "…",
    "boundary": "…"      // 必填 —— 每种解读框架必须声明自己的边界
  }
]
```

`boundary` 必填是有意的：这些 framing 是对同一现象的不同解读，**不声明边界的解读就是越界的解读**。

### 1.6 `answerLayers`

```jsonc
"answerLayers": [
  { "id": "funding", "prompt": "…", "payoff": "…" }
]
```
id 在 package 内唯一；至少 1 层。

### 1.7 `sources`

```jsonc
"sources": [
  {
    "id": "s01",                  // package 内唯一，**大小写敏感**
    "title": "…",
    "url": "https://…",           // 必须 http/https
    "role": "…"                   // 必填：这条来源支撑什么
  }
]
```

`role` 必填 —— 罗列链接不等于给出证据，必须说明它支撑什么。

### 1.8 `review`（HUMAN-JUDGMENT-GATED）

```jsonc
"review": {
  "releaseState": "locally-reviewed",
  // 枚举：draft | locally-reviewed | approved | published

  "contentApproval":  { "state": "pending", "by": null, "date": null, "note": "…" },
  "siteEditorial":    { "state": "pending", "by": null, "date": null, "note": "…" },
  "visual":           { "state": "pending", "by": null, "date": null, "note": "…" },
  "assetRights":      { "state": "pending", "by": null, "date": null, "note": "…" },

  "ownerNotesZh": {                 // ← 从 owner-review.ts 迁入（A14）
    "titleZh": "…", "literalZh": "…", "intentZh": "…", "changeHintZh": "…"
  },

  "fixture": {                      // 可选，标注为虚构示例
    "fixtureId": "DEMO-01",
    "fictional": true,
    "publicBlockers": [{ "id": "B01", "label": "…" }]
  }
}
```

**Layered Review 的五层**：Content Approval / Site Editorial / Visual / Asset Rights / Release State。

机器**只检查**：字段存在、枚举合法、`approved` 状态必须有 `by` 与 `date`、`releaseState` 为 `approved`/`published` 时四层子审阅不得有 `pending`、存在 `publicBlockers` 时不得 `approved`。

机器**绝不判断**内容对不对、判断准不准、视觉好不好 —— 那是人的工作。

### 1.9 `presentation`（CREATIVE FREEDOM）

```jsonc
"presentation": {
  "visualVariant": "route-diagnosis",   // 可选，替代用 slug 拼 CSS class（A20）
  "palette":  { "background": "…", "ink": "…", "accent": "…" },
  "character": { "id": "…", "name": "…", "description": "…", "original": true },
  "visualStates": [{ "id": "…", "label": "…" }],
  "motionLogic": "…"
}
```

**整个 `presentation` 对象可选。缺失时组件用 L4 的全站默认值。**

- ✅ 机器只校验：若提供 `palette`，颜色必须是合法 CSS 颜色值；若提供 `character` 且 `original: true`，必须有 `name` 与 `description`（资产权利需要可追溯）
- ❌ 机器**不校验**：配色好不好看、状态够不够、动效合不合理
- ❌ **不得**要求每篇 Topic 必须提供完整 presentation（这会把 expressive surface 变成 substrate，违反核心原则）

**注意**：现有 `contracts.ts` 的 `validateTopicPage` 强制 `visualStates` 必须 2–4 个（测试 `contracts.test.mjs:35` 断言错误信息 `/2–4 visual states/`）。**这条约束应当移除** —— "一个交互该有几个视觉状态"是设计判断，不是数据完整性问题。详见 `DECISIONS.md` D-006。

---

## 2. MACHINE-ENFORCEABLE 规则全表

build 时必须执行、失败即中断：

### 2.1 身份唯一性

| # | 规则 |
|---|---|
| M1 | `topicId` 必须是合法 UUID v4 格式 |
| M2 | 所有已注册 Topic 的 `topicId` 唯一 |
| M3 | 所有已注册 Topic 的 `slug` 唯一 |
| M4 | `slug` 只含小写字母、数字、连字符 |
| M5 | `contractVersion` 必须等于 `1` |

### 2.2 引用完整性（referential integrity）

| # | 规则 | 修复 |
|---|---|---|
| M6 | `sources[].id` 在 package 内唯一 | — |
| M7 | `judgment.evidenceSourceIds` 每一项必须存在于 `sources` | **§0 的真实 bug** |
| M8 | `claims[].sourceIds` 每一项必须存在于 `sources` | A7 |
| M9 | `evidenceStatus !== "unknown"` 时 `sourceIds` 非空 | — |
| M10 | `claims[].claimId` 在 package 内唯一 | — |
| M11 | `framings[].framingId` 在 package 内唯一 | — |
| M12 | `answerLayers[].id` 在 package 内唯一 | — |
| M13 | `experienceImplementationId` 必须存在于 experience registry | A9/A10 |
| M14 | `featuredTopicIds` 每一项必须存在于已注册 Topic | A4 |

**引用比较大小写敏感** —— §0 的 bug 正是"以为不敏感"造成的。

### 2.3 必填与非空

| # | 规则 |
|---|---|
| M15 | 全部必填字段存在且为非空字符串（trim 后长度 > 0） |
| M16 | `judgment.counterSignal` 至少 1 条 |
| M17 | `judgment.unknowns` 至少 1 条 |
| M18 | `sources[].role` 非空 |
| M19 | `framings[].boundary` 非空 |
| M20 | `answerLayers` 至少 1 条 |

### 2.4 格式

| # | 规则 |
|---|---|
| M21 | `sources[].url` 必须以 `http://` 或 `https://` 开头 |
| M22 | `relatedRabbitHoles[].href` 必须是站内相对路径或 http(s) |
| M23 | `revisions[].date` 必须为 `YYYY-MM-DD` |
| M24 | `revisions[].version` 必须为正整数 |
| M25 | `packageVersion` 必须为正整数 |
| M26 | 全部枚举字段取值合法 |

### 2.5 分层边界（架构约束）

| # | 规则 | 执行方式 |
|---|---|---|
| M27 | `src/components/**` 不得 import `content/` 或 `src/content/` | 测试扫描 import |
| M28 | `src/lib/contracts/**` 不得 import 项目内任何其它模块 | 测试扫描 import |
| M29 | `content/**` 只含 `.json`（**内容不得是代码**） | 测试扫描扩展名 |
| M30 | Experience 组件不得出现 `topic.slug === "…"` 形式的条件判断 | 测试扫描源文本 |

M30 是把 A5/A6 那类"slug 三元判断"永久封死的守卫。

### 2.6 Release 门槛

| # | 规则 | 说明 |
|---|---|---|
| M31 | public build 中，任何 `releaseState` 非 `approved`/`published` 的 Topic 不得成页 | 保留原 guard 真实意图 |
| M32 | public build 中，public-ready 数量必须 ≥ 1 | **取代 `!== 2`**（A1） |
| M33 | public build 中，存在 `publicBlockers` 的 Topic 不得放行 | — |
| M34 | public build 中，`siteIdentity.isPlaceholderName === true` 必须**显式警告**（不静默通过） | A23 |
| M35 | local build 中，全部页面必须带 `noindex` | 保留现有行为 |

### 2.7 诚实性守卫

| # | 规则 | 说明 |
|---|---|---|
| M36 | 默认构造的 analytics 必须是 no-op（`enabled === false`） | 固化 A24 |
| M37 | `posthog-js` 不得出现在 runtime import（只能 `import type`） | 固化 A24 |
| M38 | Feedback 状态文案必须包含明确的"未发送"声明 | 固化 A25 |
| M39 | Feedback 文案不得出现 `submitted successfully` / `we received` / `thanks for your submission` 一类暗示已送达的措辞 | 固化 A25 |

M36–M39 保护的是**当前已经正确**的行为，防止未来退化。

---

## 3. HUMAN-JUDGMENT-GATED 规则

机器检查"有没有留下记录"，**不检查判断本身**。

| 项 | 机器检查 | 机器不检查 |
|---|---|---|
| Content Approval | 状态合法；`approved` 必须有 `by` + `date` | 内容是否真的准确 |
| Site Editorial | 同上 | 是否适合本站 |
| Visual | 同上 | 好不好看 |
| Asset Rights | 同上；`character.original === true` 需有 name + description | 是否真的有权使用 |
| 站点名 | `isPlaceholderName` 为 true 时公开发布必须警告 | 名字好不好 |
| Featured 选择 | `topicId` 存在 | 该不该选这几篇 |
| taxonomy 命名 | `category` 非空 | 分类是否合理 |

**边界原则**：机器不得替 owner 做产品、审美、内容判断。**契约的作用是让人的判断变得可见、有记录、无法被跳过 —— 不是替代它。**

---

## 4. CREATIVE FREEDOM 区域（禁止加校验）

以下**明确不受契约约束**。任何在这些区域增加校验的改动都应被拒绝：

- Experience 组件的界面结构、交互形态、DOM 组织
- 视觉设计：配色、字体搭配、排版、留白、动效
- 首页与 Explore 的版面与视觉语言
- 每篇 Topic 的独有视觉处理
- 文案风格、语气、修辞（**内容的准确性受约束，风格不受约束**）
- `presentation` 是否提供、提供多少
- 一个交互有几个视觉状态、几个步骤
- 组件内部的 scoped CSS

**为什么必须显式写下这一节**：契约有自我扩张的倾向 —— 每条新规则单看都"更严谨"，累积起来就把 expressive surface 压成模板。这一节是防止该倾向的刹车。

---

## 5. Experience Registry Contract

```ts
// src/components/experiences/registry.ts
export const experienceRegistry = {
  "qr-route-diagnosis-v1": QrPaymentExperience,
  "scoped-inference-test-v1": ChinamaxxingExperience,
} as const;
```

| 规则 | 说明 |
|---|---|
| key 是 `experienceImplementationId` | **不是 slug、不是 topicId、不是 interaction.id**（修 A9/A10） |
| key 稳定且带版本后缀 | 重做设计 → 注册新 `-v2`，旧 Topic 不受影响 |
| 一个实现可被多个 Topic 使用 | 多个 `topic.json` 指向同一 id |
| 查表失败 → throw | 不得渲染空白或回退到默认组件（M13） |
| 注册表必须显式手写 | 不做目录自动扫描 |

### Registry admission ≠ published approval（A26）

**这是两个独立的门，任何时候都不得合并：**

| | Registry admission | Published approval |
|---|---|---|
| 问题 | 这个 Experience 实现**在技术上可用**吗？ | 这篇内容**可以公开**吗？ |
| 判据 | 组件存在、已注册、props 契约匹配 | 五层 review 通过、无 blockers |
| 位置 | `src/components/experiences/registry.ts` | `src/lib/release/**` + `topic.json` 的 review |
| 类别 | MACHINE-ENFORCEABLE | HUMAN-JUDGMENT-GATED |
| 谁决定 | 工程 | owner |

**注册了 ≠ 可以发布。** 类型命名上强化区分（`ExperienceRegistration` vs `ReleaseDecision`），并由测试守护：一个已注册但未 approved 的 Topic，在 public build 中**必须**被拦下。

---

## 6. 契约演进规则

| 情况 | 做法 |
|---|---|
| 加**可选**字段 | 保持 `contractVersion: 1` |
| 加**必填**字段 / 改字段语义 / 删字段 | 递增到 `contractVersion: 2`，并提供迁移说明 |
| 内容实质修改 | 递增该 package 的 `packageVersion` + 追加 `revisions` |
| 纯表达修改（配色、文案措辞） | 不递增 `packageVersion` |

`contractVersion` 与 `packageVersion` 是两件事：前者是**格式版本**（website 与 content-studio 的接口），后者是**内容版本**（这篇写到第几版）。

---

## 7. 契约执行点（唯一）

```ts
// src/content/topic-registry.ts
import qrPackage from "../../content/topics/qr-payment-stack/topic.json";
import culturePackage from "../../content/topics/chinamaxxing-inference/topic.json";
import { validateTopicPackage, assertRegistryIntegrity } from "../lib/contracts/topic-package.ts";
import { experienceRegistry } from "../components/experiences/registry.ts";

const packages = [qrPackage, culturePackage].map(validateTopicPackage);  // 单个 package 校验
assertRegistryIntegrity(packages, Object.keys(experienceRegistry));      // 跨 package 校验

export const topics = Object.freeze(packages);
export const topicById = new Map(packages.map((t) => [t.topicId, t]));
export const topicBySlug = new Map(packages.map((t) => [t.slug, t]));
```

- 这个模块被任何页面 import 时，校验**必然**执行（module 顶层代码）
- 因此 **build 时一定跑**，修复 A16
- `Object.freeze` 防止下游意外修改内容
- 加内容需要显式加一行 import —— **有意的摩擦**

---

## 8. 与 PROTOTYPE-ASSUMPTIONS 的对应

| 契约条款 | 修复的假设 |
|---|---|
| M1–M5 身份唯一性 | A3 |
| M7 evidence 引用 | **§0 真实 bug** + A16 |
| M8–M12 claim/framing 引用 | A7 |
| M13 registry 引用 | A9, A10 |
| M14 featured 引用 | A4 |
| M27–M30 分层边界 | A5, A6, A7, A8 |
| M31–M35 release | A1, A23 |
| M36–M39 诚实性 | A24, A25 |
| §1.9 presentation 可选 | A20, A21（限度约束） |
| §4 CREATIVE FREEDOM | 防止契约扩张 |
| §5 admission ≠ approval | A26 |
| `category` 为自由字符串 | A2 |
| `review.ownerNotesZh` 迁入 package | A14 |
