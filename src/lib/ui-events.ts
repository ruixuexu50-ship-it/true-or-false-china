import {
  sanitizeFeedbackEvent,
  type FeedbackEventName,
  type FeedbackEventProperties,
} from "./feedback.ts";

export const WORKING_ANSWER_EVENT = "working-answer:event";

export type UiEventProperties = FeedbackEventProperties &
  { topic: string } &
  Record<string, unknown>;

export interface UiEventDetail {
  event: FeedbackEventName;
  properties: UiEventProperties;
}

export function createUiEventDetail(
  topicSlug: string,
  event: string,
  input: Record<string, unknown> = {},
): UiEventDetail | null {
  const sanitized = sanitizeFeedbackEvent(event, {
    ...input,
    topic: topicSlug,
  });
  if (!sanitized?.properties.topic) return null;
  return sanitized as UiEventDetail;
}

export function sanitizeUiEventDetail(value: unknown): UiEventDetail | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.event !== "string" ||
    typeof candidate.properties !== "object" ||
    candidate.properties === null ||
    Array.isArray(candidate.properties)
  ) {
    return null;
  }
  const properties = candidate.properties as Record<string, unknown>;
  if (typeof properties.topic !== "string") return null;
  return createUiEventDetail(properties.topic, candidate.event, properties);
}

export function resolveEntryCategory(
  url: string,
): NonNullable<FeedbackEventProperties["entry"]> {
  const from = new URL(url).searchParams.get("from");
  if (
    from === "tiktok" ||
    from === "search" ||
    from === "related" ||
    from === "shared" ||
    from === "direct"
  ) {
    return from;
  }
  return "direct";
}
