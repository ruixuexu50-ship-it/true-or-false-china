# DECISIONS — 架构决策记录

> 每条决策记录：背景 / 决定 / 备选方案与拒绝理由 / 状态 / 可撤销性。
> **原则：能撤销的决定优先。** 凡是"改回去代价很大"的决定，都必须给出更强的理由。
> 追加，不改写。已 ACCEPTED 的决定若被推翻，追加新条目说明，不删旧条目。

---

## D-001 — 从指定 baseline 重建，不继承既有迁移工作

**背景**：重建起点的仓库 HEAD 曾比指定 baseline 领先 9 个 commit，内容是一份未完成的 topic-package 迁移。

**决定**：从指定 baseline 建立独立目录重建。原仓库完全不动。

**备选方案**：
- ❌ 在原仓库继续 —— 会与半成品迁移纠缠，无法区分"已验证的结论"与"中途状态"
- ❌ `git reset --hard` 回退原仓库 —— 破坏他人工作，且明确禁止

**状态**：ACCEPTED（PHASE 0 已执行）
**可撤销性**：完全可撤销（删除 worktree 即可，原仓库无痕）

---

## D-002 — 引入 UUID v4 `topicId` 作为唯一稳定身份

**背景**：当前 Topic 身份由 slug + 数组下标 + title 共同顶替，三者都不稳定（A3）。这是全部下游脆弱性的根源。

**决定**：
- 每个 Topic 有一个 `topicId`，格式为 UUID v4，**人工生成一次后写死在 `topic.json` 里，永不重算**
- `slug` 降级为纯 URL 表达，可自由改
- `title` / `openingQuestion` 降级为纯展示，可自由改
- 数组顺序无任何语义
- 所有跨层引用（registry、featured、review、样式钩子）一律用 `topicId`

**备选方案**：
- ❌ 用递增整数 ID —— 会诱导"下一个是 3"的顺序语义，且合并内容时冲突
- ❌ 用可读 slug 式 ID（如 `topic-qr-payment`）—— 看起来稳定，但**因为可读所以有人会想改它**。不可读恰恰是 UUID 的功能，不是缺点
- ❌ 用内容哈希 —— 改内容就换身份，与"身份稳定"直接矛盾

**关于"UUID 不可读"的反驳**：可读性由目录名与 `slug` 提供，二者都可自由改。身份不需要可读，只需要不变。

**状态**：ACCEPTED（PHASE 4 执行）
**可撤销性**：中等。撤销需要改所有引用点，但旧 slug→topicId 映射会记录在迁移表中备查。

---

## D-003 — Topic Package 用 JSON，不用 TypeScript 模块

**背景**：契约要求 Topic Package：versioned、human + machine readable、可跨 workspace 复制、build-time 可验证、无 DB/CMS。未来由独立 content-studio 交付。

**决定**：`content/topics/<dir>/topic.json`，纯 JSON。

**理由**（按重要性排序）：
1. **内容是数据，不是代码。** JSON 无法夹带逻辑，"content-studio 交付 → website 消费"这条边界在**物理上**成立，不依赖纪律
2. 跨 workspace 复制不携带任何 TypeScript 工具链假设
3. content-studio 作为独立工具生成 / 校验 JSON 远比生成 TS 容易
4. 强迫校验走**运行时**（`validateTopicPackage`），而不是靠编译期类型 —— 这正是修复 A16 所需的

**备选方案**：
- ⚠️ **TypeScript 数据模块**（现状）—— 优点：编写时有类型提示与自动补全。拒绝理由：TS 模块可以 import、可以写函数、可以有条件逻辑，内容与代码的边界只能靠纪律维持，而**审计已证明纪律会失守**（A7 的 claims/framings 就是这样漏进 UI 的）
- ❌ YAML / TOML —— 需加依赖，收益仅为语法舒适
- ❌ Markdown + frontmatter —— 结构化数据（嵌套 claims、sources）在 frontmatter 里表达笨拙

**已知风险**：JSON import 需要 `resolveJsonModule`，与 `verbatimModuleSyntax` + `tsc --noEmit` + Astro/Vite 的交互需在 PHASE 5 实测。
**风险处置**：PHASE 5 第一步就验证 JSON import 能否通过 typecheck + build。若不通过且无低成本解法，回退到 **TS 数据模块 + 同一套运行时校验函数**（保留 D-003 的核心收益"运行时校验"，放弃"物理边界"）。回退将追加为 D-003a。

