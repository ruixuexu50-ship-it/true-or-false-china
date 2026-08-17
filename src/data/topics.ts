import type { TopicPage } from "../lib/contracts.ts";
import type { Locale } from "../lib/i18n.ts";
import { cultureExperience, qrExperience } from "./experiences.ts";

export interface SiteTopic extends TopicPage {
  // Emergent taxonomy: a topic names its own category as a plain string.
  // The set of categories is derived from registered content, never a fixed union.
  category: string;
  ownerReviewKey: string;
  eyebrow: string;
  deck: string;
  searchTerms: string[];
  effort: string;
  workingAnswer: string;
  lastReviewed: string;
  changeNote: string;
  boundaryHeading: string;
  boundaryCopy: string;
  counterexamples: Array<{ title: string; body: string }>;
  sourceIntro: string;
  relatedIntro: string;
  review?: {
    fixtureId: string;
    fictional: true;
    publicBlockers: Array<{ id: string; label: string }>;
  };
}

// ─────────────────────────────────────────────────────────────
// English (default locale) — canonical source content.
// ─────────────────────────────────────────────────────────────

const qrPaymentStack: SiteTopic = {
  topicId: "c0e8f7a2-3b1d-4e9c-8f5a-1d2b3c4e5f60",
  slug: "qr-payment-stack",
  locale: "en",
  releaseState: "approved",
  category: "Everyday systems",
  ownerReviewKey: "qr",
  eyebrow: "EVERYDAY SYSTEMS / CHINA",
  openingQuestion: "Everyone pays by QR. So why can’t your card?",
  deck:
    "The square is only the front door. Your money still has to cross a funding source, a wallet bridge, and the merchant route.",
  shareText:
    "A QR code is only the front door. Diagnose the funding, wallet, and merchant route before relying on it.",
  primaryActionLabel: "Diagnose my route",
  deeperTitle: "The QR is not the payment.",
  searchTerms: ["payment", "QR", "wallet", "card", "evidence"],
  effort: "60 seconds",
  workingAnswer:
    "A visible QR code does not certify the road behind it. A visitor route can be available in principle while one link—or a live bank or platform check—remains uncertain.",
  lastReviewed: "2026-08-13",
  changeNote:
    "Working Answer v2. The visual is simpler; the evidence and transaction caveats remain unchanged.",
  boundaryHeading: "SAME SQUARE. DIFFERENT ROAD.",
  boundaryCopy:
    "Two people can scan the same sign while their money travels through different systems. This page diagnoses uncertainty; it cannot inspect an account or certify a purchase.",
  judgment: {
    recommendation:
      "Explain the payment stack, not the spectacle of a cashless country.",
    importance:
      "A failed small purchase can make a first trip feel inaccessible. A route model gives the visitor a practical next check without pretending to know a live decision.",
    audienceSignal: [
      "Short videos repeatedly make the QR code visible while hiding the systems behind it.",
      "This is a qualitative editorial signal, not proof of broad demand.",
    ],
    evidence: ["s01", "s02", "s03", "s04"],
    counterSignal: [
      "Access routes have improved, so 'foreign cards do not work' is too broad.",
      "Official availability still does not mean every account and merchant route behaves alike.",
    ],
    unknowns: [
      "Current app eligibility and issuing-bank checks",
      "Merchant configuration, fees, limits, connectivity, and live risk checks",
      "How often cash or foreign-funded routes are smooth across cities and merchant types",
    ],
    webPayoff:
      "Build one route, find its likely weak link, then open the evidence and caveats behind it.",
    nextTest:
      "Run a small consented field check by card category, wallet, merchant route, city, and date.",
  },
  answerLayers: [
    {
      id: "funding",
      prompt: "Where would the money actually come from?",
      payoff: "The funding source is only link one.",
    },
    {
      id: "wallet",
      prompt: "What bridge has been set up?",
      payoff: "An installed app is not the same as a completed route.",
    },
    {
      id: "merchant",
      prompt: "What route is the merchant offering?",
      payoff: "The same-looking square can expose different roads.",
    },
  ],
  explanation: [
    "Funding source — A mainland account, a card issued abroad, and a compatible overseas wallet are different inputs even when the checkout looks the same.",
    "Wallet and onboarding — Registration, identity steps, the wallet, and the issuing bank must recognize the route.",
    "Merchant route — A card terminal, merchant wallet QR, and a small displayed QR can expose different payment paths.",
    "Live checks — Authentication, platform rules, fees, limits, connectivity, and risk controls can still interrupt a complete-looking stack.",
  ],
  counterexamples: [
    {
      title: "A hotel is not a street stall.",
      body: "An international card terminal at one venue says nothing about a nearby wallet-only route.",
    },
    {
      title: "Cash can be protected and awkward.",
      body: "Policy supports cash while qualitative reporting describes merchants that rarely handle it or lack change.",
    },
    {
      title: "A new bridge can widen access without finishing the job.",
      body: "A rollout announcement does not establish current availability for every account or merchant.",
    },
  ],
  sourceIntro:
    "Official sources describe intended routes. Independent reporting shows practical friction. Neither can certify your next transaction.",
  sources: [
    {
      id: "s01",
      title: "Payment convenience policy",
      publisher: "People's Bank of China / State Council",
      date: "2024",
      url: "https://www.pbc.gov.cn/en/3688253/3689006/5300530/2024032216572428952.pdf",
      role: "Primary policy source",
      caveat: "Policy intent, not an implementation audit.",
    },
    {
      id: "s02",
      title: "Guide to Working and Living in China",
      publisher: "State Council",
      date: "2025 guide",
      url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025",
      role: "Primary visitor guidance",
      caveat: "Setup routes; product details can change.",
    },
    {
      id: "s03",
      title: "PayPal–WeChat Pay announcement",
      publisher: "Associated Press",
      date: "2026-05-28",
      url: "https://apnews.com/article/c871ddfb60aa87e9f1d6220c3131545d",
      role: "Independent reporting",
      caveat: "Announcement and initial scope, not universal availability.",
    },
    {
      id: "s04",
      title: "Cash and QR friction in Beijing",
      publisher: "Le Monde",
      date: "2025-06-28",
      url: "https://www.lemonde.fr/en/economy/article/2025/06/28/in-china-coins-and-banknotes-have-all-but-disappeared_6742800_19.html",
      role: "Independent reporting",
      caveat: "Qualitative reporting, not representative national data.",
    },
  ],
  relatedIntro: "These are research trails, not finished pages.",
  relatedRabbitHoles: [
    {
      id: "cash-accepted-vs-usable",
      label: "Cash is allowed. But is it usable at 8:00 a.m.?",
      href: "/explore/#cash-accepted-vs-usable",
      note: "Policy and field-practice trail",
    },
    {
      id: "cross-border-qr-bridges",
      label: "Why are cross-border QR bridges arriving after QR won?",
      href: "/explore/#cross-border-qr-bridges",
      note: "Interoperability trail",
    },
    {
      id: "phone-number-as-infrastructure",
      label: "When did a phone number become part of paying?",
      href: "/explore/#phone-number-as-infrastructure",
      note: "Needs its own source pack",
    },
    {
      id: "transit-is-another-stack",
      label: "Why can a café payment work while transit still fails?",
      href: "/explore/#transit-is-another-stack",
      note: "Working hypothesis only",
    },
  ],
  revisions: [
    {
      version: 1,
      date: "2026-08-13",
      note: "First sourced payment-stack Working Answer.",
    },
    {
      version: 2,
      date: "2026-08-13",
      note: "Visual simplified to one character, one route, and three gates.",
    },
  ],
  experience: qrExperience,
};

