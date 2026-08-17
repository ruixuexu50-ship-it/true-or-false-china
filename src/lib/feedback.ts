export const FEEDBACK_EVENTS = [
  "topic_view",
  "interaction_start",
  "payoff_reached",
  "source_open",
  "related_open",
  "share_or_copy",
  "question_submitted",
] as const;

export type FeedbackEventName = (typeof FEEDBACK_EVENTS)[number];

export interface FeedbackEventProperties {
  topic?: string;
  entry?: "direct" | "tiktok" | "search" | "related" | "shared" | "other";
  sourceId?: string;
  relatedId?: string;
  action?: string;
  interactionState?: string;
  question?: string;
}

const SAFE_PROPERTY_KEYS = [
  "topic",
  "entry",
  "sourceId",
  "relatedId",
  "action",
  "interactionState",
] as const;

const STABLE_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTRY_CATEGORIES = new Set([
  "direct",
  "tiktok",
  "search",
  "related",
  "shared",
  "other",
]);

function isSafeProperty(key: (typeof SAFE_PROPERTY_KEYS)[number], value: unknown) {
  if (typeof value !== "string" || value.length === 0 || value.length > 100) {
    return false;
  }
  if (key === "entry") return ENTRY_CATEGORIES.has(value);
  return STABLE_IDENTIFIER.test(value);
}

export function sanitizeFeedbackEvent(
  event: string,
  input: Record<string, unknown> = {},
): { event: FeedbackEventName; properties: FeedbackEventProperties } | null {
  if (!FEEDBACK_EVENTS.includes(event as FeedbackEventName)) return null;

  const properties: Record<string, string> = {};
  for (const key of SAFE_PROPERTY_KEYS) {
    const value = input[key];
    if (isSafeProperty(key, value)) properties[key] = value as string;
  }

  if (event === "question_submitted" && input.question !== undefined) {
    if (typeof input.question !== "string") return null;
    try {
      properties.question = validateFeedbackQuestion(input.question);
    } catch {
      return null;
    }
  }

  return {
    event: event as FeedbackEventName,
    properties: properties as FeedbackEventProperties,
  };
}

export function validateFeedbackQuestion(input: string): string {
  const question = input.trim();
  if (question.length === 0) {
    throw new RangeError("Feedback question cannot be empty");
  }
  if (question.length > 500) {
    throw new RangeError("Feedback question must be 500 characters or fewer");
  }
  return question;
}
