import type { ExperiencePack } from "../lib/contracts.ts";

export const qrExperience: ExperiencePack = {
  implementationId: "qr-route-diagnosis",
  palette: {
    background: "#063bc9",
    ink: "#111216",
    accent: "#ff5b42",
    secondary: "#b8ef16",
    highlight: "#ffffff",
  },
  character: {
    id: "rae-card-traveler",
    name: "Rae",
    description:
      "A dry, skeptical traveler-card character reading one route through three gates.",
    original: true,
    asset: {
      src: "/images/qr-route-working.png",
      alt: "A blue card character pulls a coral suitcase along one blue path through three simple payment gates.",
      status: "local-review",
    },
  },
  visualStates: [
    { id: "ready-with-card", label: "Funding source is visible" },
    { id: "building-bridge", label: "Wallet bridge is being checked" },
    { id: "at-merchant", label: "Merchant route is being checked" },
    { id: "route-with-backup", label: "One weak link and a backup are visible" },
  ],
  interaction: {
    id: "qr-payment-stack",
    type: "three-stage-route-diagnosis",
    changesUnderstanding:
      "Separates the visible QR from the funding, wallet, and merchant links behind it.",
  },
  motionLogic:
    "One connector settles after each answer; the likely weak link receives one finite emphasis after the third answer.",
  image: {
    src: "/images/qr-route-working.png",
    alt: "A skeptical blue traveler-card follows one continuous path through three simplified payment gates.",
    status: "local-review",
  },
};

export const cultureExperience: ExperiencePack = {
  implementationId: "culture-inference-test",
  palette: {
    background: "#ffffff",
    ink: "#111216",
    accent: "#ff2f92",
    secondary: "#145cff",
    highlight: "#ffd91f",
    // White hero background needs dark hero text (owned by data, not by a
    // slug-keyed CSS override in TopicShell).
    heroInk: "#111216",
  },
  character: {
    id: "mica-fictional-fixture",
    name: "Mica",
    description:
      "An original non-human abstract character used only in a purpose-made fictional demonstration.",
    original: true,
    asset: {
      src: "/images/mica-fixture-working.png",
      alt: "Mica, an abstract black figure, stands beside slippers, a steaming mug, and a bowl of dumplings under overlapping blue and pink lenses.",
      status: "local-review",
    },
  },
  visualStates: [
    { id: "scene-assembled", label: "The fictional scene is observable" },
    { id: "evidence-separated", label: "Observation is separated from inference" },
    { id: "frames-refracted", label: "Named lenses overlap without voting" },
    { id: "sentence-rebuilt", label: "The revised sentence keeps an unknown" },
  ],
  interaction: {
    id: "chinamaxxing-inference",
    type: "five-stage-inference-test",
    changesUnderstanding:
      "Keeps one fictional scene fixed while observation, intent, framing, reception, and effect are separated.",
  },
  motionLogic:
    "Interpretation lenses shift only when a reader opens a framing; reduced motion switches them instantly.",
  // The fictional fixture's own words (DEMO-01). Substantive topic content,
  // kept in the data so editing it never requires opening the UI component.
  fixtureQuote: "Apparently I’m in my very Chinese era.",
  image: {
    src: "/images/mica-fixture-working.png",
    alt: "A fictional abstract character and exactly three everyday objects sit beneath two overlapping interpretation lenses.",
    status: "local-review",
  },
};

