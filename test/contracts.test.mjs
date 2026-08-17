import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { topicFixture } from "./fixtures.mjs";

async function loadContracts() {
  const url = new URL("../src/lib/contracts.ts", import.meta.url);
  assert.equal(
    existsSync(url),
    true,
    "contracts.ts must exist before the contracts can be validated",
  );
  return import(url.href);
}

test("defines the four release states in lifecycle order", async () => {
  const { RELEASE_STATES } = await loadContracts();
  assert.deepEqual(RELEASE_STATES, [
    "draft",
    "locally-reviewed",
    "approved",
    "published",
  ]);
});

test("accepts a complete TopicPage with two visual states", async () => {
  const { validateTopicPage } = await loadContracts();
  assert.equal(validateTopicPage(topicFixture).slug, topicFixture.slug);
});

test("rejects an ExperiencePack outside the two-to-four visual-state range", async () => {
  const { validateTopicPage } = await loadContracts();
  const invalid = structuredClone(topicFixture);
  invalid.experience.visualStates = invalid.experience.visualStates.slice(0, 1);
  assert.throws(() => validateTopicPage(invalid), /2–4 visual states/);
});

test("only exposes optional modules that contain real data", async () => {
  const { getOptionalModules } = await loadContracts();
  assert.deepEqual(getOptionalModules(topicFixture), []);

  const withTranscript = {
    ...topicFixture,
    transcript: [{ speaker: "Host", text: "A real recorded line." }],
  };
  assert.deepEqual(getOptionalModules(withTranscript), ["transcript"]);
});

test("content changes return a TopicPage to draft", async () => {
  const { markContentChanged } = await loadContracts();
  const changed = markContentChanged(topicFixture, {
    explanation: ["A corrected mechanism."],
  });
  assert.equal(changed.releaseState, "draft");
  assert.deepEqual(changed.explanation, ["A corrected mechanism."]);
});

test("presentation-only changes preserve release state", async () => {
  const { applyPresentationChange } = await loadContracts();
  const changed = applyPresentationChange(topicFixture, {
    palette: {
      background: "#001122",
      ink: "#ffffff",
      accent: "#ffcc00",
    },
    motionLogic: "The route folds sideways before it resolves.",
  });
  assert.equal(changed.releaseState, "locally-reviewed");
  assert.equal(changed.experience.palette.background, "#001122");
});

test("rejects an incomplete palette", async () => {
  const { validateTopicPage } = await loadContracts();
  const invalid = structuredClone(topicFixture);
  invalid.experience.palette.accent = "";
  assert.throws(() => validateTopicPage(invalid), /experience\.palette\.accent/);
});

test("rejects incomplete character metadata and character assets", async () => {
  const { validateTopicPage } = await loadContracts();
  const missingName = structuredClone(topicFixture);
  missingName.experience.character.name = "";
  assert.throws(
    () => validateTopicPage(missingName),
    /experience\.character\.name/,
  );

  const incompleteAsset = structuredClone(topicFixture);
  incompleteAsset.experience.character.asset = {
    src: "/characters/route-scout.webp",
    alt: "",
  };
  assert.throws(
    () => validateTopicPage(incompleteAsset),
    /experience\.character\.asset\.alt/,
  );
});

test("rejects incomplete visual states and state images", async () => {
  const { validateTopicPage } = await loadContracts();
  const missingLabel = structuredClone(topicFixture);
  missingLabel.experience.visualStates[0].label = "";
  assert.throws(
    () => validateTopicPage(missingLabel),
    /experience\.visualStates\[0\]\.label/,
  );

  const incompleteImage = structuredClone(topicFixture);
  incompleteImage.experience.visualStates[0].image = {
    src: "",
    alt: "Route Scout waiting",
  };
  assert.throws(
    () => validateTopicPage(incompleteImage),
    /experience\.visualStates\[0\]\.image\.src/,
  );
});

test("rejects incomplete interaction fields", async () => {
  const { validateTopicPage } = await loadContracts();
  const invalid = structuredClone(topicFixture);
  invalid.experience.interaction.id = "";
  assert.throws(
    () => validateTopicPage(invalid),
    /experience\.interaction\.id/,
  );
});

test("rejects malformed source records and unsafe source URLs", async () => {
  const { validateTopicPage } = await loadContracts();
  const missingRole = structuredClone(topicFixture);
  missingRole.sources[0].role = "";
  assert.throws(() => validateTopicPage(missingRole), /sources\[0\]\.role/);

  const unsafeUrl = structuredClone(topicFixture);
  unsafeUrl.sources[0].url = "javascript:alert(1)";
  assert.throws(() => validateTopicPage(unsafeUrl), /sources\[0\]\.url/);
});

test("rejects malformed revision records", async () => {
  const { validateTopicPage } = await loadContracts();
  const invalidVersion = structuredClone(topicFixture);
  invalidVersion.revisions[0].version = 0;
  assert.throws(
    () => validateTopicPage(invalidVersion),
    /revisions\[0\]\.version/,
  );

  const invalidDate = structuredClone(topicFixture);
  invalidDate.revisions[0].date = "August 13";
  assert.throws(() => validateTopicPage(invalidDate), /revisions\[0\]\.date/);
});

test("rejects malformed or unsafe related-rabbit-hole links", async () => {
  const { validateTopicPage } = await loadContracts();
  const missingLabel = structuredClone(topicFixture);
  missingLabel.relatedRabbitHoles[0].label = "";
  assert.throws(
    () => validateTopicPage(missingLabel),
    /relatedRabbitHoles\[0\]\.label/,
  );

  const unsafeHref = structuredClone(topicFixture);
  unsafeHref.relatedRabbitHoles[0].href = "javascript:alert(1)";
  assert.throws(
    () => validateTopicPage(unsafeHref),
    /relatedRabbitHoles\[0\]\.href/,
  );
});
