import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";

const projectRoot = new URL("..", import.meta.url);

function runBuild(env = {}) {
  return spawnSync("npm", ["run", "build"], {
    cwd: projectRoot,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}

function html(path) {
  return readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

test("local build exposes the complete review slice and keeps public release blocked", async () => {
  const local = runBuild({ PUBLIC_RELEASE: "false" });
  assert.equal(local.status, 0, `${local.stdout}\n${local.stderr}`);

  const pages = {
    home: html("index.html"),
    explore: html("explore/index.html"),
    qr: html("topics/qr-payment-stack/index.html"),
    culture: html("topics/chinamaxxing-inference/index.html"),
    qrHomeArchive: html("lab/qr-home-v1/index.html"),
  };

  for (const page of Object.values(pages)) {
    assert.match(page, /name="robots" content="noindex,nofollow"/);
    assert.match(page, /Local review · not approved for publication/);
    assert.doesNotMatch(page, /<audio|<video|>Transcript<|>Soundtrack<|>Music</i);
  }

  assert.match(pages.home, /True or False China/);
  assert.match(pages.home, /CURRENT TOPIC COVER|当前主题封面/i);
  assert.match(pages.home, /Open topic|打开主题/);
  assert.match(pages.home, /Explore all routes|探索所有路线/);
  assert.match(pages.home, /data-leo-object/);
  assert.match(pages.home, /data-desk-root/);
  assert.match(pages.home, /data-desk-object="news"/);
  assert.match(pages.home, /data-desk-object="env"/);
  assert.match(pages.home, /data-desk-object="clap"/);
  assert.match(pages.home, /Essays &amp; research|随笔与研究/);
  assert.match(pages.home, /PRACTICAL GUIDES — IN PROGRESS|实用指南/);
  assert.match(pages.home, /VIDEO &amp; SCRIPTS — IN PROGRESS|视频与脚本/);
  // The owner-review drawer still mentions the old Chinese instrument name; we only
  // care that the main homepage surface no longer uses the old structure.
  assert.doesNotMatch(pages.home, /data-brand-object/);
  assert.doesNotMatch(pages.home, /data-route-block/);
  assert.doesNotMatch(pages.home, /\/images\/qr-route-working\.png/);

  assert.match(pages.qrHomeArchive, /Continue the question/);
  assert.match(pages.qrHomeArchive, /60 seconds/);
  assert.match(pages.qrHomeArchive, /\/images\/qr-route-working\.png/);
  assert.match(pages.qrHomeArchive, /data-tiktok-handoff/);

  assert.match(pages.explore, /type="search"/);
  assert.match(pages.explore, /data-topic-index/);
  assert.match(pages.explore, /data-category-filter/);
  assert.match(pages.explore, /data-status-filter/);
  assert.match(pages.explore, /data-result-count/);

  for (const topicPage of [pages.qr, pages.culture]) {
    assert.match(topicPage, /Working Answer/);
    assert.match(topicPage, /Last reviewed/);
    assert.match(topicPage, /data-experience-root/);
    assert.match(topicPage, /data-source-list/);
    assert.match(topicPage, /data-related-list/);
    assert.match(topicPage, /data-share-controls/);
    assert.match(topicPage, /Copy link/);
    assert.match(
      topicPage,
      /What still feels unclear—or what China question should we unpack next\?/
    );
    assert.match(topicPage, /PostHog EU/);
    assert.match(topicPage, /stayed on this device/);
  }
  assert.match(pages.qr, /\/images\/qr-route-working\.png/);
  assert.match(pages.culture, /\/images\/mica-fixture-working\.png/);
  assert.match(pages.culture, /THIS POST DOES NOT EXIST/);
  assert.match(pages.culture, /B01/);
  assert.match(pages.culture, /B10/);

  // Every Topic in the local release plan — however many there are — has a
  // built page. Derived from data, so adding a third Topic needs no edit here.
  const { createReleasePlan } = await import("../src/lib/release-guard.ts");
  const { topics: registeredTopics } = await import("../src/data/topics.ts");
  const localPlan = createReleasePlan(
    { name: "Working Answers", isPlaceholderName: true },
    registeredTopics,
    { publicRelease: false },
  );
  assert.ok(localPlan.pages.length >= 1);
  for (const page of localPlan.pages) {
    const built = html(`topics/${page.slug}/index.html`);
    assert.match(
      built,
      /data-experience-root/,
      `missing built Topic page for slug: ${page.slug}`,
    );
  }

  // The site now has its real name and both public Topics are `approved`, so
  // a public build ships them as index,follow pages without the local-review
  // badge. Topics still marked draft must never ship in a public build.
  const publicAttempt = runBuild({ PUBLIC_RELEASE: "true" });
  assert.equal(
    publicAttempt.status,
    0,
    `${publicAttempt.stdout}\n${publicAttempt.stderr}`,
  );
  const { existsSync } = await import("node:fs");
  const approvedSlugs = registeredTopics
    .filter((topic) => topic.releaseState === "approved" || topic.releaseState === "published")
    .map((topic) => topic.slug);
  const unapprovedSlugs = registeredTopics
    .filter((topic) => topic.releaseState !== "approved" && topic.releaseState !== "published")
    .map((topic) => topic.slug);
  assert.ok(approvedSlugs.length >= 1, "public build should carry at least one approved Topic");
  for (const slug of approvedSlugs) {
    const built = html(`topics/${slug}/index.html`);
    assert.match(built, /name="robots" content="index,follow"/, `approved Topic page must be indexable: ${slug}`);
    assert.doesNotMatch(built, /Local review · not approved for publication/, `approved Topic page must drop the review badge: ${slug}`);
  }
  for (const slug of unapprovedSlugs) {
    assert.equal(
      existsSync(new URL(`../dist/topics/${slug}/index.html`, import.meta.url)),
      false,
      `unapproved Topic must not ship in a public build: ${slug}`,
    );
  }
  const publicHome = html("index.html");
  assert.match(publicHome, /name="robots" content="index,follow"/);
  assert.doesNotMatch(publicHome, /Local review · not approved for publication/);

  // Restore dist/ to the local-review build for any later local work.
  const restore = runBuild({ PUBLIC_RELEASE: "false" });
  assert.equal(restore.status, 0, `${restore.stdout}\n${restore.stderr}`);
});
