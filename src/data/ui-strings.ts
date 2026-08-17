// Centralized UI strings for the bilingual site.
//
// Common website chrome (navigation, section labels, buttons, form copy) lives
// here so it is never hardcoded as `if (locale === "zh")` inside components.
// Per-Topic *substantive* content (title, prose, claims, sources) stays in the
// Topic data and is localized there — see docs/release/LOCALIZATION.md.
//
// `en` is the canonical key set. `zh` must mirror every key.

import type { Locale } from "../lib/i18n.ts";

const en = {
  // ── Layout / navigation / footer ──────────────────────────────
  "nav.explore": "Explore",
  "nav.topics": "Topics",
  "nav.transcripts": "Video scripts",
  "nav.checklists": "Checklists",
  "skipLink": "Skip to content",
  "footer.line1": "Questions, actions, working answers, boundaries, sources, then another question.",
  "footer.line2": "Local review build · nothing here is approved for publication.",
  "footer.line2Public":
    "Independent research desk · Sources and revision state on every topic.",
  "lang.label": "Language",
  "lang.en": "EN",
  "lang.zh": "中文",
  "lang.switchTo": "Switch to {name}",

  // ── Home v2 (HomeHero / KnowledgeCabinet / HomeSections) ────
  "home.kicker": "An independent research desk on China",
  "home.headline": "Start with what matters.",
  "home.deck":
    "Real questions about how China actually works. We check the evidence, explain the mechanism, mark the boundary—and follow where it lands.",
  "home.methodStrip": "Question → Evidence → Mechanism → Boundary → Impact",
  "home.ctaPrimary": "Explore topics",
  "home.ctaSecondary": "How this works",
  "home.metaUpdated": "Updated",
  "home.metaTopics": "{n} open investigations",

  // ── Knowledge cabinet (home hero) ───────────────────────────
  "cabinet.label": "The knowledge cabinet",
  "cabinet.hint": "Five drawers. Open one.",
  "cabinet.aria": "Knowledge cabinet: five entries",
  "cabinet.open": "Open",
  "cabinet.comingSoon": "Coming soon",
  "cabinet.external": "Opens in a new tab",
  "cabinet.soundOn": "Sound on",
  "cabinet.soundOff": "Sound off",

  // ── Three ways in (home desk objects) ─────────────────────
  "desk.kicker": "Playable desk · Experiment",
  "desk.title": "Three ways in.",
  "desk.sub": "The objects are invitations, not doors. The navigation above is always enough.",
  "desk.read.label": "Read",
  "desk.read.desc": "Essays & research",
  "desk.do.label": "Do",
  "desk.do.desc": "Practical guides",
  "desk.watch.label": "Watch",
  "desk.watch.desc": "Video & scripts",

  // ── The five libraries (cabinet + library grid) ─────────────
  "lib.topics.title": "Topics",
  "lib.topics.desc": "Question-first deep dives with sources and boundaries",
  "lib.videos.title": "Video scripts",
  "lib.videos.desc": "Full transcripts, sources, and further reading",
  "lib.checklists.title": "Checklists",
  "lib.checklists.desc": "Executable methods, frameworks, and steps",
  "lib.discord.title": "Discord",
  "lib.discord.desc": "The community room for questions and field notes",
  "lib.tiktok.title": "TikTok",
  "lib.tiktok.desc": "Short-form versions of the research",
  "lib.kicker": "Five libraries",
  "lib.title": "Everything on this desk has a drawer.",
  "lib.sub":
    "Each entry is a real destination. The two community drawers open as soon as the invitations go out.",

  // ── Currently investigating (home) ──────────────────────────
  "now.kicker": "Currently investigating",
  "now.cardLabel": "Research file",
  "now.state.working": "Working answer",
  "now.state.draft": "Draft · local review",
  "now.status": "Status",
  "now.lastReviewed": "Last reviewed",
  "now.category": "Category",
  "now.open": "Open the investigation →",

  // ── Method & trust (home) ───────────────────────────────────
  "method.kicker": "How this works",
  "method.title": "Every claim carries its own evidence—and its own boundary.",
  "method.step.q.label": "Question",
  "method.step.q.text": "Start from a question that matters to real decisions.",
  "method.step.e.label": "Evidence",
  "method.step.e.text": "Check what the available sources can actually support.",
  "method.step.m.label": "Mechanism",
  "method.step.m.text": "Connect the parts until the behavior makes sense.",
  "method.step.b.label": "Boundary",
  "method.step.b.text": "Mark what this evidence cannot reach.",
  "method.step.i.label": "Impact",
  "method.step.i.text": "Follow where it lands—money, time, decisions.",
  "method.trust.title": "Why you can check us",
  "method.trust.1": "Dated sources on every topic",
  "method.trust.2": "Revision state stays visible",
  "method.trust.3": "Unknowns stay in view, not hidden",
  "method.trust.4": "Independent · one desk · no sponsors",

  // ── Featured / read next (home) ─────────────────────────────
  "featured.kicker": "Read next",
  "featured.title": "Working answers, each with an expiry date.",
  "featured.zhPending":
    "The first Chinese translations are in progress. The English investigations are open now.",

  // ── Community (home) ────────────────────────────────────────
  "community.kicker": "Keep in touch",
  "community.title": "The desk grows in public.",
  "community.body":
    "Discord and TikTok are being set up. Watch this page—or come back when the first video lands.",

  // ── Library index pages (transcripts / checklists) ──────────
  "ts.kicker": "Library",
  "ts.title": "Video scripts",
  "ts.intro":
    "Every video gets a full transcript with its sources and further reading, so a claim can always be checked without watching.",
  "ts.empty": "No scripts published yet. Nothing here is faked.",
  "ck.kicker": "Library",
  "ck.title": "Checklists",
  "ck.intro":
    "Executable methods, frameworks, and step lists—each one tied to a topic and its sources.",
  "ck.qr.title": "Payment route check",
  "ck.qr.desc":
    "Before relying on one payment route: make a small test purchase, keep a second method, carry some cash.",
  "ck.qr.source": "From the topic: everyone pays by QR—why can’t your card?",
  "lib.backHome": "Back to the homepage",

  // ── Explore (ExploreView) ────────────────────────────────────
  "explore.eyebrow": "EXPLORE · {n} WORKING ANSWERS + {m} OPEN TRAILS",
  "explore.title": "A question should open another door.",
  "explore.intro":
    "Search the finished local-review slices or follow a research trail. Trails are labels only until they have their own evidence and page.",
  "explore.searchLabel": "Search",
  "explore.searchPlaceholder": "Try payment, meme, evidence…",
  "explore.categoryLabel": "Category",
  "explore.categoryAll": "All categories",
  "explore.statusLabel": "Status",
  "explore.statusAll": "All states",
  "explore.statusLocallyReviewed": "Locally reviewed",
  "explore.resultCount": "{n} Topics",
  "explore.indexTitle": "True or False China",
  "explore.emptyState": "No Working Answer matches those filters.",
  "explore.trailEyebrow": "UNPUBLISHED / NO ROUTES CREATED",
  "explore.trailTitle": "Rabbit-hole trails",
  "explore.trailOnly": "TRAIL ONLY",
  "explore.fromLabel": "from “{parent}”",

  // ── Topic shell (TopicShell) ─────────────────────────────────
  "topic.workingAnswerKicker": "02 / WORKING ANSWER",
  "topic.workingAnswerTitle": "A useful answer, with an expiry date.",
  "topic.metaWhatChanged": "What changed",
  "topic.metaReleaseState": "Release state",
  "topic.metaLastReviewed": "Last reviewed",
  "topic.deeperKicker": "03 / PULL IT APART",
  "topic.boundaryKicker": "BOUNDARY / COUNTEREXAMPLES",
  "topic.blockersKicker": "PUBLIC RELEASE CHECK",
  "topic.blockersTitle": "Local Working Answer only.",
  "topic.blockersBody":
    "The fixture is fictional. No real post, account, face, comment, audio, or audience response is presented as evidence.",
  "topic.openBlockers": "Open blockers B01–B10",
  "topic.fictionalCaption": "THIS POST DOES NOT EXIST",
  "topic.fictionalSub": "{fixtureId} · purpose-made fictional demonstration",
  "topic.assetStatus": "Original working illustration · asset status: local-review · not approved",
  "topic.heroActionDown": "↓",

  // ── Source list ──────────────────────────────────────────────
  "sources.kicker": "04 / SOURCES + LIMITS",
  "sources.title": "What we know—and what we don't.",
  "sources.numberPrefix": "S",

  // ── Related list ─────────────────────────────────────────────
  "related.kicker": "05 / NEXT QUESTIONS",
  "related.title": "Keep pulling the thread.",

  // ── Feedback form ────────────────────────────────────────────
  "feedback.kicker": "06 / YOUR QUESTION",
  "feedback.title": "What still feels unclear—or what China question should we unpack next?",
  "feedback.label": "One question or unclear point",
  "feedback.help":
    "If enabled after approval, the Topic slug, entry category, and this message will be sent to PostHog EU. No name or email is requested. Analytics is not connected in this local review: after a local check, your words stayed on this device.",
  "feedback.check": "Check this question",
  "feedback.copy": "Copy my question",
  "feedback.statusInitial": "Nothing has been sent.",
  "feedback.takeMoment": "Please take a moment, then try again.",
  "feedback.writeFirst": "Write one question first.",
  "feedback.tooLong": "Keep the question to 500 characters or fewer.",
  "feedback.alreadyChecked": "Already checked once in this page view. Your edited words are still only here.",
  "feedback.analyticsOff": "Analytics is not connected. Your words stayed on this device; copy them if you want to keep them.",
  "feedback.copied": "Question copied. Nothing was submitted.",
  "feedback.selectCopy": "Select Copy in your browser. Nothing was submitted.",
  "feedback.noscript":
    "JavaScript is off. Nothing can be submitted from this local-review form; copy your question manually if you want to keep it.",
  "feedback.honeypot": "Leave this field empty",

  // ── Share controls ───────────────────────────────────────────
  "share.kicker": "07 / TAKE THE QUESTION",
  "share.title": "Send the route, not a verdict.",
  "share.intro": "This is local review. A copied link may point to localhost and is not a public page.",
  "share.buttonShare": "Share",
  "share.buttonCopy": "Copy link",
  "share.statusInitial": "Nothing shared yet.",
  "share.nativeUnavailable": "Native sharing is unavailable here. Use Copy link.",
  "share.shareOpened": "Share sheet opened.",
  "share.shareFailed": "Sharing did not open. Use Copy link.",
  "share.copied": "Local-review link copied.",
  "share.copyAddress": "Copy the address from your browser bar.",

  // ── QR Payment experience ───────────────────────────────────
  "qr.title": "Three gates. One likely weak link.",
  "qr.routeStatus": "Payment route status",
  "qr.gateFunding": "Funding",
  "qr.gateWallet": "Wallet bridge",
  "qr.gateMerchant": "Merchant route",
  "qr.chooseBelow": "Choose below",
  "qr.q1": "What would actually fund the payment?",
  "qr.fundingVisa": "A Visa or Mastercard issued outside mainland China",
  "qr.fundingWallet": "An overseas wallet shown as compatible for China payments",
  "qr.fundingLocal": "A mainland Chinese bank account or card",
  "qr.fundingUnsure": "I'm not sure yet",
  "qr.fundingNote": "Only a category—never type a financial detail here.",
  "qr.q2": "What bridge have you set up?",
  "qr.walletAlipay": "Alipay, with card-linking and identity steps completed",
  "qr.walletWeixin": "Weixin Pay, with card-linking and identity steps completed",
  "qr.walletOverseas": "A compatible overseas-wallet route is visible in my account",
  "qr.walletUnfinished": "The app is installed, but setup is unfinished",
  "qr.walletUnsure": "I don't know",
  "qr.walletNote": "Completed setup still does not predict the next live transaction.",
  "qr.q3": "What route is the merchant offering?",
  "qr.merchantApp": "A merchant QR inside Alipay or Weixin Pay",
  "qr.merchantTerminal": "A card terminal showing an international-card route",
  "qr.merchantStall": "A small stall or individual QR with no card information",
  "qr.merchantUnchecked": "I haven't checked yet",
  "qr.merchantNote": "A visible QR does not reveal every route behind it.",
  "qr.diagnose": "Diagnose my route",
  "qr.payoffLabel": "FIRST PAYOFF / ROUTE DIAGNOSIS",
  "qr.weakLink": "Your likely weak link:",
  "qr.stillUnknown": "still unknown",
  "qr.cannotSee": "What this cannot see",
  "qr.changeAnswers": "Change answers",
  "qr.openSources": "Open the source boundary ↓",

  // ── Chinamaxxing experience ──────────────────────────────────
  "cm.title": "Hold the scene still. Move the claim.",
  "cm.fictionalRepeat": "FICTIONAL FIXTURE / DEMO-01",
  "cm.observeLegend": "Choose the sentence that stays closest to the demonstration.",
  "cm.observeOpt1": "The character changes into slippers, pours hot water, sets down dumplings, and uses the “Chinese era” line.",
  "cm.observeOpt2": "The creator respects Chinese culture.",
  "cm.observeOpt3": "These are authentic Chinese behaviors.",
  "cm.observeOpt4": "The post makes viewers more positive about China.",
  "cm.observeContinue": "Separate the inferences",
  "cm.backOneLayer": "Back one layer",
  "cm.compareFramings": "Compare the framings",
  "cm.unknownLegend": "Keep at least one unknown in the final sentence.",
  "cm.unknownRealParticipant": "What a real participant would mean in a specific post",
  "cm.unknownAudience": "How a real viewer would interpret or respond",
  "cm.unknownSocialEffect": "Whether exposure changes knowledge, behavior, travel interest, or politics",
  "cm.unknownPrevalence": "How common the meme is now, where, and among whom",
  "cm.unknownDurability": "Whether it lasts beyond the attention cycle",
  "cm.unknownCausation": "What role algorithms, geopolitics, tourism, incentives, or state messaging played",
  "cm.unknownCategoryScope": "Which meaning of Chinese is actually in play",
  "cm.unknownNote": "Unknown does not mean unknowable. It means this page does not have the evidence.",
  "cm.reviseSentence": "Revise the sentence",
  "cm.startingSentence": "Chinamaxxing proves TikTok users now appreciate China.",
  "cm.scaffoldOption1": "three everyday cues are grouped under one joke",
  "cm.scaffoldOption2": "the three objects appear beside one identity joke",
  "cm.scaffoldOption3": "the author describes affectionate intent",
  "cm.scaffoldOption4": "the cues were chosen to read quickly",
  "cm.buildScaffold": "Build a sentence scaffold",
  "cm.revisionLabel": "Your local revision",
  "cm.compareBeforeAfter": "Compare before + after",
  "cm.payoffLabel": "FIRST PAYOFF / REVISION COMPLETE",
  "cm.payoffTitle": "Smaller claim. Stronger inference.",
  "cm.before": "Before",
  "cm.after": "After",
  "cm.resetExample": "Reset this local example",
  "cm.inferenceAdded":
    "Inference added. The scene alone does not establish {layer}. Keep the claim visible and look for the evidence it would need.",
  "cm.observationNote":
    "Observation. This sentence stays with visible actions and words. It does not add motive, authenticity, reception, or effect.",

  // ── QR experience (extra chrome) ───────────────────────────
  "qr.kicker": "01 / BUILD YOUR ROUTE",
  "qr.intro": "Pick the closest match. We use the choices only to explain this route in your browser. Do not enter a bank, card, account, or phone detail.",
  "qr.liveCheck": "live check",
  "qr.cannotSeeCaveat": "Your bank, account eligibility, merchant configuration, fees, limits, network, or live risk checks.",
  "qr.practical": "Before relying on a route: make one small test purchase, keep more than one method, and carry some RMB cash without assuming every merchant has change.",

  // ── Chinamaxxing experience (extra chrome) ─────────────────
  "cm.kicker": "01 / TEST THE INFERENCE",
  "cm.intro": "This is not a morality quiz. The reward is a sentence that names its evidence and keeps an unknown visible.",
  "cm.fictionalBanner": "THIS POST DOES NOT EXIST",
  "cm.fictionalBannerSub": "DEMO-01 · purpose-made fictional demonstration",
  "cm.fixtureNote": "Indoor slippers, hot water, and dumplings are not uniquely or universally Chinese. They appear only as cues described in current reporting.",
  "cm.stage2Intro": "Open a claim. These labels describe evidence reach, not whether a person is good or bad.",
  "cm.stage3Intro": "A framing is a named way of interpreting the same evidence. These sources do not vote on a winner.",
  "cm.selectedEmpty": "No lens selected yet.",
  "cm.startingLabel": "Starting sentence",
  "cm.stage5Intro": "Use the constrained pieces to build a scaffold. Then change at least one character yourself before comparing. No model reads or rewrites it.",
  "cm.builderObservation": "Observation",
  "cm.builderAuthorNote": "Fictional author note",
  "cm.revisionPrivacy": "Your sentence stays in this browser session. It is not submitted, stored, replayed, or included in analytics.",
  "cm.payoffBody": "A specific example may support a humanizing possibility and a flattening analysis—but “both” is not a free answer. Each inference needs its own evidence.",
  "cm.payoffCaveat": "You tested a fictional example, not the meme. Another post, author, audience, or context can support another conclusion—or neither one.",
  "cm.stage1": "1 / 5 · WHAT CAN YOU SEE?",
  "cm.stage2": "2 / 5 · HOW FAR DOES THE EVIDENCE REACH?",
  "cm.stage3": "3 / 5 · WHO IS FRAMING WHAT?",
  "cm.stage4": "4 / 5 · WHAT IS STILL MISSING?",
  "cm.stage5": "5 / 5 · MAKE THE CLAIM SMALLER + STRONGER",

  // ── Lab (archive) ───────────────────────────────────────────
  "lab.archivedHomepage": "archived homepage",
} as const;

