import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

async function loadAnalytics() {
  const url = new URL("../src/lib/analytics.ts", import.meta.url);
  assert.equal(
    existsSync(url),
    true,
    "analytics.ts must exist before analytics can be initialized",
  );
  return import(url.href);
}

test("is a no-op when no explicit public key is present", async () => {
  const { createAnalytics } = await loadAnalytics();
  let initialized = false;
  const analytics = createAnalytics({
    publicKey: undefined,
    clientFactory: () => {
      initialized = true;
      return { capture() {} };
    },
  });

  assert.equal(analytics.enabled, false);
  assert.equal(
    analytics.capture("topic_view", { topic: "a-question-worth-testing" }),
    false,
  );
  assert.equal(initialized, false);
});

test("stays disabled when Do Not Track is enabled", async () => {
  const { createAnalytics } = await loadAnalytics();
  const analytics = createAnalytics({
    publicKey: "phc_local_test_only",
    doNotTrack: true,
    clientFactory: () => ({ capture() {} }),
  });
  assert.equal(analytics.enabled, false);
});

test("passes only sanitized events to an explicitly enabled client", async () => {
  const { createAnalytics, SAFE_POSTHOG_CONFIG } = await loadAnalytics();
  const captures = [];
  const analytics = createAnalytics({
    publicKey: "phc_local_test_only",
    clientFactory: (_key, config) => {
      assert.deepEqual(config, SAFE_POSTHOG_CONFIG);
      return {
        capture(event, properties) {
          captures.push({ event, properties });
        },
      };
    },
  });

  assert.equal(analytics.enabled, true);
  assert.equal(
    analytics.capture("topic_view", {
      topic: "a-question-worth-testing",
      email: "must-not-leave@example.com",
    }),
    true,
  );
  assert.deepEqual(captures, [
    {
      event: "topic_view",
      properties: { topic: "a-question-worth-testing" },
    },
  ]);
});

test("disables SDK enrichment and installs a last-mile denylist and filter", async () => {
  const { SAFE_POSTHOG_CONFIG } = await loadAnalytics();

  assert.equal(SAFE_POSTHOG_CONFIG.save_referrer, false);
  assert.equal(SAFE_POSTHOG_CONFIG.save_campaign_params, false);
  assert.equal(SAFE_POSTHOG_CONFIG.capture_performance, false);
  assert.equal(SAFE_POSTHOG_CONFIG.capture_exceptions, false);
  assert.equal(SAFE_POSTHOG_CONFIG.capture_heatmaps, false);
  assert.equal(SAFE_POSTHOG_CONFIG.capture_dead_clicks, false);
  assert.equal(SAFE_POSTHOG_CONFIG.rageclick, false);
  assert.equal(SAFE_POSTHOG_CONFIG.mask_all_text, true);
  assert.equal(SAFE_POSTHOG_CONFIG.mask_all_element_attributes, true);
  assert.equal(typeof SAFE_POSTHOG_CONFIG.before_send, "function");

  for (const denied of [
    "$current_url",
    "$referrer",
    "$referring_domain",
    "$initial_current_url",
    "$session_entry_url",
    "utm_source",
    "$elements",
    "$element_text",
    "title",
    "$device_id",
    "$session_id",
  ]) {
    assert.ok(
      SAFE_POSTHOG_CONFIG.property_denylist.includes(denied),
      `${denied} must be blocked before transport`,
    );
  }
});

test("last-mile filter removes SDK-enriched URLs, campaigns, page text, and person writes", async () => {
  const { SAFE_POSTHOG_CONFIG } = await loadAnalytics();
  const timestamp = new Date("2026-08-13T00:00:00.000Z");
  const filtered = SAFE_POSTHOG_CONFIG.before_send({
    uuid: "018f47a2-6e73-7be0-8000-000000000001",
    event: "source_open",
    timestamp,
    properties: {
      token: "phc_public_project_token",
      $cookieless_mode: true,
      distinct_id: "$posthog_cookieless",
      $process_person_profile: false,
      topic: "safe-topic",
      entry: "tiktok",
      sourceId: "primary-source-1",
      action: "open",
      $current_url: "https://site.example/topics/safe-topic/?private=1",
      $host: "site.example",
      $pathname: "/topics/safe-topic/",
      $referrer: "https://social.example/@private-user/video/123",
      $referring_domain: "social.example",
      $initial_current_url: "https://site.example/?utm_source=private-campaign",
      $session_entry_url: "https://site.example/?email=person@example.com",
      utm_source: "private-campaign",
      gclid: "advertising-id",
      title: "Private draft page title",
      $elements: [{ text: "copied page text" }],
      $element_text: "copied page text",
      $device_id: "device-identifier",
      $session_id: "session-identifier",
      $browser: "BrowserName",
      pageText: "the whole page",
      replay: { frames: [1, 2, 3] },
      email: "person@example.com",
    },
    $set: { email: "person@example.com" },
    $set_once: { initial_referrer: "https://social.example/private" },
  });

  assert.deepEqual(filtered, {
    uuid: "018f47a2-6e73-7be0-8000-000000000001",
    event: "source_open",
    timestamp,
    properties: {
      token: "phc_public_project_token",
      $cookieless_mode: true,
      distinct_id: "$posthog_cookieless",
      $process_person_profile: false,
      topic: "safe-topic",
      entry: "tiktok",
      sourceId: "primary-source-1",
      action: "open",
    },
  });
});

test("last-mile filter fails closed for SDK events or identifiable envelopes", async () => {
  const { SAFE_POSTHOG_CONFIG } = await loadAnalytics();
  const safeEnvelope = {
    uuid: "018f47a2-6e73-7be0-8000-000000000001",
    event: "topic_view",
    properties: {
      token: "phc_public_project_token",
      $cookieless_mode: true,
      distinct_id: "$posthog_cookieless",
      $process_person_profile: false,
      topic: "safe-topic",
    },
  };

  assert.equal(
    SAFE_POSTHOG_CONFIG.before_send({ ...safeEnvelope, event: "$pageview" }),
    null,
  );
  assert.equal(
    SAFE_POSTHOG_CONFIG.before_send({
      ...safeEnvelope,
      properties: { ...safeEnvelope.properties, distinct_id: "person-123" },
    }),
    null,
  );
  assert.equal(
    SAFE_POSTHOG_CONFIG.before_send({
      ...safeEnvelope,
      properties: { ...safeEnvelope.properties, $process_person_profile: true },
    }),
    null,
  );
});
