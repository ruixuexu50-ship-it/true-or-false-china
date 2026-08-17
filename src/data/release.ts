import { createReleasePlan, type ReleasePlan } from "../lib/release-guard.ts";
import type { Locale } from "../lib/i18n.ts";
import { siteIdentity } from "./site.ts";
import { getTopicsByLocale } from "./topics.ts";

export const isPublicRelease = import.meta.env.PUBLIC_RELEASE === "true";

function buildPlan(locale: Locale): ReleasePlan {
  return createReleasePlan(siteIdentity, getTopicsByLocale(locale), {
    publicRelease: isPublicRelease,
  });
}

export const releasePlan = buildPlan("en");
export const zhReleasePlan = buildPlan("zh");

export function getReleasePlan(locale: Locale): ReleasePlan {
  return locale === "zh" ? zhReleasePlan : releasePlan;
}
