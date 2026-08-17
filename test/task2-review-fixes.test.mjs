import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

async function loadInteractionState() {
  return import(new URL("../src/lib/interaction-state.ts", import.meta.url));
}

async function loadUiEvents() {
  return import(new URL("../src/lib/ui-events.ts", import.meta.url));
}

async function loadAnalyticsBridge() {
  return import(new URL("../src/lib/analytics-bridge.ts", import.meta.url));
}

test("changing any QR answer invalidates a revealed diagnosis immediately", async () => {
  const {
    createQrInteractionState,
    revealQrDiagnosis,
    invalidateQrDiagnosis,
  } = await loadInteractionState();
  const initial = createQrInteractionState();
  const revealed = revealQrDiagnosis(initial, "merchant-route", "merchant-route");
  assert.equal(revealed.diagnosisId, "merchant-route");
  assert.equal(revealed.weakLink, "merchant-route");

  assert.deepEqual(invalidateQrDiagnosis(revealed), {
    diagnosisId: null,
    weakLink: null,
    revealed: false,
  });
});

test("culture restart returns every local interaction gate to its initial state", async () => {
  const {
    createCultureInteractionState,
    resetCultureInteractionState,
  } = await loadInteractionState();
  const state = createCultureInteractionState();
  state.openedClaims.add("i01");
  state.selectedFramings.add("projection");
  state.scaffold = "A locally revised sentence";
  state.observationSelected = true;
  state.unknownSelected = true;
  state.revisionComplete = true;

  const reset = resetCultureInteractionState(state);
  assert.equal(reset.openedClaims.size, 0);
  assert.equal(reset.selectedFramings.size, 0);
  assert.equal(reset.scaffold, "");
  assert.equal(reset.observationSelected, false);
  assert.equal(reset.unknownSelected, false);
  assert.equal(reset.revisionComplete, false);
  assert.equal(reset.canOpenStage2, false);
  assert.equal(reset.canOpenStage3, false);
});

test("stage navigation is instant when reduced motion is requested", async () => {
  const { scrollBehaviorForMotion } = await loadInteractionState();
  assert.equal(scrollBehaviorForMotion(true), "auto");
  assert.equal(scrollBehaviorForMotion(false), "smooth");

  const source = readFileSync(
    new URL(
      "../src/components/experiences/ChinamaxxingExperience.astro",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(source, /scrollIntoView\(\{ behavior: "smooth"/);
  assert.match(source, /scrollBehaviorForMotion/);
});

test("shared UI event details always carry their page Topic and isolate questions", async () => {
  const { createUiEventDetail, resolveEntryCategory } = await loadUiEvents();
  assert.deepEqual(
    createUiEventDetail("qr-payment-stack", "source_open", {
      topic: "wrong-topic",
      sourceId: "s01",
      question: "must be dropped",
    }),
    {
      event: "source_open",
      properties: { topic: "qr-payment-stack", sourceId: "s01" },
    },
  );
  assert.deepEqual(
    createUiEventDetail("chinamaxxing-inference", "question_submitted", {
      entry: "direct",
      question: "What is still unknown?",
    }),
    {
      event: "question_submitted",
      properties: {
        topic: "chinamaxxing-inference",
        entry: "direct",
        question: "What is still unknown?",
      },
    },
  );
  assert.equal(
    createUiEventDetail("qr-payment-stack", "question_submitted", {
      question: "x".repeat(501),
    }),
    null,
  );
  assert.equal(
    resolveEntryCategory("https://local.test/topics/qr-payment-stack/?from=tiktok"),
    "tiktok",
  );
  assert.equal(
    resolveEntryCategory("https://local.test/topics/qr-payment-stack/?from=direct"),
    "direct",
  );
});

test("analytics bridge is disabled by default and requires explicit client injection", async () => {
  const { installAnalyticsBridge } = await loadAnalyticsBridge();
  const { createUiEventDetail, WORKING_ANSWER_EVENT } = await loadUiEvents();
  const target = new EventTarget();
  let initialized = 0;
  const factory = () => {
    initialized += 1;
    return { capture() {} };
  };

  const local = installAnalyticsBridge({
    target,
    topicSlug: "qr-payment-stack",
    clientFactory: factory,
  });
  target.dispatchEvent(
    new CustomEvent(
      WORKING_ANSWER_EVENT,
      { detail: createUiEventDetail("qr-payment-stack", "topic_view", { entry: "direct" }) },
    ),
  );
  assert.equal(local.enabled, false);
  assert.equal(initialized, 0);
  assert.equal(local.forwarded, 0);
  local.dispose();

  const captures = [];
  const future = installAnalyticsBridge({
    target,
    topicSlug: "qr-payment-stack",
    publicKey: "phc_explicit_future_key",
    clientFactory: () => ({
      capture(event, properties) {
        captures.push({ event, properties });
      },
    }),
  });
  target.dispatchEvent(
    new CustomEvent(WORKING_ANSWER_EVENT, {
      detail: createUiEventDetail("chinamaxxing-inference", "source_open", {
        sourceId: "s01",
      }),
    }),
  );
  target.dispatchEvent(
    new CustomEvent(WORKING_ANSWER_EVENT, {
      detail: createUiEventDetail("qr-payment-stack", "source_open", {
        sourceId: "s01",
      }),
    }),
  );
  assert.deepEqual(captures, [
    {
      event: "source_open",
      properties: { topic: "qr-payment-stack", sourceId: "s01" },
    },
  ]);
  assert.equal(future.forwarded, 1);
  future.dispose();
});

test("archived QR homepage preserves separate direct and TikTok handoffs", () => {
  const source = readFileSync(
    new URL("../src/components/home/QrHomeArchive.astro", import.meta.url),
    "utf8",
  );
  const archiveRoute = readFileSync(
    new URL("../src/pages/lab/[slug].astro", import.meta.url),
    "utf8",
  );
  assert.match(
    source,
    /class="primary-action" href=\{`\/topics\/\$\{featured\.slug\}\/\?from=direct#interaction`\}/,
  );
  assert.doesNotMatch(
    source,
    /class="primary-action" href=\{`[^`]*from=tiktok/,
  );
  assert.match(source, /data-tiktok-handoff/);
  assert.match(source, /from=tiktok#interaction/);
  assert.match(source, /Continue the question/);
  assert.match(archiveRoute, /robots="noindex,nofollow"/);
  assert.match(archiveRoute, /<QrHomeArchive featured=\{lead\} second=\{second\}/);
});

test("all seven UI events are wired through the shared analytics bridge contract", () => {
  const files = [
    "../src/components/AnalyticsBridge.astro",
    "../src/components/FeedbackForm.astro",
    "../src/components/RelatedList.astro",
    "../src/components/ShareControls.astro",
    "../src/components/SourceList.astro",
    "../src/components/experiences/QrPaymentExperience.astro",
    "../src/components/experiences/ChinamaxxingExperience.astro",
  ].map((file) => readFileSync(new URL(file, import.meta.url), "utf8"));
  const combined = files.join("\n");
  for (const event of [
    "topic_view",
    "interaction_start",
    "payoff_reached",
    "source_open",
    "related_open",
    "share_or_copy",
    "question_submitted",
  ]) {
    assert.match(combined, new RegExp(`createUiEventDetail[\\s\\S]*${event}|${event}[\\s\\S]*createUiEventDetail`));
  }
});
