# True or False China — Astro content site

This is a new, standalone Astro site. It does not import or depend on an older
site, Topic, name, Page Lab, or old asset.

The site contains:

- a question-first homepage;
- an Explore index designed for dozens of future Topics;
- `qr-payment-stack`, with a three-stage route diagnosis;
- `chinamaxxing-inference`, with one clearly fictional inference test;
- sources, counterexamples, related research trails, local feedback, share/copy,
  responsive layouts, keyboard controls, and reduced-motion behavior;
- two original working images.

## Local use

```sh
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

The default build is local review. Every page is `noindex,nofollow` and visibly
marked `not approved for publication`.

For non-technical change instructions, read `EDITING-GUIDE.md`.

## Public release gate

`PUBLIC_RELEASE=true npm run build` produces the public site. Current status:

1. ✅ the placeholder site name is replaced with an approved public name
   ("True or False China");
2. ✅ both public Topics are individually `approved`;
3. all page-specific blockers are closed;
4. ⏳ the user reviews the exact public pages, images, source dates, analytics
   fields, destination, and data leaving the machine;
5. ⏳ the user explicitly says `确认` before anything is pushed to a remote.

This repository has no remote. Building locally does not publish anything.

## Analytics and feedback

No PostHog client is created or connected by this v1. Without a future explicit
key, the adapter is a no-op. It also stays off under Do Not Track.

All seven page events now pass through one local `UiEventDetail` contract and a
disabled `AnalyticsBridge`. The bridge does not read an environment variable or
discover a client. A future approved integration must explicitly call
`installAnalyticsBridge()` with both a reviewed public key and an injected
client factory; either value missing, or Do Not Track enabled, keeps it off.

The feedback form explains the future PostHog EU destination, but in local
review it sends nothing and says the words stayed on the device. Visitors can
copy their own question. The future transport contract allows user-written text
only on `question_submitted`, capped at 500 characters; all other events retain
the low-risk property allowlist.
