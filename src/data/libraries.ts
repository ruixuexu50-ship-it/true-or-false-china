// The five homepage libraries — the single source of truth for the
// knowledge cabinet drawers, the library grid, and the header nav.
//
// Every entry is a real destination or an honest null (locked /
// "coming soon"). Filling in externalLinks in site.ts is the only
// change needed to light Discord / TikTok up everywhere at once.

import { externalLinks } from "./site.ts";
import { t } from "./ui-strings.ts";
import type { Locale } from "../lib/i18n.ts";

export type LibraryIcon = "topics" | "scripts" | "checklists" | "discord" | "tiktok";

// Minimal inline stroke icons (currentColor) — no external assets, no
// brand logos: each library gets a distinct, quiet glyph. Shared by
// the knowledge cabinet and the library grid.
export const LIBRARY_ICONS: Record<LibraryIcon, string> = {
  topics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8l2.5-4h13L21 8"/><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M10 13h4"/></svg>`,
  scripts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M10 12.5l4.5 2.5-4.5 2.5z"/></svg>`,
  checklists: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 11.5h8"/><path d="M8 16l2 2 4.5-4.5"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H10l-6 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 18V6l10-2v11.5"/><circle cx="6.75" cy="18" r="2.75"/><circle cx="16.75" cy="15.5" r="2.75"/></svg>`,
};

export interface LibraryEntry {
  id: string;
  label: string;
  desc: string;
  href: string | null;
  external: boolean;
  icon: LibraryIcon;
}

export function getLibraries(locale: Locale): LibraryEntry[] {
  const prefix = locale === "zh" ? "/zh" : "";
  return [
    {
      id: "topics",
      label: t(locale, "lib.topics.title"),
      desc: t(locale, "lib.topics.desc"),
      href: `${prefix}/explore/`,
      external: false,
      icon: "topics",
    },
    {
      id: "scripts",
      label: t(locale, "lib.videos.title"),
      desc: t(locale, "lib.videos.desc"),
      href: `${prefix}/transcripts/`,
      external: false,
      icon: "scripts",
    },
    {
      id: "checklists",
      label: t(locale, "lib.checklists.title"),
      desc: t(locale, "lib.checklists.desc"),
      href: `${prefix}/checklists/`,
      external: false,
      icon: "checklists",
    },
    {
      id: "discord",
      label: t(locale, "lib.discord.title"),
      desc: t(locale, "lib.discord.desc"),
      href: externalLinks.discordUrl,
      external: true,
      icon: "discord",
    },
    {
      id: "tiktok",
      label: t(locale, "lib.tiktok.title"),
      desc: t(locale, "lib.tiktok.desc"),
      href: externalLinks.tiktokUrl,
      external: true,
      icon: "tiktok",
    },
  ];
}