const chinamaxxingInference: SiteTopic = {
  topicId: "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  slug: "chinamaxxing-inference",
  locale: "en",
  releaseState: "approved",
  category: "Internet culture",
  ownerReviewKey: "culture",
  eyebrow: "INTERNET CULTURE / INFERENCE TEST",
  openingQuestion: "Chinamaxxing: appreciation, caricature—or both?",
  deck:
    "Test what one purpose-made fictional example lets you infer—and what still needs evidence.",
  shareText:
    "A visible action supports only a visible-action claim. Test one fictional example and keep the unknown in the sentence.",
  primaryActionLabel: "Test one inference",
  deeperTitle: "Five layers that look like one.",
  searchTerms: ["meme", "Chinamaxxing", "inference", "representation", "evidence"],
  effort: "3–4 minutes",
  workingAnswer:
    "A specific post can invite appreciation and still compress culture into portable cues. Which reading is warranted depends on the actor, words, selection, audience, context, and evidence. One example cannot settle the meme.",
  lastReviewed: "2026-08-13",
  changeNote:
    "Working Answer v1. Local inference test only; public release blockers B01–B10 remain open.",
  boundaryHeading: "SAME ACTION. DIFFERENT INFERENCE.",
  boundaryCopy:
    "The visible object does not contain a motive. Stated intent, representation, audience reception, and social effect are separate evidence questions.",
  judgment: {
    recommendation:
      "Build an inference test around one fictional fixture, not a trend explainer or moral verdict.",
    importance:
      "The useful question is how quickly a visible cue becomes a claim about intent, identity, audience, culture, or politics.",
    audienceSignal: [
      "The vocabulary appears in 2026 reporting about selected short-video practices and identity play.",
      "This is a qualitative entry hypothesis, not a current trend measurement.",
    ],
    evidence: ["s01", "s02", "s03", "s04", "r00"],
    counterSignal: [
      "The Guardian reported that the attention cycle may already be fading.",
      "Published examples and named perspectives do not create a platform-wide verdict.",
    ],
    unknowns: [
      "Real participant intent and audience reception",
      "Current prevalence, durability, and platform distribution",
      "Algorithmic, political, or state causation and any wider effect",
    ],
    webPayoff:
      "Hold one fictional scene still, separate five evidence layers, and revise one sentence.",
    nextTest:
      "Run a small comprehension test plus distinct, non-representative China-based and diaspora reviews.",
  },
  answerLayers: [
    {
      id: "observation",
      prompt: "What can you literally see?",
      payoff: "Observation does not contain intent or effect.",
    },
    {
      id: "evidence-reach",
      prompt: "How far does each piece of evidence reach?",
      payoff: "A source can support one layer without supporting the next.",
    },
    {
      id: "framing",
      prompt: "Which named lens is asking the question?",
      payoff: "Framings are attributed lenses, not votes.",
    },
    {
      id: "unknown",
      prompt: "What is still missing?",
      payoff: "Unknown belongs inside the conclusion.",
    },
    {
      id: "revision",
      prompt: "Can the claim become smaller and stronger?",
      payoff: "A scoped sentence is the result, not a score.",
    },
  ],
  explanation: [
    "Observable action — Words, objects, sequence, and action. Description should not smuggle in motive or effect.",
    "Stated intent — A contextualized account can support what an actor says they meant. It cannot control reception.",
    "Cultural framing — Participation, projection, diaspora memory, language history, and public diplomacy ask different questions.",
    "Audience reception — A view, like, share, or comment does not identify what a person concluded.",
    "Social effect — Claims about behavior, politics, or attitude change require evidence beyond exposure.",
  ],
  counterexamples: [
    {
      title: "Affection does not settle representation.",
      body: "A creator can sincerely admire a practice and still compress a large category into quick cues.",
    },
    {
      title: "Compression is not automatically harm.",
      body: "A short post can be selective yet contextualized, credited, and useful.",
    },
    {
      title: "The same label can carry critique.",
      body: "A person can parody the meme, reject it, or discuss it without participating.",
    },
    {
      title: "Named discomfort is not a universal veto.",
      body: "A named account establishes that speaker's perspective, not a group consensus.",
    },
    {
      title: "A large count is not a persuasion result.",
      body: "Exposure does not reveal agreement, motive, or downstream change.",
    },
    {
      title: "‘Both’ is not always the answer.",
      body: "Different posts can support appreciation, caricature, commentary, both, or neither.",
    },
  ],
  sourceIntro:
    "These sources document selected examples and named interpretations. They do not measure the whole platform or decide every post's meaning.",
  sources: [
    {
      id: "s01",
      title: "Reported examples and mixed reactions",
      publisher: "Associated Press",
      date: "2026-04-16",
      url: "https://apnews.com/article/china-soft-power-rise-c6aede1c6eb66a776a7ae3b5477e2661",
      role: "Independent reporting",
      caveat: "Named accounts and dated snapshots; not representative sentiment.",
    },
    {
      id: "s02",
      title: "Participation, projection, and memory",
      publisher: "TIME",
      date: "2026-02-13",
      url: "https://time.com/7378425/becoming-chinese-era-chinamaxxing-memes-trend-lunar-new-year-us/",
      role: "Independent reporting",
      caveat: "Multiple framings; not a prevalence or causal study.",
    },
    {
      id: "s03",
      title: "Ambivalence and a fading-attention counter-signal",
      publisher: "The Guardian",
      date: "2026-03-23",
      url: "https://www.theguardian.com/lifeandstyle/2026/mar/23/chinamaxxing-chinese-culture-becomes-a-meme",
      role: "Independent reporting",
      caveat: "Dated journalistic assessment; current durability unknown.",
    },
    {
      id: "s04",
      title: "The ‘-maxxing’ suffix",
      publisher: "Merriam-Webster",
      date: "Date not captured",
      url: "https://www.merriam-webster.com/slang/-maxing",
      role: "Language reference",
      caveat: "Linguistic context only; not evidence of a speaker's motive.",
    },
    {
      id: "r00",
      title: "DEMO-01 — purpose-made fictional fixture",
      publisher: "True or False China (fictional)",
      date: "2026-08-13",
      url: "https://example.org/fixtures/DEMO-01",
      role: "Fictional demonstration object",
      caveat:
        "Purpose-made fiction. Supports observation of the scene only; it is not a source about real people, reception, or effect.",
    },
  ],
  relatedIntro: "These are open research trails, not claims of current momentum.",
  relatedRabbitHoles: [
    {
      id: "maxxing-word-journey",
      label: "How did ‘-maxxing’ travel into mainstream jokes?",
      href: "/explore/#maxxing-word-journey",
      note: "Needs a dedicated language-source pack",
    },
    {
      id: "which-china",
      label: "What does ‘Chinese’ name in this sentence?",
      href: "/explore/#which-china",
      note: "A category and language trail",
    },
    {
      id: "engagement-is-not-persuasion",
      label: "A million views—but what changed?",
      href: "/explore/#engagement-is-not-persuasion",
      note: "Needs methods and measurement sources",
    },
    {
      id: "context-as-design",
      label: "Can a short post add context without killing the joke?",
      href: "/explore/#context-as-design",
      note: "Working editorial hypothesis",
    },
    {
      id: "after-the-meme",
      label: "What remains after the phrase fades?",
      href: "/explore/#after-the-meme",
      note: "Future research candidate",
    },
  ],
  revisions: [
    {
      version: 1,
      date: "2026-08-13",
      note: "First fictional-fixture inference test under the R00 evidence ceiling.",
    },
  ],
  claims: [
    {
      id: "i01",
      claim: "The fixture groups three practices under a 'Chinese era' joke.",
      status: "SUPPORTED BY OBSERVATION",
      reveal: "The objects, actions, and text appear together in the fictional fixture.",
      sourceIds: ["r00"],
    },
    {
      id: "i02",
      claim: "The fictional author meant the joke affectionately.",
      status: "SUPPORTED BY THE FICTIONAL AUTHOR NOTE",
      reveal: "This supports stated intent for DEMO-01 only. It does not settle reception or effect.",
      sourceIds: ["r00"],
    },
    {
      id: "i03",
      claim: "The fixture compresses a large category into three quick cues.",
      status: "SUPPORTED ANALYSIS OF SELECTION",
      reveal: "The purpose-made note says the cues were selected to make the joke read quickly. That does not label the selection as harmful.",
      sourceIds: ["r00"],
    },
    {
      id: "i04",
      claim: "The scene may help some viewers imagine everyday life as approachable.",
      status: "PLAUSIBLE FRAMING, NOT MEASURED EFFECT",
      reveal: "A humanizing reading is possible. This fixture has no real audience or audience data.",
      sourceIds: [],
    },
    {
      id: "i05",
      claim: "The post changes political attitudes toward China.",
      status: "NOT SUPPORTED",
      reveal: "Nothing here measures an attitude before and after exposure.",
      sourceIds: [],
    },
    {
      id: "i06",
      claim: "These practices are uniquely Chinese.",
      status: "NOT SUPPORTED",
      reveal: "The practices can appear across households and cultures.",
      sourceIds: [],
    },
    {
      id: "i07",
      claim: "One example settles the whole meme.",
      status: "NOT SUPPORTED BY ONE EXAMPLE",
      reveal: "The unit of analysis is too broad. Actors, posts, audiences, and contexts differ.",
      sourceIds: [],
    },
  ],
  framings: [
    {
      id: "participation",
      title: "Participation + appreciation",
      body: "TIME and AP report named examples of playful participation in selected practices and everyday life.",
      boundary: "Not every participant's motive; not a broad attitude shift.",
      sourceIds: ["s02", "s01"],
    },
    {
      id: "projection",
      title: "Projection + compression",
      body: "TIME describes a projected, simplified image onto which selected examples place things they feel are missing elsewhere.",
      boundary: "Does not establish why any individual joined.",
      sourceIds: ["s02"],
    },
    {
      id: "memory",
      title: "Diaspora memory + flattening",
      body: "AP, TIME, and the Guardian report named people holding pride and discomfort together around once-stigmatized cues.",
      boundary: "Named accounts are not a group consensus.",
      sourceIds: ["s01", "s02", "s03"],
    },
    {
      id: "language",
      title: "The baggage of '-maxxing'",
      body: "Merriam-Webster documents a suffix that travelled through different online settings.",
      boundary: "Word history does not establish a current speaker's intent.",
      sourceIds: ["s04"],
    },
    {
      id: "soft-power-question",
      title: "A public-diplomacy question",
      body: "AP places the meme beside official soft-power interest, making public diplomacy a question worth examining.",
      boundary: "Does not establish state causation or political effect.",
      sourceIds: ["s01"],
    },
  ],
  experience: cultureExperience,
  review: {
    fixtureId: "DEMO-01",
    fictional: true,
    publicBlockers: [
      { id: "B01", label: "User publication approval" },
      { id: "B02", label: "Source currentness refresh" },
      { id: "B03", label: "Consented participant evidence" },
      { id: "B04", label: "Distinct perspective review" },
      { id: "B05", label: "Comprehension test" },
      { id: "B06", label: "Representation review" },
      { id: "B07", label: "Rendered fixture provenance sign-off" },
      { id: "B08", label: "Accessibility verification" },
      { id: "B09", label: "Share-context review" },
      { id: "B10", label: "External destination confirmation" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Chinese (zh) — same Topic identity, same claim/source IDs,
// only the localized prose differs. Machine translation draft.
// ─────────────────────────────────────────────────────────────

const qrPaymentStackZh: SiteTopic = {
  topicId: "c0e8f7a2-3b1d-4e9c-8f5a-1d2b3c4e5f60",
  slug: "qr-payment-stack",
  locale: "zh",
  releaseState: "draft",
  translationState: "DRAFT_TRANSLATION",
  category: "日常系统",
  ownerReviewKey: "qr",
  eyebrow: "日常系统 / 中国",
  openingQuestion: "大家都用二维码付款。那你的卡为什么不行？",
  deck: "那个方块只是前门。你的钱仍要穿过资金来源、钱包通道和商户路线。",
  shareText:
    "二维码只是前门。在依赖它之前，先诊断资金来源、钱包通道与商户路线。",
  primaryActionLabel: "诊断我的路线",
  deeperTitle: "二维码不是支付本身。",
  searchTerms: ["支付", "二维码", "钱包", "银行卡", "证据"],
  effort: "60 秒",
  workingAnswer:
    "一个看得见的二维码，并不能证明它背后的路是通的。一条访客路线原则上可以走通，但其中某一环——或某次实时的银行或平台核查——仍可能不确定。",
  lastReviewed: "2026-08-13",
  changeNote: "Working Answer v2。视觉更简单；证据与交易注意事项保持不变。（机器翻译初稿，待人工校对）",
  boundaryHeading: "同一个方块。不同的路。",
  boundaryCopy:
    "两个人可以扫同一个牌子，钱却走不同的系统。这个页面诊断不确定性，却无法查看某个账户，也无法证明某笔购买成立。",
  judgment: {
    recommendation: "解释支付栈，而不是一个无现金国家的奇观。",
    importance:
      "一笔失败的小额支付，可能让第一次到访的人觉得寸步难行。路线模型给访客一个实用的下一步核查，而不假装知道某个实时决定。",
    audienceSignal: [
      "短视频反复让二维码可见，却把背后的系统藏起来。",
      "这是一个定性的编辑信号，不是广泛需求的证据。",
    ],
    evidence: ["s01", "s02", "s03", "s04"],
    counterSignal: [
      "接入路线已经改善，所以“外国卡不能用”说得太绝对。",
      "官方“可用”仍不意味着每个账户和商户路线表现一致。",
    ],
    unknowns: [
      "当前 App 的资格与发卡行核查",
      "商户配置、费用、限额、连接性与实时风控",
      "现金或外资路线在不同城市与商户类型中顺畅的频率",
    ],
    webPayoff: "先建一条路线，找到它最可能的薄弱点，再展开它背后的证据与注意事项。",
    nextTest: "按卡类别、钱包、商户路线、城市、日期，做一小批经同意的实地核查。",
  },
  answerLayers: [
    {
      id: "funding",
      prompt: "钱实际上会从哪来？",
      payoff: "资金来源只是第一环。",
    },
    {
      id: "wallet",
      prompt: "已经搭好了哪座桥？",
      payoff: "装了 App，不等于走完了路线。",
    },
    {
      id: "merchant",
      prompt: "商户提供的是哪条路线？",
      payoff: "看起来一样的方块，可能露出不同的路。",
    },
  ],
  explanation: [
    "资金来源 — 大陆账户、境外发行的卡、兼容的海外钱包，即使结账界面一样，也是不同的输入。",
    "钱包与开户 — 注册、身份验证、钱包与发卡行，都必须认得这条路。",
    "商户路线 — 刷卡终端、商户钱包二维码、一张小二维码，可能露出不同的支付路径。",
    "实时核查 — 身份验证、平台规则、费用、限额、连接与风控，仍可能打断一套看起来完整的栈。",
  ],
  counterexamples: [
    {
      title: "酒店不是街边摊。",
      body: "一家场馆的国际卡终端，说明不了隔壁只收钱包的路线。",
    },
    {
      title: "现金可以被保护，也可以很尴尬。",
      body: "政策支持现金，而定性的报道描述有些商户很少收现金，或找不开零钱。",
    },
    {
      title: "新桥可以拓宽入口，却未必走完这条路。",
      body: "一次开通公告，不等于每个账户或商户当下都可用。",
    },
  ],
  sourceIntro:
    "官方来源描述意图中的路线。独立报道呈现实际的摩擦。两者都无法为你的下一笔交易背书。",
  sources: [
    {
      id: "s01",
      title: "支付便利政策",
      publisher: "People's Bank of China / State Council",
      date: "2024",
      url: "https://www.pbc.gov.cn/en/3688253/3689006/5300530/2024032216572428952.pdf",
      role: "主要政策来源",
      caveat: "政策意图，不是落地审计。",
    },
    {
      id: "s02",
      title: "在华工作与生活指南",
      publisher: "State Council",
      date: "2025 guide",
      url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025",
      role: "主要访客指引",
      caveat: "搭建路线；产品细节可能变化。",
    },
    {
      id: "s03",
      title: "PayPal–微信支付 公告",
      publisher: "Associated Press",
      date: "2026-05-28",
      url: "https://apnews.com/article/c871ddfb60aa87e9f1d6220c3131545d",
      role: "独立报道",
      caveat: "公告与初始范围，非普遍可用。",
    },
    {
      id: "s04",
      title: "北京现金与二维码的摩擦",
      publisher: "Le Monde",
      date: "2025-06-28",
      url: "https://www.lemonde.fr/en/economy/article/2025/06/28/in-china-coins-and-banknotes-have-all-but-disappeared_6742800_19.html",
      role: "独立报道",
      caveat: "定性报道，非全国代表性数据。",
    },
  ],
  relatedIntro: "这些是研究的线索，不是已经写完的页面。",
  relatedRabbitHoles: [
    {
      id: "cash-accepted-vs-usable",
      label: "现金被允许。可早上八点它真的好用吗？",
      href: "/zh/explore/#cash-accepted-vs-usable",
      note: "政策与实践的线索",
    },
    {
      id: "cross-border-qr-bridges",
      label: "跨境二维码的桥，为什么在二维码胜出之后才来？",
      href: "/zh/explore/#cross-border-qr-bridges",
      note: "互操作性线索",
    },
    {
      id: "phone-number-as-infrastructure",
      label: "电话号码是什么时候变成支付的一部分的？",
      href: "/zh/explore/#phone-number-as-infrastructure",
      note: "需要独立的来源包",
    },
    {
      id: "transit-is-another-stack",
      label: "为什么 café 支付能用，而公交却还不行？",
      href: "/zh/explore/#transit-is-another-stack",
      note: "仅为工作假设",
    },
  ],
  revisions: [
    {
      version: 1,
      date: "2026-08-13",
      note: "第一版有来源支撑的支付栈 Working Answer。",
    },
    {
      version: 2,
      date: "2026-08-13",
      note: "视觉简化为一个角色、一条路线、三道关卡。",
    },
  ],
  experience: qrExperience,
};

const chinamaxxingInferenceZh: SiteTopic = {
  topicId: "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  slug: "chinamaxxing-inference",
  locale: "zh",
  releaseState: "draft",
  translationState: "DRAFT_TRANSLATION",
  category: "网络文化",
  ownerReviewKey: "culture",
  eyebrow: "网络文化 / 推断练习",
  openingQuestion: "Chinamaxxing：是欣赏，是 caricature，还是两者兼而有之？",
  deck: "测一测：一个刻意虚构的示例，能让你推断出什么——又有哪些仍需证据。",
  shareText:
    "一个可见的动作，只支持“可见动作”这一层判断。测一个虚构示例，并把未知留在句子里。",
  primaryActionLabel: "测一次推断",
  deeperTitle: "看似一层，实则五层。",
  searchTerms: ["梗", "Chinamaxxing", "推断", "表征", "证据"],
  effort: "3–4 分钟",
  workingAnswer:
    "一条具体的帖子，可以既邀请欣赏，又把文化压缩成便于携带的片段。哪一种解读站得住，取决于行为者、措辞、选取、受众、语境和证据。一个例子，无法为整个梗下结论。",
  lastReviewed: "2026-08-13",
  changeNote: "Working Answer v1。仅本地推断练习；公开阻断项 B01–B10 仍未关闭。（机器翻译初稿，待人工校对）",
  boundaryHeading: "同一个动作。不同的推断。",
  boundaryCopy:
    "看得见的物件里，并不包含一个动机。被说出的意图、表征、受众反应和社会效果，是各自独立的证据问题。",
  judgment: {
    recommendation: "围绕一个虚构示例做推断练习，而不是趋势解说或道德裁决。",
    importance:
      "有用的问题是：一个可见的线索，多快会变成关于意图、身份、受众、文化或政治的断言。",
    audienceSignal: [
      "这套词汇出现在 2026 年关于部分短视频实践与身份扮演的报道中。",
      "这是一个定性的入口假设，不是对当前趋势的测量。",
    ],
    evidence: ["s01", "s02", "s03", "s04", "r00"],
    counterSignal: [
      "The Guardian 报道，注意力周期可能已经在退潮。",
      "已发表的例子与具名视角，并不构成平台范围内的裁决。",
    ],
    unknowns: [
      "真实参与者的意图与受众反应",
      "当前的普遍程度、持续时间与平台分布",
      "算法、政治或国家层面的因果，以及任何更广泛的效果",
    ],
    webPayoff: "让一个虚构场景静止，分开五层证据，再修订出一句话。",
    nextTest: "做一小批理解测试，外加彼此不同、不具代表性的中国本地与海外华人评审。",
  },
  answerLayers: [
    {
      id: "observation",
      prompt: "你真正看得见的是什么？",
      payoff: "观察里不含意图，也不含效果。",
    },
    {
      id: "evidence-reach",
      prompt: "每条证据能抵达多远？",
      payoff: "一个来源可以支撑某一层，却支撑不了下一层。",
    },
    {
      id: "framing",
      prompt: "发问的是哪个具名镜头？",
      payoff: "解读框架是被归因的透镜，不是投票。",
    },
    {
      id: "unknown",
      prompt: "还缺什么？",
      payoff: "未知应当留在结论里。",
    },
    {
      id: "revision",
      prompt: "这句话能变得更小、更强吗？",
      payoff: "范围收紧的句子就是结果，不是分数。",
    },
  ],
  explanation: [
    "可见动作 — 文字、物件、顺序与动作。描述不应偷偷塞进动机或效果。",
    "被说出的意图 — 有语境的说明，可以支撑“行为者说自己想表达什么”。它控制不了受众反应。",
    "文化框架 — 参与、投射、侨民记忆、语言史、公共外交，问的是不同的问题。",
    "受众反应 — 一个赞、一个看、一个转、一条评论，都认不出一个人到底得出了什么结论。",
    "社会效果 — 关于行为、政治或态度改变的断言，需要的证据远超“曝光过”。",
  ],
  counterexamples: [
    {
      title: "欣赏并不解决表征问题。",
      body: "一个创作者可以真诚地欣赏某种实践，同时仍把一大类事物压缩成几个快捷片段。",
    },
    {
      title: "压缩不等于伤害。",
      body: "一条短帖子可以有选择性，却也有语境、有署名、有用。",
    },
    {
      title: "同一个标签也能承载批评。",
      body: "一个人可以戏仿这个梗、拒绝它，或讨论它而不参与。",
    },
    {
      title: "具名的尴尬不是全体否决。",
      body: "具名账号确立的是那个说话者的视角，不是群体共识。",
    },
    {
      title: "数量大不等于说服有效。",
      body: "曝光并没揭示认同、动机或后续的转变。",
    },
    {
      title: "“两者皆有”不总是答案。",
      body: "不同的帖子可以支持欣赏、讽刺、评论、两者皆有，或两者皆非。",
    },
  ],
  sourceIntro:
    "这些来源记录了被选用的例子与具名的解读。它们并不测量整个平台，也不替每一条帖子定下含义。",
  sources: [
    {
      id: "s01",
      title: "已报道的例子与混合反应",
      publisher: "Associated Press",
      date: "2026-04-16",
      url: "https://apnews.com/article/china-soft-power-rise-c6aede1c6eb66a776a7ae3b5477e2661",
      role: "独立报道",
      caveat: "具名账号与有时间戳的快照；不代表整体情绪。",
    },
    {
      id: "s02",
      title: "参与、投射与记忆",
      publisher: "TIME",
      date: "2026-02-13",
      url: "https://time.com/7378425/becoming-chinese-era-chinamaxxing-memes-trend-lunar-new-year-us/",
      role: "独立报道",
      caveat: "多种框架；非普遍程度或因果研究。",
    },
    {
      id: "s03",
      title: "矛盾态度与注意力退潮的反向信号",
      publisher: "The Guardian",
      date: "2026-03-23",
      url: "https://www.theguardian.com/lifeandstyle/2026/mar/23/chinamaxxing-chinese-culture-becomes-a-meme",
      role: "独立报道",
      caveat: "有时间戳的新闻判断；当前持久性未知。",
    },
    {
      id: "s04",
      title: "“-maxxing” 后缀",
      publisher: "Merriam-Webster",
      date: "Date not captured",
      url: "https://www.merriam-webster.com/slang/-maxing",
      role: "语言参考",
      caveat: "仅语言语境；不代表对说话者动机的证据。",
    },
    {
      id: "r00",
      title: "DEMO-01 — 刻意制作的虚构示例",
      publisher: "真假中国（虚构）",
      date: "2026-08-13",
      url: "https://example.org/fixtures/DEMO-01",
      role: "虚构演示物件",
      caveat: "刻意虚构。仅支持对该场景的观察；它不是关于真实人物、受众或效果的来源。",
    },
  ],
  relatedIntro: "这些是开放的研究线索，不是对当前势头的断言。",
  relatedRabbitHoles: [
    {
      id: "maxxing-word-journey",
      label: "“-maxxing” 是怎么走进主流笑话的？",
      href: "/zh/explore/#maxxing-word-journey",
      note: "需要专门的词汇来源包",
    },
    {
      id: "which-china",
      label: "这句话里的“中国”，到底指什么？",
      href: "/zh/explore/#which-china",
      note: "一个分类与语言的线索",
    },
    {
      id: "engagement-is-not-persuasion",
      label: "一百万次观看——可到底改变了什么？",
      href: "/zh/explore/#engagement-is-not-persuasion",
      note: "需要方法与测量的来源",
    },
    {
      id: "context-as-design",
      label: "一条短帖子，能在不杀死笑点的前提下加上语境吗？",
      href: "/zh/explore/#context-as-design",
      note: "工作层面的编辑假设",
    },
    {
      id: "after-the-meme",
      label: "这个短语退潮之后，还剩下什么？",
      href: "/zh/explore/#after-the-meme",
      note: "未来的研究候选",
    },
  ],
  revisions: [
    {
      version: 1,
      date: "2026-08-13",
      note: "在 R00 证据上限下，第一个虚构示例推断练习。",
    },
  ],
  claims: [
    {
      id: "i01",
      claim: "这个示例把三种实践收进一个“中国时代”的玩笑里。",
      status: "由观察支持",
      reveal: "物件、动作与文字，在这个虚构示例里同时出现。",
      sourceIds: ["r00"],
    },
    {
      id: "i02",
      claim: "虚构作者是以善意的语气开这个玩笑的。",
      status: "由虚构作者说明支持",
      reveal: "这仅支持 DEMO-01 被说出的意图。它不解决受众反应或效果。",
      sourceIds: ["r00"],
    },
    {
      id: "i03",
      claim: "这个示例把一个庞大的类别压缩成三个快捷片段。",
      status: "由选择分析支持",
      reveal: "刻意说明指出，挑选这些片段是为了让玩笑读起来快。这并不等于给这种选取贴上“有害”的标签。",
      sourceIds: ["r00"],
    },
    {
      id: "i04",
      claim: "这个场景或许能让一些观众觉得日常生活是亲切可亲近的。",
      status: "看似合理的解读，未经验证的效果",
      reveal: "一种人性化的解读是可能的。这个示例没有真实受众，也没有受众数据。",
      sourceIds: [],
    },
    {
      id: "i05",
      claim: "这个帖子改变了对中国的政治态度。",
      status: "不支持",
      reveal: "这里没有任何东西测量过曝光前后的态度。",
      sourceIds: [],
    },
    {
      id: "i06",
      claim: "这些实践是中国独有的。",
      status: "不支持",
      reveal: "这些实践可以出现在不同家庭与文化中。",
      sourceIds: [],
    },
    {
      id: "i07",
      claim: "一个例子就为整个梗下了定论。",
      status: "单一示例不足以支持",
      reveal: "分析的单位太宽。行为者、帖子、受众与语境各不相同。",
      sourceIds: [],
    },
  ],
  framings: [
    {
      id: "participation",
      title: "参与 + 欣赏",
      body: "TIME 与 AP 报道了具名例子：在部分实践与日常生活中带有玩味的参与。",
      boundary: "不是每个参与者的动机；也不是广泛的态度转变。",
      sourceIds: ["s02", "s01"],
    },
    {
      id: "projection",
      title: "投射 + 压缩",
      body: "TIME 描述了一幅被投射、被简化的画像，被选中的例子把自认为在别处缺失的东西放了上去。",
      boundary: "并不能据此确立任何个体为何参与。",
      sourceIds: ["s02"],
    },
    {
      id: "memory",
      title: "侨民记忆 + 扁平化",
      body: "AP、TIME 与 The Guardian 报道了具名的人：围绕曾被污名化的片段，他们同时怀有骄傲与不适。",
      boundary: "具名账号不等于群体共识。",
      sourceIds: ["s01", "s02", "s03"],
    },
    {
      id: "language",
      title: "“-maxxing” 这个词的 baggage",
      body: "Merriam-Webster 记录了一个从不同网络语境旅行过来的后缀。",
      boundary: "词的历史，并不能确立某个说话者当下的意图。",
      sourceIds: ["s04"],
    },
    {
      id: "soft-power-question",
      title: "一个公共外交问题",
      body: "AP 把这个梗放在官方软实力的兴趣旁边，使公共外交成为一个值得审视的问题。",
      boundary: "并不能确立国家层面的因果或政治效果。",
      sourceIds: ["s01"],
    },
  ],
  experience: cultureExperience,
  review: {
    fixtureId: "DEMO-01",
    fictional: true,
    publicBlockers: [
      { id: "B01", label: "User publication approval" },
      { id: "B02", label: "Source currentness refresh" },
      { id: "B03", label: "Consented participant evidence" },
      { id: "B04", label: "Distinct perspective review" },
      { id: "B05", label: "Comprehension test" },
      { id: "B06", label: "Representation review" },
      { id: "B07", label: "Rendered fixture provenance sign-off" },
      { id: "B08", label: "Accessibility verification" },
      { id: "B09", label: "Share-context review" },
      { id: "B10", label: "External destination confirmation" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Topic registry — single source of truth, locale-aware.
// ─────────────────────────────────────────────────────────────

export const topics: SiteTopic[] = [qrPaymentStack, chinamaxxingInference];
export const zhTopics: SiteTopic[] = [qrPaymentStackZh, chinamaxxingInferenceZh];

export const allTopics: SiteTopic[] = [...topics, ...zhTopics];

export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

export function getTopicsByLocale(locale: Locale): SiteTopic[] {
  return allTopics.filter((topic) => topic.locale === locale);
}

export function getTopic(slug: string, locale: Locale): SiteTopic | undefined {
  return allTopics.find((topic) => topic.slug === slug && topic.locale === locale);
}

export function getTopicById(topicId: string, locale: Locale): SiteTopic | undefined {
  return allTopics.find((topic) => topic.topicId === topicId && topic.locale === locale);
}
