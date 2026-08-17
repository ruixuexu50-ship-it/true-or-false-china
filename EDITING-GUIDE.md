# Editing guide — local-review v1

This site is deliberately split into **what the page says** and **how the page
behaves**. You can change one without silently changing the other.

## Change the homepage or its order

- Open `src/pages/index.astro`.
- The first Topic is the first item in `src/data/topics.ts`; the second Topic is
  the second item.
- Change only the homepage wording or order when you are changing the entrance,
  not the facts inside a Topic.
- Run `npm test` after the change. The ordinary homepage CTA uses
  `?from=direct#interaction`. Keep the separate, clearly labeled TikTok handoff
  link at `?from=tiktok#interaction`; use that URL only in a TikTok/video exit,
  never as the default homepage click.

## Change a Topic's facts, answer, sources, or boundaries

- Open `src/data/topics.ts`.
- Find the Topic by its `slug`.
- Facts, source links, caveats, counterexamples, review date, and rabbit holes
  live there.
- Any factual or source change invalidates the previous review. Change
  `releaseState` to `draft`, add a dated `revisions` entry, and run the source
  review again. The `markContentChanged()` helper in `src/lib/contracts.ts`
  exists for future editing tools so they perform this downgrade automatically.
- Do not change a source merely to make a conclusion sound stronger. Update the
  claim boundary and unknowns too.

## Change color, image treatment, or motion

- Open `src/data/experiences.ts` for palettes, character metadata, visual states,
  and motion logic.
- Open the matching file in `src/components/experiences/` for the actual
  interaction layout and state-linked motion.
- Presentation-only changes do not change the Topic's factual review state.
- Keep `prefers-reduced-motion`, keyboard input, visible focus, and text labels.
- For the QR page, keep one character, one continuous route, and three gates.
  The paper color may remain inside the bounded illustration, never as the page
  canvas.

## Add a new Page Studio version and Topic

1. Create a new, versioned brief at
   `work/page-studio/briefs/<topic-slug>/v1.md` outside this site repository.
2. Keep raw material, judgment, derivation, and experience decisions separate.
3. Add a new `SiteTopic` record in `src/data/topics.ts`; never overwrite an
   existing Topic to create a new one.
4. Add a separate ExperiencePack in `src/data/experiences.ts`.
5. Add one explicit interaction component and register it in
   `src/components/experiences/registry.ts`.
6. Start at `draft`. Add tests for the new route and its rule engine before
   changing production code.
7. Explore already uses a searchable editorial index, so a valid Topic will
   join the index without creating a new card-grid template.

## Optional media stays absent until real

- If `transcript`, image, or music data is absent, no control, heading, empty
  frame, or “coming soon” label renders.
- Do not turn page copy into an invented transcript.
- Any future sound must have a rights record, a reason to exist, user-initiated
  playback, and an accessibility alternative.
- Image changes need provenance, usage status, alt-text review, and a dated
  editorial decision.

## Change release state

Before `draft → locally-reviewed`, review:

- the exact question, Working Answer, counterexamples, and unknowns;
- every source URL, date, role, and caveat;
- the interaction result language and whether it overpromises;
- image provenance and representation risk;
- keyboard, small-screen, contrast, focus, and reduced-motion behavior.

Before `locally-reviewed → approved`, prepare a line-by-line public payload for
the user. Publication still requires the user to explicitly say `确认` after the
exact pages, assets, analytics fields, hosting destination, and data leaving the
machine are listed.

## Analytics and deployment remain disconnected

- No PostHog client is created by this v1.
- `src/components/AnalyticsBridge.astro` installs only a local no-op bridge. It
  does not read `PUBLIC_POSTHOG_KEY`, import a client, or initialize a service.
- A future approved integration must explicitly inject **both** a reviewed
  public key and client factory into `installAnalyticsBridge()`; either missing,
  or Do Not Track enabled, keeps the adapter off.
- Local feedback stays in the page and can only be copied by the visitor.
- The seven event names and strict property filter live in
  `src/lib/feedback.ts` and `src/lib/analytics.ts`.
- `PUBLIC_RELEASE=true npm run build` must fail while the name is a placeholder
  or the two pages are not approved.
- There is no Git remote and no deploy command in this repository. Do not add or
  run one until the public checklist has been reviewed and the user says `确认`.
