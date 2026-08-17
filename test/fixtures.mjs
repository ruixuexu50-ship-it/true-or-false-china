export const localSite = {
  name: "Working Answers",
  isPlaceholderName: true,
};

export const publicSite = {
  name: "The Useful Detour",
  isPlaceholderName: false,
};

export const topicFixture = {
  topicId: "fixture-topic-id-0001",
  slug: "a-question-worth-testing",
  locale: "en",
  releaseState: "locally-reviewed",
  openingQuestion: "What changes when the obvious answer stops working?",
  shareText: "A short honest summary of what this question currently supports.",
  primaryActionLabel: "Test the mechanism",
  deeperTitle: "The mechanism behind the obvious answer.",
  judgment: {
    recommendation: "recommended",
    importance: "It changes what a visitor can do next.",
    audienceSignal: ["People ask how the mechanism works."],
    evidence: ["primary-source-1"],
    counterSignal: ["The friction is not universal."],
    unknowns: ["How often this affects first-time visitors."],
    webPayoff: "A decision path the short video cannot hold.",
    nextTest: "Compare payoff reach after 50 qualified visits.",
  },
  answerLayers: [
    {
      id: "first-payoff",
      prompt: "Choose the route you would try first.",
      payoff: "The route matters more than the object in your hand.",
    },
  ],
  explanation: ["The mechanism has more than one gate."],
  sources: [
    {
      id: "primary-source-1",
      title: "Primary source",
      url: "https://example.org/primary",
      role: "Supports the core mechanism.",
    },
  ],
  relatedRabbitHoles: [
    {
      id: "next-question",
      label: "What changes one layer later?",
      href: "/explore/#next-question",
    },
  ],
  revisions: [
    {
      version: 1,
      date: "2026-08-13",
      note: "Local review shell.",
    },
  ],
  experience: {
    implementationId: "fixture-experience-id",
    palette: {
      background: "#f2f5ff",
      ink: "#10172b",
      accent: "#ff4f7b",
    },
    character: {
      id: "route-scout",
      name: "Route Scout",
      description: "An original guide character for this topic.",
      original: true,
    },
    visualStates: [
      { id: "waiting", label: "Waiting at the first gate" },
      { id: "payoff", label: "The route becomes visible" },
    ],
    interaction: {
      id: "route-choice",
      type: "choice",
      changesUnderstanding: "Reveals which gate the user assumed away.",
    },
    motionLogic: "The route straightens as the mechanism becomes legible.",
  },
};