const zh: Record<keyof typeof en, string> = {
  // ── 布局 / 导航 / 页脚 ──────────────────────────────────
  "nav.explore": "探索",
  "nav.topics": "主题",
  "nav.transcripts": "视频文稿",
  "nav.checklists": "操作清单",
  "skipLink": "跳到正文",
  "footer.line1": "问题、动作、工作答案、边界、来源，然后下一个问题。",
  "footer.line2": "本地审阅构建 · 此处没有任何内容被批准发布。",
  "footer.line2Public": "独立研究台 · 每个主题都公开来源与修订状态。",
  "lang.label": "语言",
  "lang.en": "EN",
  "lang.zh": "中文",
  "lang.switchTo": "切换到{name}",

  // ── 首页 v2（HomeHero / KnowledgeCabinet / HomeSections）─────
  "home.kicker": "一个关于中国的独立研究台",
  "home.headline": "从真正重要的问题开始。",
  "home.deck":
    "关于中国真实运转的问题。我们核对证据、解释机制、标出边界——然后追踪它最终落在哪里。",
  "home.methodStrip": "问题 → 证据 → 机制 → 边界 → 影响",
  "home.ctaPrimary": "探索问题",
  "home.ctaSecondary": "我们怎么研究",
  "home.metaUpdated": "更新于",
  "home.metaTopics": "{n} 项进行中的研究",

  // ── 知识柜（首页 Hero）─────────────────────────────────────
  "cabinet.label": "知识柜",
  "cabinet.hint": "五个抽屉，拉开一个。",
  "cabinet.aria": "知识柜：五个入口",
  "cabinet.open": "进入",
  "cabinet.comingSoon": "待接入",
  "cabinet.external": "在新标签页打开",
  "cabinet.soundOn": "音效开",
  "cabinet.soundOff": "音效关",

  // ── Three ways in（首页桌面对象）───────────────────────────
  "desk.kicker": "可玩桌面 · 实验",
  "desk.title": "三条进入路径。",
  "desk.sub": "这些物件是邀请，不是大门。上方导航永远够用。",
  "desk.read.label": "读",
  "desk.read.desc": "研究与长文",
  "desk.do.label": "做",
  "desk.do.desc": "实操指南",
  "desk.watch.label": "看",
  "desk.watch.desc": "视频与文稿",

  // ── 五大信息库（柜子 + 入口区）─────────────────────────────
  "lib.topics.title": "主题研究",
  "lib.topics.desc": "以问题为先的深度研究，附来源与边界",
  "lib.videos.title": "视频文稿",
  "lib.videos.desc": "完整文稿、来源与延伸材料",
  "lib.checklists.title": "操作清单",
  "lib.checklists.desc": "可执行的方法、框架与步骤",
  "lib.discord.title": "Discord",
  "lib.discord.desc": "提问与田野笔记的社区讨论室",
  "lib.tiktok.title": "TikTok",
  "lib.tiktok.desc": "研究结论的短视频版本",
  "lib.kicker": "五大信息库",
  "lib.title": "这张研究台上的每样东西，都有一个抽屉。",
  "lib.sub":
    "每个入口都是真实目的地。两个社区抽屉会在邀请链接发出后立即打开。",

  // ── 正在研究（首页）───────────────────────────────────────
  "now.kicker": "正在研究",
  "now.cardLabel": "研究档案卡",
  "now.state.working": "工作答案",
  "now.state.draft": "草稿 · 本地审阅",
  "now.status": "状态",
  "now.lastReviewed": "最近审阅",
  "now.category": "分类",
  "now.open": "打开这项研究 →",

  // ── 方法与可信度（首页）──────────────────────────────────
  "method.kicker": "我们怎么研究",
  "method.title": "每个判断都带着自己的证据——和自己的边界。",
  "method.step.q.label": "问题",
  "method.step.q.text": "从一个影响真实决策的问题开始。",
  "method.step.e.label": "证据",
  "method.step.e.text": "核对现有来源到底能支撑什么。",
  "method.step.m.label": "机制",
  "method.step.m.text": "把环节连起来，直到行为说得通。",
  "method.step.b.label": "边界",
  "method.step.b.text": "标出这份证据够不到的地方。",
  "method.step.i.label": "影响",
  "method.step.i.text": "追踪它落在哪里——钱、时间、决策。",
  "method.trust.title": "凭什么可以核查我们",
  "method.trust.1": "每个主题都附带注明日期的来源",
  "method.trust.2": "修订状态始终公开",
  "method.trust.3": "未知保持可见，不被藏起来",
  "method.trust.4": "独立运营 · 一张研究台 · 无赞助方",

  // ── 精选 / 接着读（首页）─────────────────────────────────
  "featured.kicker": "接着读",
  "featured.title": "工作答案，各带一个有效期。",
  "featured.zhPending": "首批中文翻译正在进行。英文研究现已开放。",

  // ── 社群（首页）─────────────────────────────────────────
  "community.kicker": "保持联系",
  "community.title": "这张研究台公开生长。",
  "community.body": "Discord 与 TikTok 正在筹备。关注本页，或等第一支视频上线。",

  // ── 资料库入口页（视频文稿 / 操作清单）─────────────────────
  "ts.kicker": "资料库",
  "ts.title": "视频文稿",
  "ts.intro":
    "每支视频都会配备完整文稿、来源与延伸材料——不必看视频，也能核查每一个判断。",
  "ts.empty": "暂无已发布文稿。这里不伪造内容。",
  "ck.kicker": "资料库",
  "ck.title": "操作清单",
  "ck.intro": "可执行的方法、框架与步骤清单——每份都挂在一个主题和它的来源之下。",
  "ck.qr.title": "支付路线自查",
  "ck.qr.desc": "依赖某条支付路线之前：先做一次小额实测，保留第二种方式，随身带些现金。",
  "ck.qr.source": "来自主题：大家都用二维码付款——那你的卡为什么不行？",
  "lib.backHome": "回到首页",

  // ── 探索页（ExploreView）────────────────────────────────
  "explore.eyebrow": "探索 · {n} 篇 Working Answer + {m} 条研究线索",
  "explore.title": "一个问题，应当打开另一扇门。",
  "explore.intro":
    "搜索已经成型的本地审阅切片，或顺着一条研究线索走下去。线索只是标签，直到它们有自己的证据和页面。",
  "explore.searchLabel": "搜索",
  "explore.searchPlaceholder": "试试 支付、梗、证据……",
  "explore.categoryLabel": "分类",
  "explore.categoryAll": "全部分类",
  "explore.statusLabel": "状态",
  "explore.statusAll": "全部状态",
  "explore.statusLocallyReviewed": "本地审阅",
  "explore.resultCount": "{n} 篇",
  "explore.indexTitle": "真假中国",
  "explore.emptyState": "没有 Working Answer 符合这些筛选条件。",
  "explore.trailEyebrow": "未发布 / 尚未建立路线",
  "explore.trailTitle": "衍生研究线索",
  "explore.trailOnly": "仅线索",
  "explore.fromLabel": "来自“{parent}”",

  // ── 主题外壳（TopicShell）───────────────────────────────
  "topic.workingAnswerKicker": "02 / WORKING ANSWER",
  "topic.workingAnswerTitle": "一个有用、但带有效期的答案。",
  "topic.metaWhatChanged": "改动内容",
  "topic.metaReleaseState": "发布状态",
  "topic.metaLastReviewed": "最近审阅",
  "topic.deeperKicker": "03 / 拆开来再看",
  "topic.boundaryKicker": "边界 / 反例",
  "topic.blockersKicker": "公开发布检查",
  "topic.blockersTitle": "仅为本地 Working Answer。",
  "topic.blockersBody":
    "这个帖子是虚构的。没有任何真实帖子、账号、面孔、评论、音频或受众反应被当作证据呈现。",
  "topic.openBlockers": "查看阻断项 B01–B10",
  "topic.fictionalCaption": "这个帖子不存在",
  "topic.fictionalSub": "{fixtureId} · 刻意制作的虚构示例",
  "topic.assetStatus": "原创工作插图 · 素材状态：本地审阅 · 未批准",
  "topic.heroActionDown": "↓",

  // ── 来源列表 ──────────────────────────────────────────────
  "sources.kicker": "04 / 来源 + 局限",
  "sources.title": "我们已知——与未知。",
  "sources.numberPrefix": "S",

  // ── 相关线索列表 ──────────────────────────────────────────
  "related.kicker": "05 / 下一个问题",
  "related.title": "继续顺着线索往下拉。",

  // ── 反馈表单 ────────────────────────────────────────────
  "feedback.kicker": "06 / 你的问题",
  "feedback.title": "还有什么没说清——或者，下一个该拆开的中国问题是什么？",
  "feedback.label": "一个疑问或不清楚的点",
  "feedback.help":
    "若在批准后启用，主题的 slug、进入类别和这条留言会被发往 PostHog EU。不索取姓名或邮箱。本地审阅中未接入分析：本地检查后，你的文字只留在这台设备上。",
  "feedback.check": "检查这个问题",
  "feedback.copy": "复制我的问题",
  "feedback.statusInitial": "尚未发送任何内容。",
  "feedback.takeMoment": "请稍等片刻，再试一次。",
  "feedback.writeFirst": "先写一个问题。",
  "feedback.tooLong": "问题请控制在 500 字以内。",
  "feedback.alreadyChecked": "本页视图内已检查过一次。你修改后的文字仍只留在这里。",
  "feedback.analyticsOff": "未接入分析。你的文字只留在这台设备上；想保留就复制走。",
  "feedback.copied": "问题已复制。未提交任何内容。",
  "feedback.selectCopy": "请在浏览器里选择复制。未提交任何内容。",
  "feedback.noscript":
    "JavaScript 已关闭。本地审阅表单无法提交任何内容；若想保留，请手动复制你的问题。",
  "feedback.honeypot": "留空此字段",

  // ── 分享控件 ────────────────────────────────────────────
  "share.kicker": "07 / 把问题带走",
  "share.title": "发出路线，而不是结论。",
  "share.intro": "这是本地审阅。复制出的链接可能指向 localhost，不是公开页面。",
  "share.buttonShare": "分享",
  "share.buttonCopy": "复制链接",
  "share.statusInitial": "尚未分享任何内容。",
  "share.nativeUnavailable": "此处无法使用系统分享。请用“复制链接”。",
  "share.shareOpened": "已打开分享面板。",
  "share.shareFailed": "分享未打开。请用“复制链接”。",
  "share.copied": "本地审阅链接已复制。",
  "share.copyAddress": "请从浏览器地址栏复制网址。",

  // ── 二维码支付体验 ──────────────────────────────────────
  "qr.title": "三道关卡。一个最可能的薄弱点。",
  "qr.routeStatus": "支付路线状态",
  "qr.gateFunding": "资金来源",
  "qr.gateWallet": "钱包通道",
  "qr.gateMerchant": "商户路线",
  "qr.chooseBelow": "在下方选择",
  "qr.q1": "真正能为这笔支付提供资金的，是什么？",
  "qr.fundingVisa": "在中国大陆以外发行的 Visa 或 Mastercard",
  "qr.fundingWallet": "显示支持中国境内支付的海外钱包",
  "qr.fundingLocal": "中国大陆的银行账户或银行卡",
  "qr.fundingUnsure": "我还不确定",
  "qr.fundingNote": "只选类别——切勿在此填写任何金融细节。",
  "qr.q2": "你已经搭建好哪座桥？",
  "qr.walletAlipay": "支付宝，已完成绑卡与身份验证步骤",
  "qr.walletWeixin": "微信支付，已完成绑卡与身份验证步骤",
  "qr.walletOverseas": "我的账户里能看到一条可用的海外钱包路线",
  "qr.walletUnfinished": "App 装好了，但设置还没完成",
  "qr.walletUnsure": "我不知道",
  "qr.walletNote": "设置完成，也预言不了下一笔实时交易。",
  "qr.q3": "商户提供的是哪条路线？",
  "qr.merchantApp": "支付宝或微信支付里的商户二维码",
  "qr.merchantTerminal": "显示国际卡路线的刷卡终端",
  "qr.merchantStall": "没有银行卡信息的小摊或个人二维码",
  "qr.merchantUnchecked": "我还没核对过",
  "qr.merchantNote": "看得见的二维码，并不揭示它背后每一条路线。",
  "qr.diagnose": "诊断我的路线",
  "qr.payoffLabel": "首个回报 / 路线诊断",
  "qr.weakLink": "你最可能的薄弱点：",
  "qr.stillUnknown": "尚未确定",
  "qr.cannotSee": "它看不到什么",
  "qr.changeAnswers": "修改答案",
  "qr.openSources": "打开来源边界 ↓",

  // ── Chinamaxxing 体验 ───────────────────────────────────
  "cm.title": "让场景静止。移动那个判断。",
  "cm.fictionalRepeat": "虚构示例 / DEMO-01",
  "cm.observeLegend": "选出最贴近这个演示的句子。",
  "cm.observeOpt1": "角色换上拖鞋、倒热水、摆好饺子，并说出那句“中国时代”的梗。",
  "cm.observeOpt2": "创作者在尊重中国文化。",
  "cm.observeOpt3": "这些是地道的中国行为。",
  "cm.observeOpt4": "这个帖子让观众对中国更正面。",
  "cm.observeContinue": "把推断拆开",
  "cm.backOneLayer": "退回上一层",
  "cm.compareFramings": "对比几种解读",
  "cm.unknownLegend": "在最终句子里，至少保留一个未知。",
  "cm.unknownRealParticipant": "在某个具体帖子背后，真实参与者意味着什么",
  "cm.unknownAudience": "真实观众会怎样理解或回应",
  "cm.unknownSocialEffect": "曝光是否改变了认知、行为、旅游兴趣或政治态度",
  "cm.unknownPrevalence": "这个梗现在有多常见、在哪里、在谁中间",
  "cm.unknownDurability": "它能否撑过这一轮注意力周期",
  "cm.unknownCausation": "算法、地缘、旅游、激励或国家叙事各自起了什么作用",
  "cm.unknownCategoryScope": "“中国”这个词，此刻到底指什么",
  "cm.unknownNote": "未知不等于不可知。它只意味着这个页面没有相应证据。",
  "cm.reviseSentence": "修订这句话",
  "cm.startingSentence": "Chinamaxxing 证明 TikTok 用户现在欣赏中国。",
  "cm.scaffoldOption1": "三个日常片段被收进同一个玩笑里",
  "cm.scaffoldOption2": "三件物件出现在同一个身份玩笑旁",
  "cm.scaffoldOption3": "作者描述了善意的意图",
  "cm.scaffoldOption4": "这些片段是为了读起来快而被挑中的",
  "cm.buildScaffold": "搭出句子骨架",
  "cm.revisionLabel": "你的本地修订",
  "cm.compareBeforeAfter": "对比修改前后",
  "cm.payoffLabel": "首个回报 / 修订完成",
  "cm.payoffTitle": "更小的判断。更强的推断。",
  "cm.before": "修改前",
  "cm.after": "修改后",
  "cm.resetExample": "重置这个本地示例",
  "cm.inferenceAdded":
    "已加入推断。仅凭场景本身，并不能确立{layer}。让判断保持可见，并去寻找它所需的证据。",
  "cm.observationNote":
    "观察。这句话只停留在看得见的行为和文字上。它不添加动机、真实性、受众反应或效果。",

  // ── 二维码支付体验（补充界面）─────────────────────────────
  "qr.kicker": "01 / 搭出你的路线",
  "qr.intro": "选最接近的一项。我们只用这些选择在你的浏览器里解释这条路线。不要填入银行、卡、账户或手机号等任何信息。",
  "qr.liveCheck": "实时核验",
  "qr.cannotSeeCaveat": "你的银行、账户资格、商户配置、费用、限额、网络，或实时的风控核查。",
  "qr.practical": "在依赖某条路线之前：先做一次小额实测消费，保留不止一种方式，并随身带一些人民币现金，别默认每个商户都能找零。",

  // ── Chinamaxxing 体验（补充界面）────────────────────────
  "cm.kicker": "01 / 检验这个推断",
  "cm.intro": "这不是道德测验。奖励是一句话：它点出自己的证据，并让一个未知保持可见。",
  "cm.fictionalBanner": "这个帖子不存在",
  "cm.fictionalBannerSub": "DEMO-01 · 刻意制作的虚构示例",
  "cm.fixtureNote": "拖鞋、热水、饺子，并不是独属于或普适于“中国”的。它们只是当前报道里被描述为线索的几个片段。",
  "cm.stage2Intro": "展开一条论断。这些标签描述的是证据能延伸到多远，而不是某个人是好是坏。",
  "cm.stage3Intro": "一种“解读”就是给同一份证据起的一个名字。这些来源并不投票选出赢家。",
  "cm.selectedEmpty": "尚未选择任何视角。",
  "cm.startingLabel": "初始句子",
  "cm.stage5Intro": "用这些被限定的碎片搭出骨架。然后在对比之前，至少亲手改一个字。没有任何模型读取或改写它。",
  "cm.builderObservation": "观察",
  "cm.builderAuthorNote": "虚构作者说明",
  "cm.revisionPrivacy": "你的句子只留在这个浏览器会话里。它不会被提交、存储、回放，也不会进入分析。",
  "cm.payoffBody": "一个具体例子，或许能同时支撑“人性化”与“扁平化”两种解读——但“两者都对”不是一个免费答案。每一种推断都需要自己的证据。",
  "cm.payoffCaveat": "你测试的是一个虚构例子，不是这个梗本身。换一篇帖子、作者、受众或语境，可能支撑另一种结论——或者哪种都不支撑。",
  "cm.stage1": "1 / 5 · 你能看到什么？",
  "cm.stage2": "2 / 5 · 证据能延伸到多远？",
  "cm.stage3": "3 / 5 · 谁在做什么解读？",
  "cm.stage4": "4 / 5 · 还缺什么？",
  "cm.stage5": "5 / 5 · 把判断改得更小、更强",

  // ── 实验室（归档）──────────────────────────────────────
  "lab.archivedHomepage": "归档首页",
};

export type UiKey = keyof typeof en;

/** Look up a UI string for a locale. Falls back to English, then to the key. */
export function t(locale: Locale, key: UiKey): string {
  const table = locale === "zh" ? zh : en;
  return table[key] ?? en[key] ?? key;
}

/** Tiny {placeholder} interpolator for UI strings that carry numbers. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
