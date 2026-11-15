# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio for Youssef Eslam Hussein. Next.js 16 App Router, JavaScript (no TypeScript), CSS Modules, deployed on Vercel at `youssef-eslam29.vercel.app`.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build — run this before claiming a change works
npm run lint     # eslint (flat config, next/core-web-vitals)
```

There is no test suite. The only automated check is the mobile audit, which needs the dev server already running:

```bash
npx playwright install chromium   # once
node scripts/mobile-audit.mjs [baseUrl]
```

It loads seven phone/landscape/tablet viewports and fails on content past the screen edge, tap targets under 44×44, text under 12px, and hero buttons below the fold. Baselines are in `plans/mobile-audit-before.txt` and `plans/mobile-audit-after.txt`.

## This is not the Next.js in your training data

Next 16.2.7 / React 19.2.4. APIs, conventions and file structure differ from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code, and heed deprecation notices. In particular `params` is a Promise (`const { id } = await params`), and `next/font` loader options must be literals, not variables.

## Architecture: two content planes that never meet

This is the single most important thing to understand before changing content or data code.

| Plane | Reads from | Reached by |
|---|---|---|
| **Public site** (`/`) | `src/data/*.json`, imported directly into components at build time | visitors |
| **Admin** (`/admin`, `/admin/messages`) | API routes → MongoDB (`projects`, `skills`, `certificates`) and Firestore (`messages`) | the owner, behind a cookie |

**Editing content in the admin panel writes to MongoDB, and the public page never reads MongoDB.** The section components import the JSON files, so admin edits do not appear on the site. To change what visitors see, edit `src/data/*.json` and commit. The public-looking API routes (`/api/projects`, `/api/skills`, `/api/certificates`) all begin with an `isAdminRequest()` check and return 401 to anyone else, so the public page could not read them even if it tried. Their MongoDB reads fall back to the same JSON files when `MONGODB_URI` is unset or the collection is empty.

Treat the JSON files as the real content store and MongoDB as a half-finished second one. Don't "fix" a public section by pointing it at an API route without first deciding which store wins.

### Where each section gets its content

| Section | Source |
|---|---|
| Hero, About, Footer | hardcoded in the component |
| Skills | `src/data/skills.json` |
| Projects | `src/data/projects.json`, merged with a live client-side GitHub fetch |
| Certificates | `src/data/credentials.json` + images in `public/certificates/` |
| Contact | posts to `/api/contact` |

`src/app/page.js` just stacks the section components; every one of them is `"use client"` except the server-rendered `Skyline`. Section `id`s (`home`, `about`, `skills`, `projects`, `certificates`, `contact`) are what the navbar, bottom tab bar and scroll-spy key off.

Projects pulls extra cards straight from the GitHub API in the browser, filtered through the `FEATURED_REPOS` allowlist at the top of `src/components/Projects.js`. Add a repo name there to feature it; syncing "most recently updated" instead dragged coursework onto the site. If the fetch fails the curated JSON projects still render.

## Admin auth

`src/lib/admin-auth.js`, not NextAuth. `ADMIN_USER` / `ADMIN_PASS` are compared server-side in constant time and the client gets an httpOnly HMAC-signed session cookie (`admin_session`, 8h). There is deliberately no fallback: with the env vars unset, nobody gets in. Credentials never reach the browser bundle.

`next-auth` is in `package.json` but unused — only the names `NEXTAUTH_SECRET` (fallback signing secret) and `NEXTAUTH_URL` (admin link in notification emails) are read.

Every API route guards itself with `isAdminRequest()` except `/api/contact` and `/api/admin/{login,session}`. Keep that pattern when adding routes; there is no middleware doing it for you. `next.config.mjs` adds the security headers and marks `/admin/*` and `/api/*` `noindex`.

## Contact message flow

`POST /api/contact` validates presence and per-field length limits, then:

1. writes the message to Firestore `messages` — **fatal**, the request fails if this fails;
2. sends an FCM push to `FCM_DEVICE_TOKEN` — optional, warns and continues;
3. emails via Gmail/nodemailer — optional, warns and continues.

So a visitor sees success as soon as the message is stored, even with notifications misconfigured. All user content in the email goes through `escapeHtml()`. `public/firebase-messaging-sw.js` must stay at the root and has its Firebase config hardcoded (a service worker cannot read `process.env`; those values are `NEXT_PUBLIC` anyway).

## Design system

`Desgin folder/DESIGN.md` (note the spelling) is the full reference for the "Neo-Gotham Deco" look — palette with measured contrast ratios, the four typefaces and what each is for, the motifs, and per-section notes. Read it before changing anything visual.

`src/app/globals.css` holds the tokens and is the single source of truth; change a colour or font there and every section plus the admin pages follow. Per-component styling is a sibling `*.module.css`. There is no Tailwind in this project, despite what the README's badges suggest.

Hard constraints that the mobile audit or the design doc enforce:

- Copy the device-regime media queries **exactly** as listed at the top of `globals.css` — CSS has no custom media, so they are written out by hand and must match.
- `:hover` effects live **only** inside `(hover: hover) and (pointer: fine)`; on touch they stick after a tap.
- Everything tappable ≥ 44×44 px, no text under 12 px, skill descriptions ≤ 70 characters (the phone tiles are sized for that).
- Every animation stops under `prefers-reduced-motion`; the skyline falls back to a still frame with all lights on.
- Only one navigation pattern shows at a time: bottom tab bar on portrait phones, drawer on landscape/tablet, links on desktop.

The hero skyline is server-rendered SVG with no client JS. Towers are data in `src/components/Skyline.js` as `[x, width, height, crown]` in a 1600×1000 view box with the ground at y=1000; a fifth value `"red"` or `"pink"` traces a tower in neon. Keep the left half low (height ≤ 180) so the hero text sits on open sky.

Shared behaviour lives in `src/lib/animations.js` (reveal-on-scroll, typing effect, scroll-spy) and `src/lib/mobile.js` (media queries, scroll lock, back-button-to-close, focus trap, `scrollToSection`). The overlay hooks are subtle about browser history and iOS Safari — read their comments before touching them, and call `useBackToClose` before `useScrollLock`.

## Known gaps and stale docs

- `/api/skills/[id]` and `/api/certificates/[id]` don't exist, so the admin panel's delete for skills and certificates posts to a route that isn't there. Only `projects` and `messages` have per-id routes.
- `src/lib/github.js` is dead code. The public Projects component and `/api/github/sync` each do their own inline GitHub fetch.
- `plans/` is a historical record of past sessions, not current state. `plans/WEBSITE_STATUS.md` still describes Three.js, EmailJS, exposed `NEXT_PUBLIC` admin credentials and an undeployed site — all of which have since changed. Don't trust it over the code.
- The root `README.md` is the GitHub profile README, not project documentation.

## Environment

`.env.local` is gitignored and holds all of these; set the same ones in Vercel. Never print or commit their values.

- Admin: `ADMIN_USER`, `ADMIN_PASS`, `ADMIN_SESSION_SECRET` (or `NEXTAUTH_SECRET`)
- MongoDB (optional, falls back to JSON): `MONGODB_URI`
- Firebase admin, for messages and push: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (literal `\n` is unescaped at load), `FCM_DEVICE_TOKEN`
- Firebase client: `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- Email (optional): `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `NOTIFICATION_EMAIL`
- Site: `NEXT_PUBLIC_SITE_URL` (used by metadata, `robots.js`, `sitemap.js`), `NEXTAUTH_URL`