**状态**：ACCEPTED（PHASE 5 执行，带回退方案）
**可撤销性**：高。JSON 与 TS 数据模块之间转换是机械的，校验函数不变。

---

## D-004 — `content/` 置于仓库根目录，不使用 Astro content collections

**背景**：需要一个位置存放 Topic Package，且要让"内容边界"显眼。

**决定**：仓库根 `content/topics/<dir>/topic.json`。`src/content/topic-registry.ts` 负责显式接入。

**备选方案**：
- ❌ **Astro content collections（`src/content/` + `defineCollection`）**—— 拒绝理由：会把内容格式绑定到 Astro 的 magic 目录约定与其 schema API 上，直接违背"content 可跨 workspace 复制、与网站工具链解耦"。且它引入一套与我们自己的契约并行的校验机制，两套校验必然漂移
- ❌ 放在 `src/data/` —— 内容与代码混在同一棵树里，边界不显眼

**状态**：ACCEPTED（PHASE 5 执行）
**可撤销性**：高（移动目录 + 改 import 路径）

---

## D-005 — 显式注册内容，不做目录自动扫描

**背景**：自动扫描 `content/topics/*` 可以少写一行 import。

**决定**：`topic-registry.ts` 逐个显式 import。

**理由**：加内容应当是一个**有意识的动作**。自动扫描会让"把一个草稿文件放进目录"等于"发布"，这是不可接受的失误模式。多写一行 import 是**有意设计的摩擦**。

**备选方案**：
- ❌ `import.meta.glob` 自动扫描 —— 便利，但把"文件存在"变成"内容上线"

**状态**：ACCEPTED
**可撤销性**：高

---

## D-006 — 移除 `visualStates` 必须 2–4 个的强制约束

**背景**：现有 `validateTopicPage` 强制 `experience.visualStates` 数量在 2–4 之间（`contracts.test.mjs:35` 断言错误信息 `/2–4 visual states/`）。

**决定**：移除该约束。`visualStates` 归入可选的 `presentation`，不限数量。

**理由**："一个交互该有几个视觉状态"是**设计判断**，不是数据完整性问题。这条约束是 CREATIVE FREEDOM 区域被契约侵入的典型案例 —— 它在两篇内容时看起来"合理"，实际是把当时的设计习惯写成了规则。

**备选方案**：
- ❌ 放宽到 1–8 —— 换个数字仍然是任意的，没有解决"为什么工程要管这个"

**状态**：ACCEPTED（PHASE 5 执行）
**可撤销性**：高
**注意**：会打破 `contracts.test.mjs:35`，属预期，将在 IMPLEMENTATION-LOG 记录。

---

## D-007 — 发布门槛从"恰好 2 篇"改为"至少 1 篇 + 逐篇 approved"

**背景**：`release-guard.ts:76` 强制 public build 必须恰好 2 篇 public-ready（A1）。

**决定**：
- 移除数量等式，改为 `>= 1`（M32）
- 保留并强化"每篇必须 approved/published"（M31）
- 新增"存在 publicBlockers 不得放行"（M33）
- 新增"站点名仍为占位符时必须显式警告"（M34）

**理由**：原 guard 的真实意图是"不让未审阅内容公开"，被错误地表达成了数量。**数量不是质量。** 新规则守护的是同一个意图，且第三篇上线时不会因为"内容变多"而失败。

**备选方案**：
- ❌ 改成 `>= 2` —— 仍然是任意数字
- ❌ 完全移除数量检查 —— 零篇时应当失败（空站不该发布）

**状态**：ACCEPTED（PHASE 7 执行）
**可撤销性**：高

---

## D-008 — `experienceImplementationId` 带版本后缀

**背景**：registry 当前 keyed by slug（A9），且页面查表用 `interaction.id`（A10），两个键混用。

**决定**：registry key 为 `experienceImplementationId`，形如 `qr-route-diagnosis-v1`、`scoped-inference-test-v1`。

**理由**：版本后缀让"重做一个交互设计"不必破坏旧内容 —— 注册 `-v2` 为新实现，旧 Topic 继续指向 `-v1`，或显式迁移。这是给 expressive surface 留出重做空间的低成本手段。

