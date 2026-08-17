import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

async function loadFeedback() {
  const url = new URL("../src/lib/feedback.ts", import.meta.url);
  assert.equal(
    existsSync(url),
    true,
    "feedback.ts must exist before feedback data can be sanitized",
  );
  return import(url.href);
}

test("allows exactly the seven approved feedback events", async () => {
  const { FEEDBACK_EVENTS } = await loadFeedback();
  assert.deepEqual(FEEDBACK_EVENTS, [
    "topic_view",
    "interaction_start",
    "payoff_reached",
    "source_open",
    "related_open",
    "share_or_copy",
    "question_submitted",
  ]);
});

test("rejects unknown event names", async () => {
  const { sanitizeFeedbackEvent } = await loadFeedback();
  assert.equal(
    sanitizeFeedbackEvent("session_recorded", { topic: "safe-topic" }),
    null,
  );
});

test("keeps only allowlisted, low-risk event properties", async () => {
  const { sanitizeFeedbackEvent } = await loadFeedback();
  const sanitized = sanitizeFeedbackEvent("source_open", {
    topic: "safe-topic",
    entry: "tiktok",
    sourceId: "primary-source-1",
    relatedId: "next-question",
    action: "open",
    interactionState: "first-payoff",
    email: "person@example.com",
    name: "A Person",
    referrer: "https://social.example/private-path?user=123",
    pageText: "the full page text",
    replay: { frames: [1, 2, 3] },
    arbitrary: "not allowed",
  });

  assert.deepEqual(sanitized, {
    event: "source_open",
    properties: {
      topic: "safe-topic",
      entry: "tiktok",
      sourceId: "primary-source-1",
      relatedId: "next-question",
      action: "open",
      interactionState: "first-payoff",
    },
  });
});

test("accepts a trimmed 500-character question and rejects a longer one", async () => {
  const { validateFeedbackQuestion } = await loadFeedback();
  const fiveHundred = `  ${"a".repeat(500)}  `;
  assert.equal(validateFeedbackQuestion(fiveHundred).length, 500);
  assert.throws(
    () => validateFeedbackQuestion("a".repeat(501)),
    /500 characters or fewer/,
  );
});
