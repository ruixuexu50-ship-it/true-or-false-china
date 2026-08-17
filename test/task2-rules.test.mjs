import assert from "node:assert/strict";
import test from "node:test";

import { diagnoseQrRoute } from "../src/lib/qr-diagnosis.ts";
import {
  buildScopedInference,
  classifyObservation,
  findScopePrompts,
} from "../src/lib/inference-test.ts";

test("QR diagnosis names a likely weak link without predicting a payment result", () => {
  assert.equal(
    diagnoseQrRoute({
      funding: "foreign-card",
      wallet: "wallet-incomplete",
      merchant: "merchant-app-qr",
    }).id,
    "onboarding",
  );
  assert.equal(
    diagnoseQrRoute({
      funding: "foreign-card",
      wallet: "alipay-linked",
      merchant: "small-or-personal-qr",
    }).id,
    "merchant-route",
  );
  const aligned = diagnoseQrRoute({
    funding: "foreign-card",
    wallet: "weixin-linked",
    merchant: "merchant-app-qr",
  });
  assert.equal(aligned.id, "issuer-or-live-check");
  assert.doesNotMatch(
    JSON.stringify(aligned),
    /success|approved|accepted|declined|guaranteed/i,
  );
});

test("culture inference rules separate observation, prompts, and scoped revision", () => {
  assert.deepEqual(classifyObservation("observable"), {
    layer: "observation",
    addedInference: false,
  });
  assert.deepEqual(classifyObservation("effect-claim"), {
    layer: "social-effect",
    addedInference: true,
  });
  assert.ok(
    findScopePrompts("TikTok users now prove Chinese culture changed")
      .map((prompt) => prompt.id)
      .includes("broad-actor"),
  );

  const outcome = buildScopedInference({
    observation: "three everyday cues are grouped under one joke",
    authorIntent: "the fictional author describes affectionate intent",
    framing: "projection",
    unknown: "audience-reception",
  });
  assert.equal(outcome.status, "revision-complete");
  assert.match(outcome.sentence, /^In this fictional example,/);
  assert.match(outcome.sentence, /remains unknown\.$/);
  assert.doesNotMatch(outcome.sentence, /TikTok users|everyone|proves/i);
});