**备选方案**：
- ❌ 用 `topicId` 作 key —— 会阻止多个 Topic 共用一个 Experience 实现（这是合理需求）
- ❌ 无版本后缀 —— 重做设计时只能原地改，破坏旧内容或被迫保持向后兼容

**状态**：ACCEPTED（PHASE 6 执行）
**可撤销性**：高

---

## D-009 — `featuredTopicIds` 属于网站侧（L6），不属于内容侧（L3）

**背景**：首页当前用 `const [firstTopic, secondTopic] = topics` 取内容（A4）。

**决定**：`src/config/site-editorial.ts` 导出显式 `featuredTopicIds: string[]`。首页只渲染它指向的内容。引用不存在的 `topicId` → build 失败（M14）。

**理由**：**"首页展示哪几篇"是网站的编辑决策，不是内容自身的属性。** 同一批 Topic Package，不同网站应能有不同展示选择。若把 `featured: true` 写进 `topic.json`，就把网站的编辑判断塞进了内容侧，破坏 content-studio 边界。

**备选方案**：
- ❌ `topic.json` 里加 `featured: true` —— 混淆内容与编辑决策的所有权
- ❌ 按 `lastReviewed` 自动排序取前 N —— 把编辑决策变成算法副产品，且不可见、不可 review

**状态**：ACCEPTED（PHASE 8 执行）
**可撤销性**：高

---

## D-010 — `category` 改为自由字符串，taxonomy 从内容派生

**背景**：`category` 当前是写死的 union type（A2），Explore 的筛选选项也硬编码（A12）。

**决定**：
- `category` 类型为 `string`，运行时校验非空
- 新增 `deriveCategories(topics)`，从已注册内容派生当前存在的类别
- Explore 筛选选项由该函数生成

**理由**：EMERGENT TAXONOMY —— 分类应从内容长出来，而不是内容被迫塞进预设分类。写死 union 的最大危害不是"加类别要改代码"，而是**作者会把内容硬塞进不合适的现有类别**，让架构扭曲内容。

**备选方案**：
- ❌ 保留 union 但手动扩充 —— 每次加类别都要改类型，且诱导上述扭曲
- ❌ 引入独立的 taxonomy 注册文件 —— 增加一层需要同步的 substrate，收益不明

**放弃的东西**：编辑器自动补全与拼写检查。**替代方案**：测试断言"派生出的类别数量在合理范围内"，并在 CHANGE-GUIDE 中提示复用已有类别名 —— 提示，而非强制。

**状态**：ACCEPTED（PHASE 5 + PHASE 8 执行）
**可撤销性**：高

---

## D-011 — `judgment.evidence` 改名为 `judgment.evidenceSourceIds`

**背景**：审计发现**真实的引用断裂** —— `evidence: ["S01"..]`（大写）与 `sources[].id`（小写 `s01`）全部不匹配，且 `"R00"` 在仓库中不存在任何对应对象。而契约只检查该字段存在，从不检查引用（`CONTRACTS.md` §0）。

**决定**：
- 字段改名为 `evidenceSourceIds`
- 增加引用完整性校验（M7），**大小写敏感**
- 修正现有数据的大小写；`"R00"` 需人工确认其本意后处理

**理由**：旧名字掩盖了"这是引用而非自由文本"，是错配长期未被发现的原因之一。改名让约束在字段名上就显而易见。

**关于 `"R00"`**：这属于 UNRESOLVED —— 无法从代码推断它本应指向什么。PHASE 5 处置方式：若无法确定，从 `evidenceSourceIds` 中移除并在 IMPLEMENTATION-LOG 显式记录（**不猜测、不静默丢弃、不编造一条 source 来凑**）。

**状态**：ACCEPTED（PHASE 5 执行）
**可撤销性**：高

---

## D-012 — 保留 `src/lib/` 规则层与 analytics 壳，不重写

**背景**：重建容易滑向"全部重写"。

