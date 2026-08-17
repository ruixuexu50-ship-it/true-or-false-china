// Locale infrastructure for the bilingual (en / zh) site.
//
// English is the default and stays at the site root (no `/en/` prefix).
// Chinese lives under `/zh/`. A Topic's stable `topicId` is shared across
// locales; only the localized prose differs. See docs/release/LOCALIZATION.md.

export type Locale = "en" | "zh";

export const LOCALES: readonly Locale[] = ["en", "zh"] as const;
export const DEFAULT_LOCALE: Locale = "en";
export const ZH_PREFIX = "/zh";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh";
}

/** Derive the active locale from a request pathname. */
export function localeFromPath(pathname: string): Locale {
  const normalized = pathname.toLowerCase();
  return normalized === "/zh" || normalized.startsWith("/zh/") ? "zh" : "en";
}

/** Strip any `/zh` prefix, returning the path as the default-locale would see it. */
export function basePathWithoutLocale(pathname: string): string {
  const normalized = pathname.toLowerCase();
  if (normalized === "/zh") return "/";
  if (normalized.startsWith("/zh/")) return pathname.slice(3);
  return pathname;
}

/** Build a URL for `locale`, keeping the same base path. */
export function localizedPath(locale: Locale, basePath: string): string {
  const base = basePath === "" ? "/" : basePath;
  if (locale === "zh") {
    if (base === "/") return "/zh/";
    return "/zh" + (base.startsWith("/") ? base : "/" + base);
  }
  return base;
}

/** Given the current pathname, return the equivalent path in the other locale. */
export function switchLocalePath(currentPathname: string, target: Locale): string {
  return localizedPath(target, basePathWithoutLocale(currentPathname));
}
