import type { SiteIdentity } from "../lib/release-guard.ts";

export const siteIdentity = {
  name: "True or False China",
  // Named by the owner on 2026-08-18; no longer a placeholder.
  isPlaceholderName: false,
} satisfies SiteIdentity;

export const siteDescription =
  "Real questions about how China actually works. We check the evidence, explain the mechanism, mark the boundary—and follow where it lands.";

// ─────────────────────────────────────────────────────────────
// External community links (CURRENT ASSUMPTION, owner-provided).
//
// The only place to add the real Discord invite / TikTok profile
// URLs. While a value is null the entry renders as an honest
// "coming soon" tile — it never gets a fake href. When the owner
// fills these in, every surface (header nav, knowledge cabinet,
// library grid, community section) picks the link up at once.
// ─────────────────────────────────────────────────────────────

export const externalLinks: {
  /** Discord invite URL, or null until the owner provides one. */
  discordUrl: string | null;
  /** TikTok profile URL, or null until the owner provides one. */
  tiktokUrl: string | null;
} = {
  discordUrl: null,
  tiktokUrl: null,
};

// ─────────────────────────────────────────────────────────────
// Editorial configuration (CURRENT ASSUMPTION, explicit & reviewable).
//
// Which Topic the homepage cover features, and which Topics the archived
// v1 homepage experiment belongs to. Keyed by stable `topicId` — never by
// array position and never by slug. Changing a Topic's slug does not touch
// these; featuring a different Topic means editing this one place.
// ─────────────────────────────────────────────────────────────

/** The Topic shown on the homepage cover. Resolved via getTopicById. */
export const homeCoverTopicId = "c0e8f7a2-3b1d-4e9c-8f5a-1d2b3c4e5f60";

/**
 * EXPERIMENT: the archived v1 homepage (`/lab/qr-home-v1/`, local-review
 * only). It was designed around two specific Topics; both dependencies are
 * declared here explicitly instead of reading `topics[0]` / `topics[1]`.
 */
export const qrHomeArchiveExperiment = {
  slug: "qr-home-v1",
  leadTopicId: "c0e8f7a2-3b1d-4e9c-8f5a-1d2b3c4e5f60",
  secondTopicId: "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
} as const;
