import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { localSite, publicSite, topicFixture } from "./fixtures.mjs";

async function loadReleaseGuard() {
  const url = new URL("../src/lib/release-guard.ts", import.meta.url);
  assert.equal(
    existsSync(url),
    true,
    "release-guard.ts must exist before a release can be planned",
  );
  return import(url.href);
}

test("marks every local-review route noindex and visibly under review", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const plan = createReleasePlan(localSite, [topicFixture], {
    publicRelease: false,
  });
  assert.equal(plan.pages[0].robots, "noindex,nofollow");
  assert.equal(plan.pages[0].showLocalReviewIndicator, true);
});

test("blocks a public release while the site name is a placeholder", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const first = {
    ...topicFixture,
    slug: "first-approved",
    releaseState: "approved",
  };
  const second = {
    ...topicFixture,
    slug: "second-approved",
    releaseState: "approved",
  };
  assert.throws(
    () =>
      createReleasePlan(localSite, [first, second], {
        publicRelease: true,
      }),
    /non-placeholder public name/,
  );
});

test("allows a public release with any number of approved topics under a non-placeholder name", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const approved = (slug) => ({ ...topicFixture, slug, releaseState: "approved" });
  const plan = createReleasePlan(
    publicSite,
    [approved("a"), approved("b"), approved("c")],
    { publicRelease: true },
  );
  assert.deepEqual(
    plan.pages.map((page) => page.slug),
    ["a", "b", "c"],
  );
  assert.ok(plan.pages.every((page) => page.robots === "index,follow"));
  assert.ok(plan.pages.every((page) => !page.showLocalReviewIndicator));
});

test("excludes unapproved content from a public release", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const approved = { ...topicFixture, slug: "approved", releaseState: "approved" };
  const draft = { ...topicFixture, slug: "draft", releaseState: "draft" };
  const plan = createReleasePlan(publicSite, [approved, draft], {
    publicRelease: true,
  });
  assert.deepEqual(
    plan.pages.map((page) => page.slug),
    ["approved"],
  );
});

test("a public plan contains only the approved or published topics, however many", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const first = {
    ...topicFixture,
    slug: "first-approved",
    releaseState: "approved",
  };
  const second = {
    ...topicFixture,
    slug: "second-published",
    releaseState: "published",
  };
  const draft = { ...topicFixture, slug: "private-draft", releaseState: "draft" };
  const plan = createReleasePlan(publicSite, [first, second, draft], {
    publicRelease: true,
  });

  assert.deepEqual(
    plan.pages.map((page) => page.slug),
    ["first-approved", "second-published"],
  );
  assert.ok(plan.pages.every((page) => page.robots === "index,follow"));
  assert.ok(plan.pages.every((page) => !page.showLocalReviewIndicator));
});

test("rejects duplicate Topic slugs instead of treating one path as two approvals", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  const approved = {
    ...topicFixture,
    slug: "duplicated-approved-path",
    releaseState: "approved",
  };

  assert.throws(
    () =>
      createReleasePlan(publicSite, [approved, structuredClone(approved)], {
        publicRelease: true,
      }),
    /unique Topic slugs and Astro paths/,
  );
});

test("a third legitimate Topic gets its own page in a local-review plan", async () => {
  const { createReleasePlan } = await loadReleaseGuard();
  // Simulate "加一篇": a third valid Topic joins the existing set. The plan
  // must generate one route per Topic — the count follows the content.
  const third = {
    ...topicFixture,
    topicId: "fixture-topic-id-0003",
    slug: "a-third-question",
  };
  const plan = createReleasePlan(
    localSite,
    [
      { ...topicFixture, topicId: "fixture-topic-id-0001", slug: "first-question" },
      { ...topicFixture, topicId: "fixture-topic-id-0002", slug: "second-question" },
      third,
    ],
    { publicRelease: false },
  );

  assert.deepEqual(
    plan.pages.map((page) => page.slug),
    ["first-question", "second-question", "a-third-question"],
  );
  assert.equal(plan.pages.length, 3);
  assert.ok(plan.pages.every((page) => page.robots === "noindex,nofollow"));
});
