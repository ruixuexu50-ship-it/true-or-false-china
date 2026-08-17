import ChinamaxxingExperience from "./ChinamaxxingExperience.astro";
import QrPaymentExperience from "./QrPaymentExperience.astro";
import LivingEvidenceObject from "./LivingEvidenceObject.astro";

// Keyed by the experience's stable `implementationId`, NOT by Topic slug.
// A Topic carries its experience via `topic.experience.implementationId`, so a
// slug can change without breaking component resolution.
export const experienceRegistry = {
  "qr-route-diagnosis": QrPaymentExperience,
  "culture-inference-test": ChinamaxxingExperience,
  // v0.1 prototype — not yet wired to a Topic. Wiring requires a small
  // ExperiencePack contract extension (object experiences have no `character`).
  "living-evidence-object": LivingEvidenceObject,
} as const;