**决定**：以下部分**结构正确，原样保留**：
- `qr-diagnosis.ts`、`inference-test.ts`、`interaction-state.ts` —— 纯函数、零 UI 依赖、已有良好测试（包括"不得预测支付结果"、"句子必须以 `In this fictional example,` 开头"这类内容诚实性断言）
- `analytics.ts`、`analytics-bridge.ts`、`AnalyticsBridge.astro` —— shell-only、opt-in、默认 no-op、严格 allowlist
- `ui-events.ts`、`feedback.ts` 的 sanitize 函数
- `SiteLayout.astro` 的 a11y 基线（`:focus-visible`、`prefers-reduced-motion`）
- Astro static + MPA 的技术选择

**理由**：这些是 substrate 里**已经稳定的部分**。"从零重建"指的是不继承他人的架构结论、独立重新判断 —— **独立判断的结论完全可以是"这部分是对的"**。为了显得彻底而重写正确的代码，是纯粹的风险。

对 analytics 与 feedback，唯一动作是**补测试固化**（M36–M39），把"目前是对的"变成"以后也不会错"。

**状态**：ACCEPTED
**可撤销性**：不适用（保留现状）

---

## D-013 — 不删除 `OptionalModules.astro` 死代码

**背景**：该组件（45 行）无任何消费者（A22）。

**决定**：不删。在 PHASE 12 的 Feature Card 中明确标注为 **EXPERIMENT / 未接线**。

**理由**：删除不可逆，而它**没有造成任何危害**（不参与 build、不影响输出、不误导契约）。它代表 owner 可能仍想要的能力方向（transcript / image / music 模块）。**把"未接线的预留"误判为"必须清除的垃圾"，是越界的清洁癖** —— 是否需要这个能力属于 owner 的产品判断。

真正的问题不是它存在，而是**没人知道它是预留还是漏接**。Feature Card 标注解决的是这个问题。

**状态**：ACCEPTED
**可撤销性**：不适用

---

## D-014 — 旧测试中断言源码文本的部分，改为断言行为

**背景**：`test/owner-review.test.mjs:44` 直接断言源码字符串，把 A5 这个 bug 变成了受测试保护的规范。另有一批测试断言 `topics.length === 2`、固定 slug 列表、`exactly two` 错误信息（A17/A18/A19）。

**决定**：PHASE 3 先改测试，改为断言**结构性质**：
- `topicId` / `slug` 唯一
- 每个 Topic 通过契约校验
- 每个 Topic 能解析到 Experience 实现
- 每个 `claim.sourceIds` / `evidenceSourceIds` 指向真实 source
- 每个 Topic 的路由都被生成（**数量不断言**）
- **三篇 public-ready 时 public build 必须成功**（新增的核心验收项）

内容相关的搜索测试改用测试专用 fixture，不依赖真实内容。

**理由**：**错误的测试比没有测试更危险，因为它伪装成安全网。** 测试应验证行为与不变量，不应验证实现长什么样。当前这批测试的实际效果是"每次加内容都要改一批测试"，长期会让测试从保护变成负担，最终被绕过或删除。

**风险与处置**：修改测试有"为了让测试变绿而降低标准"的风险。处置方式：每一条被删除或修改的旧断言，都必须在 IMPLEMENTATION-LOG 中逐条记录**替代它的新断言是什么**。不允许净减少断言而无替代。

**状态**：ACCEPTED（PHASE 3 执行）
**可撤销性**：高（测试改动可回退）

---

## D-015 — Design Controls 只集中最必要项

**背景**：样式散落在各组件（A21），slug 被当 CSS hook（A20）。

**决定**：
- 新增 `src/styles/design-controls.css` 作为单一入口，集中：字体族、颜色、间距刻度、最大宽度、边框、阴影、动效时长与缓动
- CSS hook 从 `topic--${slug}` 改为基于稳定标识（`topicId` 或 `presentation.visualVariant`）
- **不动**组件内其余样式

**明确不做**：不建设计系统、不建组件库、不引 CSS 框架、不强制所有样式必须用 token、不禁止组件内自定义样式。

**理由**：L4 的目的是给"我想统一调整全站观感"提供一个入口，**不是给创作加锁**。把所有样式 token 化会把 expressive surface 变成 substrate，违反核心原则。

**状态**：ACCEPTED（PHASE 11 执行）
**可撤销性**：高

---

## D-016 — 不引入校验库（zod 等）

**背景**：`validateTopicPage` 是手写的 365 行校验代码。用 zod 可以更短、更声明式。

**决定**：继续手写校验函数。

