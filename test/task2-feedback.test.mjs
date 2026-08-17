import assert from "node:assert/strict";
import test from "node:test";

import { createAnalytics } from "../src/lib/analytics.ts";
import { sanitizeFeedbackEvent } from "../src/lib/feedback.ts";

test("user-written feedback is transported only by question_submitted", () => {
  const question = "Could you explain the merchant route with one field test?";
  assert.deepEqual(
    sanitizeFeedbackEvent("question_submitted", {
      topic: "qr-payment-stack",
      entry: "direct",
      question,
      currentUrl: "https://example.test/private",
      referrer: "https://social.example/private",
      pageText: "not allowed",
      identity: "not allowed",
      campaign: "not allowed",
    }),
    {
      event: "question_submitted",
      properties: {
        topic: "qr-payment-stack",
        entry: "direct",
        question,
      },
    },
  );

  assert.deepEqual(
    sanitizeFeedbackEvent("source_open", {
      topic: "qr-payment-stack",
      sourceId: "s01",
      question,
    }),
    {
      event: "source_open",
      properties: { topic: "qr-payment-stack", sourceId: "s01" },
    },
  );
  assert.equal(
    sanitizeFeedbackEvent("question_submitted", {
      topic: "qr-payment-stack",
      question: "x".repeat(501),
    }),
    null,
  );
});

test("no analytics client is initialized without a key or under DNT", () => {
  let initialized = 0;
  const factory = () => {
    initialized += 1;
    return { capture() {} };
  };
  createAnalytics({ publicKey: undefined, clientFactory: factory });
  createAnalytics({
    publicKey: "phc_future_only",
    doNotTrack: true,
    clientFactory: factory,
  });
  assert.equal(initialized, 0);
});
