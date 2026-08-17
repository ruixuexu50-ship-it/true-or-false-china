import type { Locale } from "./i18n.ts";

export type ObservationChoice =
  | "observable"
  | "intent-claim"
  | "authenticity-claim"
  | "effect-claim";

export type InferenceLayer =
  | "observation"
  | "stated-intent"
  | "cultural-framing"
  | "social-effect";

export interface ObservationClassification {
  layer: InferenceLayer;
  addedInference: boolean;
}

export function classifyObservation(
  choice: ObservationChoice,
): ObservationClassification {
  if (choice === "observable") {
    return { layer: "observation", addedInference: false };
  }
  if (choice === "intent-claim") {
    return { layer: "stated-intent", addedInference: true };
  }
  if (choice === "effect-claim") {
    return { layer: "social-effect", addedInference: true };
  }
  return { layer: "cultural-framing", addedInference: true };
}

export function layerLabel(locale: Locale, layer: InferenceLayer): string {
  return layerLabels[locale][layer];
}

const layerLabels: Record<Locale, Record<InferenceLayer, string>> = {
  en: {
    observation: "observation",
    "stated-intent": "stated intent",
    "cultural-framing": "cultural framing",
    "social-effect": "social effect",
  },
  zh: {
    observation: "观察",
    "stated-intent": "明确表达的意图",
    "cultural-framing": "文化解读",
    "social-effect": "社会效果",
  },
};

const scopeRules = [
  {
    id: "broad-actor",
    pattern: /\b(the west|westerners|gen z|chinese people|diaspora|tiktok users|everyone)\b/i,
  },
  {
    id: "prevalence",
    pattern: /\b(millions|most|widespread|growing|exploding|now)\b/i,
  },
  {
    id: "causation",
    pattern: /\b(caused|made|changed|converted|proves|because of the algorithm)\b/i,
  },
  {
    id: "universal-verdict",
    pattern: /\bis (appreciation|appropriation|authentic|offensive|both)\b/i,
  },
  {
    id: "collapsed-category",
    pattern: /\bchinese culture\b/i,
  },
] as const;

const scopeMessages: Record<Locale, Record<string, string>> = {
  en: {
    "broad-actor": "Can you name the specific actor or source instead?",
    prevalence: "What dated measurement supports this scale or direction?",
    causation: "What evidence connects exposure to this effect?",
    "universal-verdict":
      "Can you scope the verdict to this example and name the evidence for each part?",
    "collapsed-category":
      "Which object do you mean: state, nationality, ethnicity, diaspora, family practice, or popular culture?",
  },
  zh: {
    "broad-actor": "能否点出具体的主体或来源？",
    prevalence: "有什么带日期的量化依据，支撑这个规模或方向？",
    causation: "有什么证据，能把“接触”和这个“效果”连起来？",
    "universal-verdict": "能否把这个判断限定到这个例子，并分别为每一部分点出证据？",
    "collapsed-category": "你指的是哪一种“中国”：国家、民族、族群、海外华人、家庭习俗，还是流行文化？",
  },
};

export function findScopePrompts(text: string, locale: Locale = "en") {
  return scopeRules
    .filter((rule) => rule.pattern.test(text))
    .map(({ id }) => ({ id, message: scopeMessages[locale][id] }));
}

const framingLabels: Record<Locale, Record<string, string>> = {
  en: {
    participation: "A participation lens",
    projection: "A projection lens",
    memory: "A diaspora-memory lens",
    language: "A language-history lens",
    "soft-power-question": "A public-diplomacy lens",
  },
  zh: {
    participation: "一个参与视角",
    projection: "一个投射视角",
    memory: "一个海外华人记忆视角",
    language: "一个语言史视角",
    "soft-power-question": "一个公共外交视角",
  },
};

const unknownLabels: Record<Locale, Record<string, string>> = {
  en: {
    "real-participant": "what a real participant would mean",
    "audience-reception": "audience reception",
    "social-effect": "any social effect",
    prevalence: "current prevalence",
    durability: "durability",
    causation: "causation",
    "category-scope": "which meaning of Chinese is in play",
  },
  zh: {
    "real-participant": "真实参与者意味着什么",
    "audience-reception": "受众反应",
    "social-effect": "任何社会效果",
    prevalence: "当前普及程度",
    durability: "能否持久",
    causation: "因果关系",
    "category-scope": "此刻“中国”到底指什么",
  },
};

const observationFragments: Record<Locale, Record<string, string>> = {
  en: {
    "three-cues-joke": "three everyday cues are grouped under one joke",
    "objects-by-identity-joke": "the three objects appear beside one identity joke",
  },
  zh: {
    "three-cues-joke": "三个日常片段被收进同一个玩笑里",
    "objects-by-identity-joke": "三件物件出现在同一个身份玩笑旁",
  },
};

const authorIntentFragments: Record<Locale, Record<string, string>> = {
  en: {
    "affectionate-intent": "the fictional author describes affectionate intent",
    "read-quickly": "the cues were chosen to read quickly",
  },
  zh: {
    "affectionate-intent": "这位虚构作者描述了善意的意图",
    "read-quickly": "这些线索是为了让这个玩笑读起来快而被挑中的",
  },
};

function describeAuthorIntent(locale: Locale, key: string): string {
  if (key === "read-quickly") {
    return locale === "zh"
      ? "这位虚构作者的说明写道，这些线索是为了让玩笑读起来快而被挑中的。"
      : "The fictional author note says the cues were chosen to read quickly.";
  }
  return locale === "zh"
    ? "这位虚构作者的说明描述了善意的意图。"
    : "The fictional author note describes affectionate intent.";
}

export interface ScopedInferenceInput {
  observation: keyof typeof observationFragments.en;
  authorIntent: keyof typeof authorIntentFragments.en;
  framing: keyof typeof framingLabels.en;
  unknown: keyof typeof unknownLabels.en;
}

export function buildScopedInference(
  input: ScopedInferenceInput,
  locale: Locale = "en",
) {
  const observation = observationFragments[locale][input.observation];
  const authorNote = describeAuthorIntent(locale, input.authorIntent);
  const framing = framingLabels[locale][input.framing];
  const unknown = unknownLabels[locale][input.unknown];
  const sentence =
    locale === "zh"
      ? `在这个虚构例子里，我能观察到：${observation}。${authorNote} ${framing}有助于解读这个选择，而${unknown}仍是未知。`
      : `In this fictional example, I can observe that ${observation}. ${authorNote} ${framing} helps interpret that selection, while ${unknown} remains unknown.`;
  return {
    status: "revision-complete" as const,
    sentence,
  };
}