**理由**：
1. 现有手写校验**已经存在且工作正常**，只是没接线 —— 问题是接线，不是校验方式
2. 加依赖扩大 substrate，且 schema 库有自己的版本演进与破坏性变更
3. 手写校验的错误信息可以精确定制（现有代码已做到 `sources[0].role` 这种精确定位），这对内容作者的体验比库的通用报错更好
4. 校验逻辑没有复杂到需要库

**备选方案**：
- ❌ zod —— 收益是代码更短，代价是新依赖 + 新的学习面 + schema 与 TS 类型的双向同步问题

**状态**：ACCEPTED
**可撤销性**：高（将来若校验规模膨胀可重新评估）

---

## D-017 — 保留 Astro static + MPA，不改基础设施

**决定**：`output: "static"`、`trailingSlash: "always"`、Node 内置 test runner，全部不动。

**理由**：与产品边界（无 DB、无 auth、无后端、无 accounts）完全一致。静态站点让 DEFERRED 清单里的东西**在技术上难以偷偷进入** —— 没有服务端就没有地方放数据库连接。这是基础设施层面的约束保护。

**状态**：ACCEPTED
**可撤销性**：不适用（保留现状）

---

## D-018 — Layered Review 落在 `topic.json` 内部，不单独建 review 文件

**背景**：review 需要分五层（Content Approval / Site Editorial / Visual / Asset Rights / Release State），当前是扁平的 `owner-review.ts` 四键映射（A14）。

**决定**：
- **内容相关**的四层审阅 + `releaseState` + `ownerNotesZh` 全部放进 `topic.json` 的 `review` 对象
- **结构页**（home / explore / lab）的 review 保留固定键的独立配置

**理由**：
1. 审阅状态是内容的属性，与内容同生共死，放在一起不会漂移
2. content-studio 交付 package 时，审阅记录随之而来，不需要第二套同步机制
3. 单独的 review 文件需要用 `topicId` 交叉引用，多一处可能失配的地方

**备选方案**：
- ❌ 独立 `content/reviews/<topicId>.json` —— 增加同步负担，且"内容改了但 review 没更新"更难发现
- ⚠️ 保留 `owner-review.ts` 扁平映射 —— 结构页部分保留（确实是有限集合），内容部分必须迁出

**已知张力**：把 review 放进 package 意味着"内容修改"与"审阅状态修改"会碰同一个文件。这是可接受的 —— **改内容后审阅状态本就应当重新评估**，同文件反而让这件事更难被忽略。

**状态**：ACCEPTED（PHASE 9 执行）
**可撤销性**：中等

---

## 待验证的风险清单

| 风险 | Phase | 处置 |
|---|---|---|
| JSON import 与 `verbatimModuleSyntax` + `tsc --noEmit` + Astro 的兼容性 | 5 | 第一步实测；不通过则回退 TS 数据模块（D-003a），保留运行时校验 |
| 迁移 `ChinamaxxingExperience` 的 claims/framings 到 props 可能破坏交互 | 5 | 迁移前后逐项对比渲染输出 |
| 改测试有"为绿而降标准"的风险 | 3 | 每条删改的断言必须记录替代断言，不允许净减少 |
| `"R00"` 悬空引用的本意无法确定 | 5 | 显式记录，不猜测、不编造 source |
| 大量旧测试会变红，可能掩盖真实回归 | 3 | 先改测试再改实现；每次只改一类，逐步验证 |

---

## 五级状态归属

| 状态 | 本次决策中的对应 |
|---|---|
| **INVARIANT** | static site 无后端（D-017）；身份稳定（D-002）；事实唯一（D-003）；错误响亮（D-007）；analytics 默认 no-op（D-012） |
| **CURRENT ASSUMPTION** | 目前两篇内容；目前两个类别；目前一个归档实验页 —— **全部显式化，不再隐含** |
| **EXPERIMENT** | `/lab/` 归档页；`OptionalModules`（D-013） |
| **UNRESOLVED** | 站点名；是否启用 PostHog；公开门槛的具体标准；taxonomy 命名；social URL；`"R00"` 的本意 —— **不在工程 phase 内代为决定** |
| **DEFERRED** | CMS / DB / auth / accounts / CRM / sound engine / game engine / 自建 analytics / UniversalTopicPage / 设计系统 / 校验库 / SSR |
