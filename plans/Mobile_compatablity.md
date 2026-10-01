# Mobile Compatibility Plan: Youssef Eslam Portfolio

**For:** Claude Code (VS Code)  
**Goal:** Make https://youssef-eslam29.vercel.app fit phones properly and feel easy to use there, while keeping the Neo-Gotham Deco look on desktop as it is.  
**Design rules:** the **ui-ux-pro-max** skill. Its priority order (Accessibility → Touch → Performance → Layout → Type → Motion → Forms → Navigation) decides what gets fixed first. Appendix C maps each rule to the change that covers it.

---

## 0. Read this first (instructions for Claude Code)

1. **Read before coding:**
   - `plans/AGENTS.md`. This is Next.js **16.2**. Check `node_modules/next/dist/docs/` before using any Next API.
   - `Desgin folder/DESIGN.md`. It covers the tokens, motifs and contrast numbers. Every new piece of UI uses the existing tokens in `src/app/globals.css`.
2. **Keep the stack as it is:** JavaScript (not TypeScript), CSS Modules plus `globals.css`, and `framer-motion` 12. **Don't** add Tailwind, shadcn/ui, TypeScript or RTL. This site is English and left-to-right. **Don't** add npm dependencies. framer-motion already handles the gestures, and icons stay inline SVG like the rest of the site. The only exception is `playwright` as an optional devDependency for the audit script in Appendix B.
3. **Desktop (≥1024px) should look the same afterwards.** These desktop differences are expected:
   - icon buttons grow to 44px
   - small labels stop going below 12px
   - hover effects only fire for real mouse pointers
   - the logo link is 44px tall
   - contact cards become whole-card links
   - the certificate lightbox gains a counter and Prev/Next buttons.

   Nothing else on desktop should change.
4. **Leave alone:** API routes, auth, Firebase, MongoDB, `.env.local`, `src/data/*.json` content, and the site copy (except the small UI labels this plan names).
5. **Don't touch other uncommitted work.** `git status` currently shows uncommitted changes in `src/app/admin/admin.module.css`, `plans/WEBSITE_STATUS.md` and `plans/face_animation.md`. They aren't part of this work. Don't stage or overwrite them, and ask before editing `admin.module.css`.
6. **Work one phase at a time.** After each phase:
   - run `npm run lint`
   - run the audit script (Appendix B)
   - check in DevTools device mode at 375×667 and 844×390
   - commit with the suggested message.

   Work on a branch: `git checkout -b feat/mobile-ux`.
7. **Use logical CSS properties in new CSS** (`padding-inline`, `margin-inline-start`, `inset-inline`, `border-inline-end`), not left/right.
8. **Test on a real phone:**
   - Run `npm run dev -- -H 0.0.0.0` and open `http://<your PC's IPv4 from ipconfig>:3000` on the phone, on the same Wi-Fi. Allow Node through Windows Firewall.
   - Or push the branch and use the Vercel preview URL.

---

## 1. What's wrong on phones today (measured)

Measured on the current code with the real fonts, in Chromium phone emulation (touch on). Numbers are at 375×667 (iPhone SE) unless another size is named.

| # | Severity | Problem | Evidence |
|---|---|---|---|
| 1 | **Critical** | **About text is cut off on the right.** The grid column grows to the paper file's size, so the text block is always 368px wide. | Runs 9px past the screen at 375px and 64px at 320px. Words like "Recent", "PlayStation" and "written" lose their endings. Cause: grid items default to `min-width: auto` in `About.module.css`. |
| 2 | **Critical** | **Skill descriptions only exist on mouse hover** (`.card:hover .sign`). The tiles aren't buttons. | Touch screens have no hover. In Chrome's phone emulation a tap shows the description and it then stays stuck; iOS Safari may not show it at all. Keyboard users can't reach it. |
| 3 | **Critical** | **The menu drawer breaks in landscape.** It doesn't scroll and the page behind it is locked. | At 667×375 and 740×360 the last items ("Contact", "Let's Talk") sit at y=537, off screen and unreachable. |
| 4 | High | **Drawer basics are missing.** At ≤400px it covers the whole width, so there's no backdrop to tap. Escape doesn't close it, focus isn't moved into it, there's no swipe-to-close, and Android Back leaves the site. | Checked in the browser: `elementFromPoint` hits the drawer, and Escape left it open. |
| 5 | High | **38 tap targets are under 44×44px.** | Burger 34×34, hero social links 42, filter chips 42 tall, project GitHub/live icons 36, certificate "View" buttons 36, contact links 20 tall, footer legal links 22, footer social links 40. |
| 6 | High | **The page is very long on phones.** | 15,737px = **23.6 screens**. Skills is 3,702px because it drops to 1 column below 380px (14 tiles of 196px). Certificates is 4,886px (7 full-width image cards). |
| 7 | High | **Landscape phones get the desktop layout squeezed.** | At 844×390 and 900px wide the logo and "Let's Talk" wrap onto 2 lines and the bar is 88px tall (23% of the screen). The hero buttons end at y=484 at 844×390 and y=467 at 667×375, so they're below the first screen. |
| 8 | High | **The hero takes 1.5 screens.** | The skyline art (the brand moment) starts at y=649 at 375×667. At 320×568 only "View My Work" is visible above the fold. |
| 9 | Medium | **14 text styles are under 12px.** | Skill category 9.6px, certificate category 10.2px, `dt` 10.6px, contact titles 10.6px, "Synced" badge 10.6px, tags 10.9px, footer copyright 11.2px, kicker and form labels 11.5px, hero plaque 11.8px. |
| 10 | Medium | **Hover effects stick after a tap** (cards lift with `translateY` and stay up). There's no pressed feedback, and the default grey tap highlight shows. | Every `:hover` rule is unguarded. |
| 11 | Medium | **The certificate lightbox is small on phones.** | The image is 295×209px at 375 wide, so the certificate can't be read. No previous/next, no swipe, Back doesn't close it. |
| 12 | Medium | **No safe-area handling.** | `viewport-fit=cover` isn't set, so `env(safe-area-inset-*)` can't be used. That's needed for a bottom bar and for landscape notches. |
| 13 | Medium | **Filter bars wrap into 2–3 uneven rows** that read as clutter. | Skills chips are 142px tall at 375 and 320. |
| 14 | Low | **Performance leaks.** | (a) `useActiveSection(NAV_LINKS.map(...))` gets a new array on every render, so its 6 observers are torn down and rebuilt on each Navbar render. (b) The typing effect re-renders the whole Hero every 35–70ms, leaks a nested `setTimeout`, and ignores reduced motion. (c) Hero's endless animations (searchlights, blinking lights, cursor) keep running after you scroll past. (d) Certificate thumbnails request `100vw` images on phones. |
| 15 | Low | **Centered body paragraphs** in About on mobile make long text harder to read. | `.text { text-align: center }` at ≤900px. |
| 16 | High | **The "current section" highlight never lights up for tall sections on phones.** `useActiveSection` needs 10% of a section inside a band about 147px tall. Skills (3,702px), Projects and Certificates can never reach that on a phone. | Tested: after jumping to Projects at 375×667, the highlight still said "About". The new bottom bar depends on this, so it's fixed in Phase 2. |

---

## 2. Definition of done (targets)

Measured at 375×667 with the audit script unless another size is named. The "Prototype" column is what these exact CSS changes produced when injected into the current site.

| Check | Now | Target | Prototype |
|---|---|---|---|
| Page height (375×667) | 15,737px / 23.6 screens | **≤ 11,000px** | 10,777px |
| Skills section | 3,702px | **≤ 1,750px** | 1,646px |
| Certificates section | 4,886px | **≤ 2,500px** | 2,479px (upper bound: the prototype over-padded the education box) |
| Hero buttons in first screen | 320×568: only 1 of 3 | **All 3** at 320×568, 375×667, 667×375 and 844×390 | ✔ (bottoms at 566, 530, 313 and 375) |
| Skyline visible in first screen (375×667) | starts at 649 | **starts ≤ 600** | 558 |
| Content past the screen edge (320–1024px) | About clipped | **none** | ✔ |
| Tap targets < 44px | 38 | **0** (links inside paragraphs are exempt) | n/a |
| Text < 12px | 14 styles | **0** | n/a |
| Drawer items reachable in landscape | no | **all**, and it closes with tap, Esc, swipe, backdrop and Back | n/a |
| Lighthouse mobile | record baseline in Phase 0 | Accessibility ≥ 95, CLS < 0.1, Performance no worse | n/a |

---

## 3. Device regimes (use these exact media queries everywhere)

CSS custom media aren't supported, so write the queries out by hand. Add this comment block near the top of `globals.css`:

```css
/* ---------- Device regimes (copy these queries exactly) ----------
   PHONE           (max-width: 767px)                              single column, phone spacing
   PHONE_PORTRAIT  (max-width: 767px) and (orientation: portrait)  bottom tab bar, skyline band under the hero text
   SHORT_LANDSCAPE (orientation: landscape) and (max-height: 500px) compact top bar + drawer, side-by-side hero
   COMPACT_NAV     (max-width: 1023px)                             top bar shows the burger instead of links
   DESKTOP         (min-width: 1024px)                             unchanged desktop layout
   HOVER           (hover: hover) and (pointer: fine)              the ONLY place :hover effects may live
   TOUCH           (hover: none)                                   :active press feedback, "tap" hints
   ---------------------------------------------------------------- */
```

Navigation by regime:

| Regime | Top bar | Section navigation |
|---|---|---|
| Phone portrait (≤767, portrait) | Logo (goes Home) + **CV** button | **Bottom tab bar** (new) |
| Phone landscape / tablet (≤1023) | Logo + burger | Side **drawer** (fixed and improved) |
| Desktop (≥1024) | Logo + links + "Let's Talk" | Unchanged |

Only one navigation pattern is visible at a time (ui-ux-pro-max `avoid-mixed-patterns`). The existing 768/769 breakpoints move to **767/768**. The utility classes `.hide-tablet` and `.hide-desktop` are no longer used by the Navbar. Leave them in `globals.css`.

---

## Phase 0: Baseline (no changes to the site itself)

1. `git status`. Note the unrelated uncommitted files (see §0.5).
2. `git checkout -b feat/mobile-ux`
3. Add the audit script from **Appendix B**:
   - `npm i -D playwright`
   - `npx playwright install chromium`
   - run `npm run dev`, then `node scripts/mobile-audit.mjs`
   - save the output to `plans/mobile-audit-before.txt`.
4. Run Lighthouse in Chrome DevTools (Mobile, Navigation) on `http://localhost:3000` and note the four scores in `plans/mobile-audit-before.txt`.

**Commit:** `chore(mobile): add mobile audit script and baseline`

---

## Phase 1: Foundation (viewport, tokens, touch defaults, shared hooks)

### 1.1 `src/app/layout.js`: viewport
```js
export const viewport = {
  // The top of the hero sky, so the browser chrome runs into it.
  themeColor: "#2A0507",
  colorScheme: "dark",      // dark native pickers and scrollbars (the <select> on Android)
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",     // enables env(safe-area-inset-*) for the bottom bar and landscape notches
};
```
Never add `maximumScale` or `userScalable: false`. Pinch zoom has to keep working.

### 1.2 `src/app/globals.css`: tokens (add inside `:root`)
```css
  /* Mobile */
  --tap: 44px;                                   /* minimum touch target */
  --nav-h: 76px;                                 /* fixed top bar, desktop */
  --bottom-nav-h: 64px;                          /* phone tab bar, without the safe area */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
```
Change `--fs-label: 0.72rem;` to **`0.75rem`** (12px floor for labels). Then add:
```css
@media (max-width: 1023px) {
  :root { --nav-h: 60px; }
}
```

### 1.3 `globals.css`: base and touch defaults
- `html`: add `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;`. This stops iOS from inflating text in landscape.
- `body`: keep `overflow-x: hidden;` and add `overflow-x: clip;` on the next line. Add `min-height: 100svh;` after the existing `100vh`.
- Add:
```css
/* Anchor jumps stop below the fixed top bar */
section[id] { scroll-margin-top: calc(var(--nav-h) + 8px); }

/* No 300ms delay, no grey flash: our own :active states give the feedback */
a, button, [role="button"], [role="tab"], label, input, select, textarea {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Room for the phone tab bar, so it never covers the footer */
@media (max-width: 767px) and (orientation: portrait) {
  body { padding-bottom: calc(var(--bottom-nav-h) + var(--safe-bottom)); }
}
```

### 1.4 `globals.css`: container gutters with safe areas
Replace the three `.container` rules with:
```css
.container {
  --gutter: var(--space-xl);
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: max(var(--gutter), var(--safe-left)) max(var(--gutter), var(--safe-right));
}
@media (max-width: 767px) { .container { --gutter: var(--space-lg); } }
@media (max-width: 480px) { .container { --gutter: var(--space-md); } }
```

### 1.5 `globals.css`: hover only for mouse, press feedback for touch
Move **every** `:hover` rule in `globals.css` into one `@media (hover: hover) and (pointer: fine) { … }` block:
- `.glass-card:hover`
- `.btn-primary:hover:not(:disabled)`
- `.btn-ghost:hover:not(:disabled)`
- `.btn-light:hover:not(:disabled)`
- `.filter-btn:hover`
- `::-webkit-scrollbar-thumb:hover`

`a:hover` (colour only) can stay where it is. Then add:
```css
@media (hover: none) {
  .btn { transition-duration: 0.12s; }
  .btn:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:active:not(:disabled) { background: var(--clr-crimson-600); color: #FFFFFF; }
  .btn-ghost:active:not(:disabled)   { background: var(--clr-amber-soft); border-color: var(--clr-amber); color: var(--clr-amber); }
  .btn-light:active:not(:disabled)   { background: var(--clr-amber); border-color: var(--clr-amber); }
  .filter-btn:active                 { color: var(--clr-cream); border-color: var(--clr-brass-line); }
}
```
**Do the same in every CSS module as you reach its phase.** Phases 2–9 list the hover rules in each file.

### 1.6 `globals.css`: sizes
- `.filter-btn { min-height: 44px; }` (was 42px)
- `.tag { font-size: 0.75rem; }` (was 0.68rem)

### 1.7 `globals.css`: phone rhythm and the filter chip row
The section spacing below was checked in the prototype. The chip row turns 2–3 wrapped rows into one swipeable row. A fade on the right edge hints that there's more.
```css
@media (max-width: 767px) {
  .section { padding-block: 4.5rem; }
  .section-header { margin-bottom: 2.5rem; }
  .section-subtitle { font-size: 1rem; }

  .filter-bar {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    margin-inline: calc(-1 * var(--gutter));      /* bleed to the screen edges */
    margin-bottom: 2rem;
    padding: 8px var(--gutter);                   /* room for the active chip's glow */
    scroll-padding-inline: var(--gutter);
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
            mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
  }
  .filter-bar::-webkit-scrollbar { display: none; }
  .filter-btn { flex: 0 0 auto; scroll-snap-align: start; }
}
```
`--gutter` comes from `.container`. Every `.filter-bar` sits inside one, so the bleed lines up.

In **Skills.js, Projects.js and Certificates.js**, make each filter button's `onClick` also call:
`e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest", behavior: scrollBehavior() })`.
This keeps the chosen chip fully on screen.

### 1.8 `globals.css`: shorter reveals on phones
```css
@media (max-width: 767px) {
  .reveal { transform: translateY(24px); transition-duration: 0.55s; }
  .reveal-left { transform: translateX(-24px); transition-duration: 0.55s; }
  .reveal-right { transform: translateX(24px); transition-duration: 0.55s; }
  .stagger-children > * { transform: translateY(18px); transition-duration: 0.45s; }
  .stagger-children.revealed > *:nth-child(n+7) { transition-delay: 0.3s; }  /* cap the stagger */
}
```
The `.revealed` rules keep winning because they're more specific. Check that elements still end at `transform: none` / `translate(0)`.

### 1.9 `globals.css`: form error style (used in Phase 8)
```css
.field-error { font-size: 0.85rem; line-height: 1.4; color: var(--clr-neon); }
.form-input[aria-invalid="true"] { border-color: var(--clr-neon); }
```

### 1.10 New file `src/lib/mobile.js`: shared hooks
Create it with **exactly** the hooks in **Appendix A**:
- `useMediaQuery`
- `useScrollLock`
- `useBackToClose`
- `useFocusTrap`
- `scrollToSection`

**Acceptance (Phase 1):** lint passes. At 1280px desktop looks the same, apart from slightly larger small labels and filter chips that are 2px taller. At 375px no element crosses the screen edge except the known About bug, which Phase 4 fixes.

**Commit:** `chore(mobile): viewport-fit, mobile tokens, touch defaults, shared hooks`

---

## Phase 2: Navigation (top bar, bottom tab bar, drawer)

### 2.0 `src/lib/animations.js`: fix the scroll-spy (finding #16)
Replace `useActiveSection` with a single observer that watches a thin line 40% down the screen. Sections are stacked, so exactly one crosses that line at a time, however tall it is:
```js
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -59% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
```

### 2.1 `src/components/Navbar.js`
**Appendix E has the complete, tested file.** The steps below explain what it changes.
1. Move the IDs out of the component so the observer isn't rebuilt on every render:
   `const SECTION_IDS = NAV_LINKS.map((l) => l.id);` sits above the component, then `useActiveSection(SECTION_IDS)`.
2. Replace the hand-made `offset = 80` scroll with `scrollToSection(id)` from `src/lib/mobile.js`. The CSS `scroll-margin-top` handles the bar height, and the URL hash updates via `replaceState`, so `/#projects` can be shared.
3. Remove `hide-tablet` from the CTA and `hide-desktop` from the burger. Visibility now lives in `Navbar.module.css`.
4. Burger button:
   - `aria-label={mobileOpen ? "Close menu" : "Open menu"}`
   - `aria-controls="mobile-menu"`
   - keep `aria-expanded`.
5. Add a **phone-only CV button** in the top bar, just before the burger:
   ```jsx
   <a href="/resume/youssef_eslam_cv.pdf" download className={`btn btn-ghost ${styles.cvBtn}`} aria-label="Download CV">
     {/* same download icon as the hero, 16px, aria-hidden */}
     <span>CV</span>
   </a>
   ```
6. Drawer (the sliding `motion.div`):
   - Add `ref={drawerRef}`, `id="mobile-menu"`, `role="dialog"`, `aria-modal="true"`, `aria-label="Site menu"`.
   - Hooks, **in this order**:
     ```js
     const drawerRef = useRef(null);
     const releaseHistory = useBackToClose(mobileOpen, () => setMobileOpen(false)); // 1. push the Back entry before the lock
     useScrollLock(mobileOpen);                                                     // 2.
     const closeMenu = useCallback(() => { releaseHistory(); setMobileOpen(false); }, [releaseHistory]);
     useFocusTrap(drawerRef, mobileOpen, closeMenu);                                // 3. Esc closes, Tab stays inside
     ```
   - **Swipe right to close:**
     ```jsx
     drag="x"
     dragConstraints={{ left: 0, right: 0 }}
     dragElastic={{ left: 0, right: 0.5 }}
     dragMomentum={false}
     onDragStart={() => { draggedRef.current = true; }}
     onDragEnd={(_, info) => {
       setTimeout(() => { draggedRef.current = false; }, 0);
       if (info.offset.x > 80 || info.velocity.x > 500) closeMenu();
     }}
     ```
     In each drawer link's `onClick`, return early if `draggedRef.current` is true. That stops a swipe from also firing a link.
   - The backdrop's `onClick` calls `closeMenu`, and so does the burger when the menu is open.
   - Make the exit faster than the entrance (ui-ux-pro-max `exit-faster-than-enter`). Change `menuVariants.exit` to `{ x: "100%", transition: { type: "tween", duration: 0.22, ease: [0.4, 0, 1, 1] } }`, **and** change the drawer's prop from `exit="hidden"` to `exit="exit"`. Today the `exit` variant is never used because the prop points at `hidden`.
7. Picking a section from the drawer must wait for the scroll lock to release before scrolling:
   ```js
   const pendingTarget = useRef(null);
   const handleNav = useCallback((id) => {
     if (mobileOpen) {
       releaseHistory(true);          // keep the history entry; scrollToSection turns it into #id
       pendingTarget.current = id;
       setMobileOpen(false);
     } else {
       scrollToSection(id);
     }
   }, [mobileOpen, releaseHistory]);

   // Declared AFTER useScrollLock: React runs all effect cleanups (the unlock) before new effects.
   useEffect(() => {
     if (mobileOpen || !pendingTarget.current) return;
     const id = pendingTarget.current;
     pendingTarget.current = null;
     scrollToSection(id, { focusHeading: true });
   }, [mobileOpen]);
   ```
8. Close the drawer when the screen changes regime. Rotating to portrait shows the bottom bar; going to ≥1024px shows the desktop links. Use `window.matchMedia("(max-width: 767px) and (orientation: portrait), (min-width: 1024px)")` with a `change` listener that calls `closeMenu()` when it matches. Call `closeMenu` inside the listener, never directly in the effect body.
9. The scroll handler: `if (document.body.dataset.overlay) return;` before `setScrolled(...)`. Locking the scroll jumps `scrollY` to 0, which would otherwise flash the bar to transparent.
10. Render the new bottom bar inside the same `MotionConfig`, after the drawer:
    `<BottomNav active={activeSection} onNavigate={handleNav} />`

### 2.2 `src/components/Navbar.module.css`
- `.logo`: add `min-height: var(--tap);`
- `.burger`: replace the rule with:
  ```css
  .burger {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: var(--tap);
    height: var(--tap);
    margin-inline-end: -8px;   /* visual edge stays aligned; hit area grows */
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  ```
  Keep `.burgerLine` as it is. The 2px lines plus 6px gap still give the 8px `translateY` for the X.
- `.nav .cvBtn { display: none; }`. The `.nav` prefix matters: `.cvBtn` and `.cta` also carry the global `.btn` class (`display: inline-flex`). Without the prefix, which rule wins would depend on stylesheet order.
- `.mobileMenu`: change to
  ```css
  width: min(86vw, 400px);              /* a strip of backdrop always stays tappable */
  height: 100vh; height: 100dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: calc(var(--nav-h) + var(--safe-top) + 1rem)
           max(var(--space-xl), var(--safe-right))
           calc(var(--space-xl) + var(--safe-bottom))
           calc(var(--space-xl) + 14px);
  ```
- Delete the old `@media (max-width: 768px)` and `@media (max-width: 1024px) and (min-width: 769px)` blocks. Replace them with:
  ```css
  @media (max-width: 1023px) {
    .nav { padding-block: calc(0.6rem + var(--safe-top)) 0.6rem; }
    .nav.scrolled { padding-block: calc(0.5rem + var(--safe-top)) 0.5rem; }
    .links, .nav .cta { display: none; }
    .burger { display: inline-flex; }
  }
  @media (max-width: 767px) and (orientation: portrait) {
    .burger { display: none; }
    .nav .cvBtn { display: inline-flex; min-height: var(--tap); padding: 0 0.95rem; gap: 0.45rem; font-size: 0.95rem; }
  }
  /* Landscape phones: two columns of shorter links so everything fits without scrolling */
  @media (orientation: landscape) and (max-height: 500px) {
    .mobileLinks { display: grid; grid-template-columns: 1fr 1fr; column-gap: 1.5rem; }
    .mobileLink { font-size: 1.35rem; padding-block: 0.7rem; }
  }
  ```
- Hover guard: move `.logo:hover`, `.link:hover` and `.mobileLink:hover` into `@media (hover: hover) and (pointer: fine)`. Keep `.mobileLink.active` outside it.

### 2.3 New: `src/components/BottomNav.js` + `BottomNav.module.css`
A phone-only tab bar in the deco style:
- glass-black bar
- brass double hairline on top
- the active tab lit in neon, with a short neon tube gliding above it (the same spring as the desktop underline).

Five tabs, the ui-ux-pro-max maximum. Each has an icon and a label. Home is the logo in the top bar.

| Tab label | Section id | Icon (Lucide shape, inline SVG, 22px, `stroke-width="1.75"`) |
|---|---|---|
| About | `about` | user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>` |
| Skills | `skills` | cpu: `<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>` |
| Work | `projects` | folder: `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>` |
| Certs | `certificates` | award: `<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>` |
| Contact | `contact` | mail: the same paths as the Email icon in `Contact.js` |

```jsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./BottomNav.module.css";

const TABS = [/* { id, label, icon: <>…paths…</> } from the table above */];

export default function BottomNav({ active, onNavigate }) {
  // Slide away while the keyboard is up (a form field has focus)
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el) => el instanceof Element && el.matches("input, textarea, select");
    const onIn = (e) => { if (isField(e.target)) setTyping(true); };
    const onOut = (e) => { if (isField(e.target)) setTyping(false); };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <nav className={styles.bar} aria-label="Sections" data-hidden={typing || undefined}>
      <ul className={styles.list}>
        {TABS.map((tab) => {
          const current = active === tab.id;
          return (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                className={styles.item}
                aria-current={current ? "location" : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate(tab.id); }}
              >
                {current && (
                  <motion.span layoutId="bottomNavIndicator" className={styles.indicator}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }} />
                )}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{tab.icon}</svg>
                <span className={styles.label}>{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

```css
/* BottomNav.module.css: the marquee rail along the bottom of a phone */
.bar { display: none; }

@media (max-width: 767px) and (orientation: portrait) {
  .bar {
    display: block;
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: var(--z-nav);
    padding-bottom: var(--safe-bottom);           /* clears the home indicator */
    background: var(--clr-glass-strong);
    -webkit-backdrop-filter: blur(12px);
            backdrop-filter: blur(12px);
    border-top: 1px solid var(--clr-brass-line);
    box-shadow: 0 -14px 32px rgba(0, 0, 0, 0.35);
    transition: transform 0.25s var(--ease-out-expo);
  }
}

/* Deco double hairline: a second brass line 4px under the border */
.bar::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 4px;
  height: 1px;
  background: var(--clr-brass-faint);
  pointer-events: none;
}

.bar[data-hidden],
:global(body[data-overlay]) .bar { transform: translateY(110%); }

.list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  height: var(--bottom-nav-h);
  list-style: none;
  padding-inline: max(4px, var(--safe-left)) max(4px, var(--safe-right));
}

.item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  min-width: var(--tap);
  color: var(--clr-text-secondary);            /* 9.9:1 on ink */
  text-decoration: none;
  transition: color var(--transition-fast);
}
.item svg { width: 22px; height: 22px; flex-shrink: 0; }

.label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;                     /* only matters at 200% text zoom */
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
}

.item[aria-current] { color: var(--clr-neon-core); text-shadow: 0 0 8px rgba(255, 74, 69, 0.75); }
.item[aria-current] svg { filter: drop-shadow(0 0 4px rgba(255, 74, 69, 0.8)); }
.item:active { color: var(--clr-cream); background: rgba(255, 74, 69, 0.06); }
.item:focus-visible { outline: 2px solid var(--clr-amber); outline-offset: -4px; }

/* The neon tube that glides to the current tab */
.indicator {
  position: absolute;
  top: -1px;
  inset-inline: 24%;
  height: 2px;
  background: var(--clr-neon);
  box-shadow: 0 0 8px var(--clr-neon-glow), 0 0 18px rgba(255, 74, 69, 0.3);
}

@media (prefers-reduced-motion: reduce) { .bar { transition: none; } }
```

**Behaviour rules:**
- Tapping the current tab again scrolls back to the top of that section.
- Nothing is highlighted while you're in the hero.
- The bar slides away while a form field has focus (keyboard open) and while the drawer or lightbox is open. The scroll lock sets `body[data-overlay]`.

**Already tested.** Sections 2.0–2.3 (with Phase 1.2/1.3 and Appendix A) were built on a local copy of this repo and run in Chromium phone emulation:

| Check | Result |
|---|---|
| Bottom bar at 375×667 | 5 tabs of 73×64px; CV button 74×44px; burger hidden |
| Tap "Work" | lands with Projects 68px from the top; URL `#projects`; "Work" highlighted |
| Focus a form field | bar slides away |
| Footer | its last button ends 37px above the bar |
| Drawer at 667×375 | 400px wide; last item ends at y=291 of 375; focus starts on "Home"; bottom bar hidden |
| Closing the drawer | Esc, Back, a backdrop tap and a touch swipe each close it, keeping the scroll position (1,500px) |
| Picking "Certificates" in the drawer | lands 68px from the top; URL `#certificates`; focus on the section heading |
| 1280px desktop | links and "Let's Talk" shown; CV, burger and bottom bar hidden |
| Console | no errors |

**Acceptance (Phase 2):**
- **375×667:** top bar shows logo + CV only. The bottom bar shows 5 tabs, and the current one lights up as you scroll. Tapping a tab lands the section title just below the top bar and updates the URL hash. The bar hides while typing in the contact form. The footer is fully visible above the bar.
- **667×375 and 768×1024:** the burger opens the drawer. Every link and "Let's Talk" are visible without scrolling at 667×375. The drawer closes with the X, the backdrop strip, Escape, a right swipe and the Android Back button. Focus goes into the drawer and returns to the burger afterwards. Picking a link scrolls to the right section with no jump back.
- **1024px and wider:** looks the same as before. The bar may be about 4px taller because the logo link is now 44px.

**Commit:** `feat(mobile): phone tab bar, compact top bar, accessible swipeable drawer`

---

## Phase 3: Hero (fit the first screen, landscape layout, cheaper animation)

### 3.1 `src/components/Hero.module.css`
Replace **both** media blocks (`max-width: 768px` and `max-width: 480px`) with the blocks below. The numbers were checked in the prototype (see §2).
```css
/* ---------- Phones, portrait: the city becomes a band under the text ---------- */
@media (max-width: 767px) and (orientation: portrait) {
  .hero {
    --band: clamp(220px, 34svh, 340px);          /* read by Skyline.module.css */
    align-items: flex-start;
    min-height: calc(100svh - var(--bottom-nav-h) - var(--safe-bottom));
  }
  .hero::before {
    background:
      linear-gradient(180deg, rgba(10, 2, 3, 0.4) 0%, rgba(10, 2, 3, 0.18) 45%, transparent 65%),
      radial-gradient(ellipse 140% 90% at 50% 40%, transparent 55%, rgba(8, 2, 3, 0.4) 100%);
  }
  .content {
    min-height: 0;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    padding-top: calc(5.25rem + var(--safe-top));
    padding-bottom: calc(var(--band) - 36px);     /* text may use the band's empty top 36px of sky */
  }
  .textBlock { display: flex; flex-direction: column; align-items: center; }
  .name { align-items: center; margin-bottom: 1.1rem; }
  .nameLast { letter-spacing: 0.16em; }
  .plaque { min-width: 0; width: min(100%, 34ch); justify-content: center; margin-bottom: 1rem; }
  .plaqueText { font-size: 0.75rem; }
  .tagline { text-align: center; font-size: 1rem; line-height: 1.6; margin-bottom: 1.4rem; }

  /* Primary action full width; the two secondary actions share a row */
  .actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
    width: 100%;
    max-width: 400px;
    margin-bottom: 1.25rem;
  }
  .actions > :first-child { grid-column: 1 / -1; }
  .actions :global(.btn-ghost) { padding-inline: 0.5rem; font-size: 0.95rem; letter-spacing: 0.1em; }

  .socials { justify-content: center; }
  .scrollDown { display: none; }
}

/* ---------- Landscape phones: text left, city behind, everything above the fold ---------- */
@media (orientation: landscape) and (max-height: 500px) {
  .content { padding-top: calc(4rem + var(--safe-top)); padding-bottom: 1rem; }
  .nameFirst { font-size: min(var(--fs-hero), 21svh); }
  .nameLast { font-size: min(clamp(1.55rem, 3.7vw, 3.4rem), 8svh); margin-top: 0.3rem; }
  .name { margin-bottom: 0.8rem; }
  .plaque { margin-bottom: 0.8rem; min-height: 2.2rem; padding-block: 0.35rem; }
  .tagline { display: none; }          /* the About section says the same; the buttons matter more here */
  .actions { gap: 0.6rem; margin-bottom: 0.9rem; }
  .actions :global(.btn) { min-height: var(--tap); padding: 0.6rem 1rem; font-size: 0.95rem; }
  .scrollDown { display: none; }
}
```
Also:
- `.socialLink`: change to **`width: 44px; height: 44px;`** everywhere.
- Move `.socialLink:hover` and `.scrollDown:hover .scrollText` into the `(hover: hover) and (pointer: fine)` guard.
- Add the off-screen pause:
  ```css
  /* Searchlights, blinking lights and the cursor stop once the hero is off screen */
  .hero[data-offscreen] *,
  .hero[data-offscreen] *::before,
  .hero[data-offscreen] *::after { animation-play-state: paused !important; }
  ```

### 3.2 `src/components/Skyline.module.css`
Change `@media (max-width: 768px)` to **`@media (max-width: 767px) and (orientation: portrait)`**. Use the variable for the band height:
```css
  .scene { top: auto; height: var(--band, clamp(220px, 34svh, 340px)); }
```
Landscape phones now fall through to the desktop layout: full-bleed city and text on the left. That's intended.

### 3.3 `src/components/Hero.js`
1. Replace the local `scrollTo` with `scrollToSection` from `src/lib/mobile.js`.
2. In the parallax `update()`, return early if `document.body.dataset.overlay` is set.
3. Add the off-screen observer:
   ```js
   useEffect(() => {
     const hero = heroRef.current;
     if (!hero) return;
     const io = new IntersectionObserver(([entry]) => hero.toggleAttribute("data-offscreen", !entry.isIntersecting));
     io.observe(hero);
     return () => io.disconnect();
   }, []);
   ```
4. Move the typed role into a new **`src/components/TypedRole.js`** client component, so only that small span re-renders every 35–70ms instead of the whole Hero. Hero renders `<TypedRole />` inside `.plaqueText`, and the cursor span moves with it. Under `prefers-reduced-motion: reduce`, TypedRole shows `TYPED_STRINGS[0]` statically with no typing. Read the preference once with `window.matchMedia`, or use `useMediaQuery`.
5. Rewrite `useTypingEffect` in `src/lib/animations.js` so it has **one** timer per step and no leaked nested `setTimeout`:
   ```js
   export function useTypingEffect(strings, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
     const [s, setS] = useState({ index: 0, chars: 0, deleting: false });
     useEffect(() => {
       const full = strings[s.index];
       const atEnd = !s.deleting && s.chars === full.length;
       const delay = atEnd ? pauseTime : s.deleting ? deletingSpeed : typingSpeed;
       const t = setTimeout(() => {
         setS((p) => {
           const str = strings[p.index];
           if (!p.deleting && p.chars === str.length) return { ...p, deleting: true };
           if (p.deleting && p.chars === 0) return { index: (p.index + 1) % strings.length, chars: 0, deleting: false };
           return { ...p, chars: p.chars + (p.deleting ? -1 : 1) };
         });
       }, delay);
       return () => clearTimeout(t);
     }, [s, strings, typingSpeed, deletingSpeed, pauseTime]);
     return strings[s.index].slice(0, s.chars);
   }
   ```

**Acceptance (Phase 3):**
- **375×667:** name, plaque, tagline, "View My Work" (full width), "Get In Touch" and "Download CV" side by side, and the social icons are all above the fold. The skyline starts at y ≤ 600.
- **320×568:** all 3 buttons are above the fold.
- **667×375 and 844×390:** text sits on the left over the city, and all 3 buttons end at y ≤ the screen height.
- React DevTools Profiler: Hero no longer re-renders while the role types.
- After scrolling to Projects, the searchlights are paused (DevTools → Animations panel).

**Commit:** `feat(mobile): hero fits the first screen; landscape layout; lighter typing effect`

---

## Phase 4: About (fix clipped text)

`src/components/About.module.css`:
```css
.grid > * { min-width: 0; }          /* THE FIX: grid items may shrink below their content */
.fileHead { font-size: 0.75rem; flex-wrap: wrap; }
.fact dt { font-size: 0.75rem; }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; gap: var(--space-2xl); }
  .text { text-align: start; }        /* was center: long centred paragraphs read badly */
}
@media (max-width: 767px) {
  .intro { font-size: 1.2rem; }
  .visual { padding: 1.5rem 0.25rem 0.5rem; }
  .file { padding: 1.5rem 1.25rem 1.6rem; }
}
```

**Acceptance (Phase 4):** at 320, 375 and 390, the right edge of `.text` is ≤ the screen width minus the gutter. The paper file and stamp are fully visible.

**Commit:** `fix(mobile): about text no longer clipped on narrow screens`

---

## Phase 5: Skills (two columns, tap to light a tile)

### 5.1 `src/components/Skills.js`
- Add `const [openId, setOpenId] = useState(null);`. Changing the filter also resets it: `setOpenId(null)`.
- Each tile gets `data-open={openId === skill.id || undefined}` on `.card`. Add a full-tile toggle button as the **first child** of `.card`:
  ```jsx
  <button
    type="button"
    className={styles.toggle}
    aria-expanded={openId === skill.id}
    aria-controls={`skill-sign-${skill.id}`}
    aria-label={`${skill.name} details`}
    onClick={() => setOpenId((id) => (id === skill.id ? null : skill.id))}
  />
  ```
  Give the `.sign` div `id={`skill-sign-${skill.id}`}`.
  Keep the button separate from the heading; a `<button>` can't contain an `<h3>`.
- Under the filter bar, add a hint that only touch screens show: `<p className={styles.hint}>Tap a tile to light it up</p>`.

### 5.2 `src/components/Skills.module.css`
```css
.toggle {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.toggle:focus-visible { outline: 2px solid var(--clr-amber); outline-offset: -4px; }

/* Lit by tap or keyboard */
.card[data-open] {
  border-color: var(--tube);
  box-shadow: inset 0 0 0 5px var(--clr-ink-800), 0 0 12px var(--tube-glow), 0 0 34px var(--tube-spill);
}
.card[data-open] .sign { animation: switch-on 0.45s linear both; }

.hint { display: none; }
@media (hover: none) {
  .hint {
    display: block;
    margin: -1.25rem 0 1.25rem;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--clr-text-muted);
  }
  .card:active { border-color: var(--clr-brass-line); }
}
```
- Move `.card:hover` and `.card:hover .sign` into `@media (hover: hover) and (pointer: fine)`.
- Change `.cardCategory` to `font-size: 0.7rem` on desktop, then hide it on phones (below).
- Replace the `max-width: 640px` and `max-width: 380px` blocks with:
  ```css
  @media (max-width: 767px) {
    .grid { grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 0.75rem; }  /* 2 columns from 320px */
    .cardInner { min-height: 156px; gap: 0.8rem; padding: 1.25rem 0.75rem 1.1rem; }
    .ring { width: 52px; height: 52px; font-size: 1.3rem; }
    .cardTitle { font-size: 1rem; }
    .sign { padding: 0.7rem 0.6rem; gap: 0.35rem; }
    .signName { font-size: 1.05rem; }
    .cardDesc { font-size: 0.8rem; line-height: 1.4; }
    .cardCategory { display: none; }          /* the tile colour and the chips already say it */
  }
  @media (max-width: 359px) {
    .cardInner { min-height: 172px; }         /* longest description (69 chars) needs it at 320px */
  }
  ```

**Content rule** (add to DESIGN.md): keep skill descriptions **≤ 70 characters**. That's what the phone tiles were sized for.

**Acceptance (Phase 5):**
- 2 columns at 320, 375 and 412. The section is ≤ 1,750px tall at 375.
- A tap lights a tile with the flicker. Tapping it again turns it off, and tapping another tile switches.
- Enter or Space works from the keyboard.
- At 320, 360 and 375 no description is clipped: for every `.sign`, `scrollHeight <= clientHeight`.
- Desktop hover behaves as before.

**Commit:** `feat(mobile): two-column skills; tap-to-light tiles for touch and keyboard`

---

## Phase 6: Projects

`src/components/Projects.module.css`:
```css
.grid { grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); }   /* never wider than the screen */
.cardLinks { gap: 0.5rem; }
.cardLinkIcon { width: var(--tap); height: var(--tap); }
.category { font-size: 0.75rem; }
.ghBadge { font-size: 0.75rem; }

@media (max-width: 767px) {
  .grid { gap: 1rem; }
  .cardHeader { min-height: 48px; padding: 0.6rem 1.1rem 0; }
  .cardBody { padding: 0.5rem 1.1rem 0; }
  .cardTitle { font-size: 1.6rem; }
  .cardFooter { margin: 1.1rem 1.1rem 0; padding: 0.9rem 0 1.1rem; }
}
@media (hover: none) { .card:active { border-color: rgba(255, 74, 69, 0.45); } }
```
- Delete the old `max-width: 640px` block.
- Move `.card:hover`, `.card:hover::before`, `.card:hover .cardTitle` and `.cardLinkIcon:hover` into the hover guard.

`Projects.js`: add the chip `scrollIntoView` call from 1.7. Nothing else.

**Acceptance (Phase 6):** no project card wider than the screen at 320px. The icon links are 44×44 with 8px between them.

**Commit:** `style(mobile): tighter project cards and 44px link targets`

---

## Phase 7: Certificates (compact cards, swipeable lightbox)

### 7.1 Cards on phones: `Certificates.module.css`
First, edit these **existing** rules in place. Don't append them after the media block, or they would override it.
- `.viewBtn`: `min-height: 36px` becomes `min-height: var(--tap)`
- `.cardCategory`: `font-size: 0.64rem` becomes `0.7rem`
- `.cardDate`: `font-size: 0.72rem` becomes `0.75rem`
- `.educationHeading` uses `--fs-label`, which is already 0.75rem after Phase 1.

Then add this block at the end of the file:
```css
@media (max-width: 767px) {
  .education { padding: 1.25rem 1.1rem; margin-bottom: 2rem; }
  .educationDegree { font-size: 1.35rem; }
  .cvRow { margin-bottom: 2rem; }

  .grid { grid-template-columns: 1fr; gap: 0.75rem; }
  .card { position: relative; display: grid; grid-template-columns: 112px minmax(0, 1fr); }
  .cardImage { aspect-ratio: auto; height: 100%; min-height: 112px; border-bottom: 0; border-inline-end: 1px solid var(--clr-brass-faint); }
  .cardImage::after { inset: 6px; box-shadow: none; }
  .cardImageOverlay { display: none; }
  .cardBody { padding: 0.85rem 0.9rem; }
  .cardMeta { margin-bottom: 0.4rem; }
  .cardCategory { display: none; }     /* shown in the chips and in the lightbox */
  .cardTitle { font-size: 1.15rem; }
  .cardIssuer { margin-bottom: 0; }
  .cardDesc { display: none; }         /* moved into the lightbox */

  /* The View button stretches over the whole card: one big tap target, one tab stop */
  .viewBtn {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: auto;
    min-height: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: transparent;
    font-size: 0;
  }
  .viewBtn svg { display: none; }
  .viewBtn:focus-visible { outline: 2px solid var(--clr-amber); outline-offset: -3px; }
}
@media (hover: none) { .card:active { border-color: rgba(255, 74, 69, 0.45); } }
```
- Move `.card:hover`, `.card:hover .cardImageInner`, `.cardImage:hover .cardImageOverlay`, `.viewBtn:hover` and `.lightboxClose:hover` into the hover guard.
- Keep `.cardImage:focus-visible .cardImageOverlay` for now; it goes away with the JS change below.

### 7.2 Cards: `Certificates.js`
- On `.cardImage`, **remove** `role="button"`, `tabIndex={0}` and `onKeyDown`. Keep `onClick` (mouse convenience). The View button is now the single accessible control for each card.
- Change the `<Image sizes>` to `"(max-width: 767px) 112px, (max-width: 1024px) 50vw, 33vw"`. Phones then download about 112px thumbnails instead of full-width images.
- Filter chips: add the `scrollIntoView` call from 1.7.

### 7.3 Lightbox: `Certificates.js` and `Certificates.module.css`
Rebuild it around an **index into `filtered`** so it can step through certificates.
- **State:** replace `lightboxImage` / `lightboxTitle` with `const [activeIndex, setActiveIndex] = useState(-1)`. `open = activeIndex >= 0` and `current = filtered[activeIndex]`.
  - `showNext` = `(i + 1) % filtered.length`
  - `showPrev` = `(i - 1 + filtered.length) % filtered.length`
  - Remember the direction (+1 / −1) for the slide animation.
- **Hooks, in this order:**
  - `const release = useBackToClose(open, () => setActiveIndex(-1));`
  - `useScrollLock(open);`
  - `useFocusTrap(dialogRef, open, closeLightbox);`
  - `closeLightbox = () => { release(); setActiveIndex(-1); }`

  Delete the old manual `document.body.style.overflow` and keydown handling. Add an effect for `ArrowLeft` / `ArrowRight` while open.
- **Markup** (keep the portal to `document.body`):
  ```jsx
  <div className={styles.lightbox} role="dialog" aria-modal="true" aria-labelledby="lightbox-title"
       ref={dialogRef} onClick={closeLightbox}>
    <div className={styles.lightboxBar} onClick={stop}>
      <span className={styles.counter} aria-live="polite">{activeIndex + 1} / {filtered.length}</span>
      <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close certificate">{/* X icon */}</button>
    </div>

    <figure className={styles.lightboxContent} onClick={stop}>
      {/* Only the image is draggable, so the caption below can still scroll */}
      <motion.img
        key={current.id}
        src={current.image}
        alt={`${current.title}, issued by ${current.issuer}`}
        className={styles.lightboxImg}
        draggable={false}
        drag
        dragDirectionLock
        dragSnapToOrigin
        dragElastic={0.5}
        onDragEnd={(_, { offset, velocity }) => {
          if (Math.abs(offset.x) > Math.abs(offset.y)) {
            if (offset.x < -60 || velocity.x < -500) showNext();
            else if (offset.x > 60 || velocity.x > 500) showPrev();
          } else if (offset.y > 100 || velocity.y > 600) {
            closeLightbox();                                   // swipe down to close
          }
        }}
        initial={{ opacity: 0, x: direction * 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
      <figcaption className={styles.lightboxCaption}>
        <h3 id="lightbox-title" className={styles.lightboxTitle}>{current.title}</h3>
        <p className={styles.lightboxMeta}>{current.issuer}{current.date ? ` · ${current.date}` : ""}</p>
        <p className={styles.lightboxDesc}>{current.description}</p>
        <a href={current.image} target="_blank" rel="noopener noreferrer" className={styles.fullSize}>
          Open full size {/* external-link icon, aria-hidden */}
        </a>
      </figcaption>
    </figure>

    <div className={styles.lightboxNav} onClick={stop}>
      <button type="button" onClick={showPrev} aria-label="Previous certificate" disabled={filtered.length < 2}>{/* chevron-left */} Prev</button>
      <button type="button" onClick={showNext} aria-label="Next certificate" disabled={filtered.length < 2}>Next {/* chevron-right */}</button>
    </div>
  </div>
  ```
  `stop = (e) => e.stopPropagation()`. Wrap the lightbox in `<MotionConfig reducedMotion="user">`. When it opens, preload the neighbouring images with `new window.Image().src = …`.
- **CSS:** change the existing `.lightbox` rule to stack its children: add `flex-direction: column; gap: var(--space-md);`. In the existing `.lightboxImg` rule, `max-height: 75vh` becomes `62vh`, which leaves room for the caption and buttons on desktop. **Replace** the existing `.lightboxCaption` rule; its uppercase display-font styling moves to `.lightboxTitle`. Then append:
  ```css
  .lightboxBar { position: absolute; top: calc(var(--space-xl) + var(--safe-top)); inset-inline: var(--space-xl); display: flex; justify-content: space-between; align-items: center; z-index: 2; }
  .lightboxClose { position: static; }          /* now lives in the bar */
  .counter { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.14em; color: var(--clr-brass); }
  .lightboxImg { touch-action: none; user-select: none; cursor: grab; }
  .lightboxCaption { text-align: center; max-width: 640px; }
  .lightboxTitle { font-size: 1.35rem; letter-spacing: 0.08em; color: var(--clr-cream); }
  .lightboxMeta { margin-top: 0.25rem; font-size: var(--fs-small); color: var(--clr-amber); }
  .lightboxDesc { margin-top: 0.5rem; font-size: var(--fs-small); line-height: 1.6; color: var(--clr-text-secondary); }
  .fullSize { display: inline-flex; align-items: center; gap: 0.4rem; min-height: var(--tap); margin-top: 0.25rem; text-decoration: underline; text-underline-offset: 3px; }
  .lightboxNav { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; width: min(100%, 420px); }
  .lightboxNav button { min-height: 48px; /* reuse the .viewBtn look: cream outline plaque */ }

  @media (max-width: 767px) {
    .lightbox {
      flex-direction: column;
      justify-content: flex-start;
      gap: 0.75rem;
      padding: calc(0.75rem + var(--safe-top)) 0.75rem calc(0.75rem + var(--safe-bottom));
    }
    .lightboxBar { position: static; width: 100%; }
    .lightboxContent { width: 100%; max-height: none; flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; gap: 1rem; }
    .lightboxImg { width: 100%; max-height: 52dvh; outline-offset: 4px; }
    .lightboxNav { width: 100%; }
  }
  @media (orientation: landscape) and (max-height: 500px) {
    .lightboxContent { flex-direction: row; align-items: center; max-height: calc(100dvh - 6rem); }
    .lightboxImg { max-width: 60vw; max-height: calc(100dvh - 7rem); }
    .lightboxCaption { text-align: start; max-height: calc(100dvh - 7rem); overflow-y: auto; }
  }
  ```

**Acceptance (Phase 7):**
- **375×667:** each card is about 130px tall with the thumbnail on the left. The section is ≤ 2,500px. Tapping anywhere on a card opens the lightbox.
- **Lightbox:**
  - the image is at least 350px wide at 375
  - swipe left or right moves between certificates and the counter updates
  - swipe down closes
  - Android Back, Escape, the X and a backdrop tap all close it
  - focus returns to the card
  - "Open full size" opens the JPG, where the phone's own pinch zoom works
  - the bottom bar is hidden while it's open.
- **Desktop:** the 3-column grid is unchanged. The lightbox gains the counter and Prev/Next, and the arrow keys work.

**Commit:** `feat(mobile): compact certificate cards; swipeable, back-button-aware lightbox`

---

## Phase 8: Contact (tap-to-contact first, better form on phones)

### 8.1 `Contact.js`: the info cards become links
- Make each actionable card the link itself:
  - Email → `mailto:`
  - Egypt and Saudi Arabia → `tel:`
  - Resume → `download`

  The card wraps the icon and the text:
  ```jsx
  <a href="tel:+201023860655" className={styles.infoCard}>
    <span className={styles.infoIcon} aria-hidden="true">{/* phone icon */}</span>
    <span>
      <span className={styles.infoTitle}>Egypt</span>
      <span className={styles.infoValue}>+20 102 386 0655</span>
    </span>
  </a>
  ```
- Change the `h3` labels inside the cards to `span`s. They're labels, not headings.
- "Based in" stays a non-link `div`. Give the Email card an extra class `styles.infoWide`.
- In the error message, make the email address a `mailto:` link.

### 8.2 `Contact.js`: form on phones
- `<form noValidate …>`, and add these attributes:

  | Field | Attributes |
  |---|---|
  | name | `autoComplete="name" autoCapitalize="words" enterKeyHint="next"` |
  | email | `autoComplete="email" inputMode="email" autoCapitalize="off" spellCheck={false} enterKeyHint="next"` |
  | subject | `autoCapitalize="sentences" enterKeyHint="next"` |
  | message | `rows={5} autoCapitalize="sentences"` |

- Inline validation (ui-ux-pro-max `inline-validation`, `error-placement`, `focus-management`). Check on **blur** and on **submit**:
  ```js
  const RULES = {
    name:    (v) => v.trim().length >= 2 || "Please enter your name.",
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter an email like name@example.com.",
    subject: (v) => v.trim().length > 0 || "Add a short subject.",
    message: (v) => v.trim().length >= 10 || "Write at least a sentence (10+ characters).",
  };
  ```
  - On each field: `aria-invalid={!!errors.x}` and `aria-describedby={errors.x ? "contact-x-error" : undefined}`.
  - Under the field: `{errors.x && <p id="contact-x-error" className="field-error">{errors.x}</p>}`.
  - On submit with errors: set them all, focus the first invalid field (`document.getElementById("contact-" + key).focus()`) and don't send.
  - Clear a field's error as soon as its value becomes valid in `handleChange`.
- After success or error, `statusRef.current?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() })`. That way the message is seen once the keyboard closes.
- Submit button: add `aria-busy={sending}`.

### 8.3 `Contact.module.css`
- Replace the `a.infoValue` rules:
  ```css
  a.infoCard { color: inherit; text-decoration: none; min-height: var(--tap); }
  a.infoCard .infoValue { text-decoration: underline; text-decoration-color: var(--clr-brass-line); text-underline-offset: 4px; }
  ```
  Under the hover guard: `a.infoCard:hover { border-color: var(--clr-brass-line); } a.infoCard:hover .infoValue { color: var(--clr-amber); }`.
- Remove the `translateX(6px)` hover lift on touch. The whole `.infoCard:hover` rule moves into the guard.
- `.infoTitle { display: block; font-size: 0.75rem; text-transform: uppercase; line-height: 1.05; }`. It was 0.66rem. As an `h3` it got uppercase from the global heading styles, so a `span` needs it set explicitly.
- `.infoValue { display: block; }`
- Add:
  ```css
  @media (max-width: 767px) {
    .grid { gap: var(--space-xl); }
    .info { order: -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }   /* quick actions before the form */
    .infoWide, .socials { grid-column: 1 / -1; }
    .infoCard:not(.infoWide) { flex-direction: column; align-items: flex-start; gap: 0.6rem; padding: 0.85rem; }
    .infoIcon { width: 40px; height: 40px; }
    .socials { justify-content: center; margin-top: 0.25rem; }
  }
  @media (hover: none) { a.infoCard:active, .socialLink:active { border-color: var(--clr-amber); } }
  ```
- Move `.socialLink:hover` into the hover guard.

**Acceptance (Phase 8):**
- **375×667:** right after the "Get In Touch" header you see Email (full width), then Egypt | KSA, then Based in | Resume, then the social row, then the form. Tapping a phone card opens the dialer, and the email card opens the mail app.
- The email field brings up the email keyboard. The name and email fields autofill.
- An invalid submit shows red text under the fields and focuses the first one.
- The bottom bar is hidden while typing.

**Commit:** `feat(mobile): tap-to-contact cards first; inline validation and mobile keyboards`

---

## Phase 9: Footer, legal pages, 404

- **`Footer.module.css`:**
  - `.socialLink` → 44×44
  - `.topBtn` → 44×44
  - `.legalLink { display: inline-flex; align-items: center; min-height: var(--tap); }`
  - `.copy { font-size: 0.75rem; }`
  - `.footer { padding-bottom: calc(var(--space-xl) + var(--safe-bottom)); }`
  - Move all `:hover` rules into the guard.
- **`Footer.js`:** the back-to-top button calls `scrollToSection("home")`.
- **`legal.module.css`:**
  - `.page { min-height: 100svh; }` (keep `100vh` first as the fallback)
  - `.back { min-height: var(--tap); }`
  - `.body ul { margin: 0 0 var(--space-md); margin-inline-start: var(--space-lg); }`
- **`status.module.css`:** `.page { min-height: 100svh; }` (keep the fallback)
- **Check:** `/privacy`, `/terms` and a 404 page at 375×667. No sideways scroll, and the title fits.

**Commit:** `style(mobile): footer, legal and status pages touch sizes and safe areas`

---

## Phase 10: Admin (owner only, lower priority, optional)

Only do this after asking the user, because `admin.module.css` has uncommitted edits.
- In `src/app/admin/admin.module.css` and `src/app/admin/messages/messages.module.css`, add `min-height: 100dvh` after each `min-height: 100vh`.
- At ≤767px:
  - the sidebar links (the horizontal row that already exists) get `min-height: 44px` and `scrollbar-width: none`
  - message action buttons get `min-height: 44px` and wrap with an 8px gap.
- **Acceptance:** `/admin/messages` at 375×667 has no sideways scroll and every button is ≥ 44px.

**Commit:** `style(admin): usable on a phone`

---

## Phase 11: Docs and final QA

1. **`Desgin folder/DESIGN.md`:** add a **"Phones"** section covering:
   - the regimes table (§3)
   - the bottom tab bar (marquee rail, neon tube on the current tab)
   - tap-to-light skill tiles (descriptions ≤ 70 chars)
   - compact certificate cards and lightbox gestures
   - the 44px tap rule and 12px label floor
   - "hover effects live only inside `(hover: hover) and (pointer: fine)`".
2. Run `node scripts/mobile-audit.mjs` and save the output to `plans/mobile-audit-after.txt`. It must print **"All mobile checks passed."**
3. Re-run Lighthouse mobile and add the scores to the same file.
4. Go through the manual checklist in **Appendix D** on a real phone (or the Vercel preview).

**Commit:** `docs: phones section in DESIGN.md; mobile audit results`

---

## Appendix A: `src/lib/mobile.js` (complete file)

```js
"use client";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { scrollBehavior } from "@/lib/animations";

/** True while a media query matches (false during server render). */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Locks page scroll without the iOS jump-to-top: the body is pinned in place
 * and the position restored on release. Sets body[data-overlay] while locked,
 * which the bottom tab bar reads to slide away. Counts nested locks.
 */
let locks = 0;
let savedY = 0;
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement: html } = document;
    if (locks++ === 0) {
      savedY = window.scrollY;
      Object.assign(body.style, { position: "fixed", top: `-${savedY}px`, left: "0", right: "0" });
      body.dataset.overlay = "open";
    }
    return () => {
      if (--locks > 0) return;
      Object.assign(body.style, { position: "", top: "", left: "", right: "" });
      delete body.dataset.overlay;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto"; // jump back instantly, not with the smooth scroll
      window.scrollTo(0, savedY);
      html.style.scrollBehavior = previous;
    };
  }, [active]);
}

/**
 * Lets the phone's Back button or gesture close an overlay instead of leaving the site.
 * Returns release(keepEntry): call it when the UI closes the overlay itself.
 *   release()     -> removes the extra history entry (X, Esc, swipe, backdrop)
 *   release(true) -> keeps it (closing because a section link was chosen;
 *                    scrollToSection then rewrites that entry to #section)
 * Use it BEFORE useScrollLock in a component, so the entry is pushed while the
 * page still has its real scroll position.
 */
export function useBackToClose(open, onClose) {
  const onCloseRef = useRef(onClose);
  const pushedRef = useRef(false);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const { history } = window;
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual"; // the scroll lock restores the position itself
    history.pushState({ overlay: true }, "");
    pushedRef.current = true;
    const onPop = () => {
      if (!pushedRef.current) return; // our own history.back() from release()
      pushedRef.current = false;
      onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      history.scrollRestoration = restoration;
    };
  }, [open]);

  return useCallback((keepEntry = false) => {
    if (!pushedRef.current) return;
    pushedRef.current = false;
    if (!keepEntry) window.history.back();
  }, []);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Moves focus into `ref` while active, keeps Tab inside it, Esc calls onEscape, and returns focus on close. */
export function useFocusTrap(ref, active, onEscape) {
  const escRef = useRef(onEscape);
  useEffect(() => { escRef.current = onEscape; });

  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;
    const returnTo = document.activeElement;
    const items = () => [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
    const raf = requestAnimationFrame(() => items()[0]?.focus({ preventScroll: true }));

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); escRef.current?.(); return; }
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      if (returnTo instanceof HTMLElement && document.contains(returnTo)) returnTo.focus({ preventScroll: true });
    };
  }, [active, ref]);
}

/**
 * Scrolls to a section (CSS scroll-margin-top clears the fixed bar), puts the
 * section in the URL for sharing, and can move focus to its heading for
 * keyboard and screen-reader users.
 */
export function scrollToSection(id, { focusHeading = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  const url = id === "home" ? window.location.pathname : `#${id}`;
  window.history.replaceState(window.history.state, "", url);
  if (focusHeading) {
    const heading = el.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }
}
```

---

## Appendix B: `scripts/mobile-audit.mjs`

This is the script used to measure §1 and §2. It checks seven phone, landscape and tablet sizes:
- content past the screen edge
- tap targets under 44px (links inside paragraphs are exempt)
- text under 12px
- whether the hero buttons fit in the first screen.

It exits with code 1 if anything fails.

```js
// Mobile audit for the portfolio. Run the dev server first (npm run dev),
// then: node scripts/mobile-audit.mjs [baseUrl]
// Needs: npm i -D playwright  &&  npx playwright install chromium
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000/";
const VIEWPORTS = [
  { name: "320x568 small phone", width: 320, height: 568 },
  { name: "375x667 iPhone SE", width: 375, height: 667 },
  { name: "390x844 iPhone 14", width: 390, height: 844 },
  { name: "412x915 Pixel 7", width: 412, height: 915 },
  { name: "667x375 SE landscape", width: 667, height: 375 },
  { name: "844x390 landscape", width: 844, height: 390 },
  { name: "768x1024 tablet", width: 768, height: 1024 },
];

let failures = 0;
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce", // reveals everything at once, so it can be measured
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const shown = (el) => {
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.05;
    };
    const name = (el) =>
      `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32)}"`;

    // 1. Anything running past the right edge (clipped or not)
    const overflow = [];
    for (const sec of document.querySelectorAll("main > section, footer")) {
      for (const el of sec.querySelectorAll("p, h1, h2, h3, a, button, img, form, li, dd")) {
        const b = el.getBoundingClientRect();
        if (b.width && shown(el) && (b.right > vw + 1 || b.left < -1)) overflow.push(`${sec.id || "footer"}: ${name(el)} right=${Math.round(b.right)}`);
      }
    }
    // 2. Tap targets under 44x44 (links inside running text are exempt)
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, [role="button"], [role="tab"], input, select, textarea')) {
      if (!shown(el) || el.closest("p")) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 44 || b.height < 44) small.push(`${name(el)} ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    // 3. Text under 12px
    const tiny = new Set();
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const el = walk.currentNode.parentElement;
      if (!walk.currentNode.textContent.trim() || !shown(el) || el.closest(".sr-only")) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) tiny.add(`"${walk.currentNode.textContent.trim().slice(0, 24)}" ${fs.toFixed(1)}px`);
    }
    // 4. Hero calls to action inside the first screen
    const ctas = [...document.querySelectorAll("#home .btn")].map((b) => ({
      label: b.textContent.trim(),
      bottom: Math.round(b.getBoundingClientRect().bottom),
    }));
    const sections = Object.fromEntries(
      [...document.querySelectorAll("main > section")].map((s) => [s.id, Math.round(s.getBoundingClientRect().height)])
    );
    return {
      vw, vh,
      hScroll: document.documentElement.scrollWidth > vw,
      pageHeight: document.documentElement.scrollHeight,
      sections, overflow, small, tiny: [...tiny], ctas,
    };
  });

  const ctasBelowFold = r.ctas.filter((c) => c.bottom > r.vh);
  const problems = [
    r.hScroll && "page scrolls sideways",
    r.overflow.length && `${r.overflow.length} element(s) run past the screen edge`,
    r.small.length && `${r.small.length} tap target(s) under 44px`,
    r.tiny.length && `${r.tiny.length} piece(s) of text under 12px`,
    ctasBelowFold.length && `hero buttons below the first screen: ${ctasBelowFold.map((c) => c.label).join(", ")}`,
  ].filter(Boolean);

  console.log(`\n== ${vp.name}  page ${r.pageHeight}px (${(r.pageHeight / r.vh).toFixed(1)} screens)`);
  console.log("   sections:", JSON.stringify(r.sections));
  if (!problems.length) console.log("   OK");
  for (const p of problems) console.log("   FAIL:", p);
  for (const line of [...r.overflow, ...r.small, ...r.tiny].slice(0, 12)) console.log("     -", line);
  failures += problems.length;
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} problem(s) found.` : "\nAll mobile checks passed.");
process.exit(failures ? 1 : 0);
```

Notes:
- The Next.js dev "N" indicator lives in a shadow root, so the script ignores it.
- The CV button in the top bar, the bottom tabs and the stretched certificate buttons are all ≥ 44px by design.
- Run it at the end of every phase. A phase may leave failures that a later phase owns, but nothing it already fixed may come back.

---

## Appendix C: ui-ux-pro-max rules → where they're applied

| Priority | Rule | Applied in |
|---|---|---|
| 1 Accessibility | `color-contrast` (4.5:1) | New UI only uses the measured pairs in DESIGN.md: secondary text 9.9:1, muted text 5.5:1, neon 6.0:1, neon-core 16.8:1. |
| 1 | `focus-states`, `keyboard-nav`, `escape-routes` | Amber focus ring on the new toggles, tabs and lightbox. `useFocusTrap` with Esc in the drawer and lightbox. |
| 1 | `aria-labels`, `voiceover-sr` | Burger label changes with state. Tab bar uses `aria-current="location"`. Skill tiles use `aria-expanded`. Lightbox uses `aria-labelledby` and a live counter. |
| 1 | `reduced-motion` | Typing goes static; existing global reduced-motion rules; `MotionConfig reducedMotion="user"` on new motion. |
| 2 Touch | `touch-target-size`, `touch-spacing` | 44px everywhere (§1.6, 2.2, 3.1, 6, 7, 8, 9). 8px minimum gaps. |
| 2 | `hover-vs-tap` | Skill tiles become buttons (Phase 5). Every hover rule is guarded. |
| 2 | `tap-delay`, `press-feedback` | `touch-action: manipulation`; `:active` states under `(hover: none)`. |
| 2 | `safe-area-awareness`, `system-gestures` | `viewport-fit=cover` + `--safe-*` on the bars, drawer, lightbox and gutters. Android Back closes overlays (`useBackToClose`). |
| 2 | `swipe-clarity`, `gesture-alternative` | Every swipe (drawer, lightbox) also has a visible button. The chip-row fade hints at scrolling. A "Tap a tile" hint shows on touch screens. |
| 3 Performance | `image-optimization` | Certificate thumbnails use `sizes` of 112px on phones. |
| 3 | `main-thread-budget`, `reduce-reflows` | Isolated typing effect, hoisted observer IDs, off-screen hero animations paused. |
| 5 Layout | `viewport-meta`, `horizontal-scroll`, `mobile-first` | Viewport export; About `min-width: 0`; `minmax(min(100%, 320px), 1fr)`; audit script. |
| 5 | `viewport-units`, `orientation-support` | `svh`/`dvh` units; short-landscape regime for the hero and drawer. |
| 5 | `content-priority`, `fixed-element-offset` | Compact certificates and skills; contact actions first; body padding under the tab bar; `scroll-margin-top`. |
| 6 Type | `readable-font-size` | 12px label floor; 16px inputs (already true); `text-size-adjust`. |
| 6 | `line-length-control` | About text left-aligned on phones. |
| 7 Motion | `duration-timing`, `exit-faster-than-enter`, `stagger-sequence` | Shorter reveals on phones, a capped stagger, a 0.22s drawer exit. |
| 8 Forms | `input-type-keyboard`, `autofill-support`, `inline-validation`, `error-placement`, `focus-management`, `aria-live-errors` | Phase 8. |
| 9 Navigation | `bottom-nav-limit`, `nav-label-icon`, `nav-state-active`, `avoid-mixed-patterns`, `adaptive-navigation`, `deep-linking`, `back-behavior` | Phase 2. |

**Optional:** if the ui-ux-pro-max skill **with its scripts** is installed in your Claude Code (the file `skills/ui-ux-pro-max/scripts/search.py` exists), run these before the matching phase and fold in anything they add:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "mobile bottom navigation touch safe area" --domain ux
python3 skills/ui-ux-pro-max/scripts/search.py "lightbox gallery swipe gesture" --domain ux
python3 skills/ui-ux-pro-max/scripts/search.py "form validation mobile keyboard" --domain ux
python3 skills/ui-ux-pro-max/scripts/search.py "animation accessibility z-index loading" --domain ux
```

---

## Appendix D: Manual test checklist (real phone or DevTools)

**Sizes:**
- portrait 320×568, 375×667, 390×844, 412×915
- landscape 667×375, 844×390, 915×412
- tablet 768×1024, 1024×768
- desktop 1280×800 and 1440×900, which should be unchanged.

**Everywhere:**
- [ ] No sideways scrolling and no cut-off text on any page (home, /privacy, /terms, a 404).
- [ ] Everything tappable is at least 44×44 with room between targets. Pressing gives instant visual feedback, and nothing stays "lifted" after a tap.
- [ ] No text smaller than 12px. Inputs are 16px, so iOS doesn't zoom on focus.
- [ ] Pinch zoom still works.

**Navigation:**
- [ ] Portrait phone: the bottom bar shows 5 tabs and the current tab lights up while scrolling. Tapping a tab lands the section title just under the top bar.
- [ ] The bottom bar hides while typing and under the lightbox. The footer is fully visible above it. It clears the iPhone home indicator.
- [ ] Landscape and tablet: the drawer opens and closes with the X, the backdrop, Esc, a right swipe and Android Back. All links are visible in landscape. A swipe never triggers a link by accident.

**Sections:**
- [ ] Hero: all 3 buttons and the top of the skyline are on the first screen (portrait), and all 3 buttons are on the first screen in landscape.
- [ ] Skills: tap to light a tile, tap again to switch it off. Text is never cut off at 320px. Desktop hover is unchanged.
- [ ] Certificates: compact cards; a tap anywhere opens the lightbox. Swipe left/right changes certificate, swipe down closes, Back closes, and "Open full size" works.
- [ ] Contact: phone and email cards open the dialer and mail app. The email keyboard shows for the email field and autofill works. Errors appear under fields, and the success message is visible.

**Accessibility settings:**
- [ ] Reduced motion (OS setting): no typing, flicker or parallax; menus and the lightbox still work.
- [ ] Text size at 200% (Android: Settings → Display → Font size; iOS Safari: aA → 200%): nothing overlaps; tab labels may shorten with "…".
- [ ] Screen reader quick pass (VoiceOver or TalkBack): the tab bar reads as "Sections, navigation" and announces the current tab; skill tiles read as "JavaScript details, button, collapsed"; the lightbox reads its title.

**Results:**
- [ ] Lighthouse mobile: Accessibility ≥ 95 and CLS < 0.1. Before and after scores are saved in `plans/`.


---

## Appendix E: tested reference files

These are the exact files used in the Phase 2 test (see the table in Phase 2). They were written against the repo as of this plan. If `Navbar.js` has changed since, merge rather than overwrite.

### `src/components/Navbar.js`
```jsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useActiveSection } from "@/lib/animations";
import { useBackToClose, useScrollLock, useFocusTrap, scrollToSection } from "@/lib/mobile";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import BottomNav from "./BottomNav";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const menuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 26, stiffness: 180, staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: { x: "100%", transition: { type: "tween", duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const linkVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.15 } },
};

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const drawerRef = useRef(null);
  const draggedRef = useRef(false);
  const pendingTarget = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.dataset.overlay) return;
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const releaseHistory = useBackToClose(mobileOpen, () => setMobileOpen(false));
  useScrollLock(mobileOpen);
  const closeMenu = useCallback(() => { releaseHistory(); setMobileOpen(false); }, [releaseHistory]);
  useFocusTrap(drawerRef, mobileOpen, closeMenu);

  const handleNav = useCallback((id) => {
    if (mobileOpen) {
      releaseHistory(true);
      pendingTarget.current = id;
      setMobileOpen(false);
    } else {
      scrollToSection(id);
    }
  }, [mobileOpen, releaseHistory]);

  useEffect(() => {
    if (mobileOpen || !pendingTarget.current) return;
    const id = pendingTarget.current;
    pendingTarget.current = null;
    scrollToSection(id, { focusHeading: true });
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const mql = window.matchMedia("(max-width: 767px) and (orientation: portrait), (min-width: 1024px)");
    const onChange = (e) => { if (e.matches) closeMenu(); };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mobileOpen, closeMenu]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
        id="navbar"
      >
        <div className={`container ${styles.navInner}`}>
          <a href="#home" className={styles.logo} onClick={(e) => { e.preventDefault(); handleNav("home"); }}>
            <Image src="/logo-owl.png" alt="" width={22} height={32} className={styles.logoMark} priority />
            <span className={styles.logoText}>Youssef Eslam</span>
          </a>

          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.id} style={{ position: "relative" }}>
                <a href={`#${link.id}`} className={`${styles.link} ${activeSection === link.id ? styles.active : ""}`}
                  onClick={(e) => { e.preventDefault(); handleNav(link.id); }}>
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span layoutId="activeNavIndicator" className={styles.activeBar} transition={{ type: "spring", stiffness: 350, damping: 28 }} />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <a href="#contact" className={`btn ${scrolled ? "btn-primary" : "btn-ghost"} ${styles.cta}`}
            onClick={(e) => { e.preventDefault(); handleNav("contact"); }}>
            Let&apos;s Talk
          </a>

          <a href="/resume/youssef_eslam_cv.pdf" download className={`btn btn-ghost ${styles.cvBtn}`} aria-label="Download CV">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>CV</span>
          </a>

          <button
            className={styles.burger}
            onClick={() => (mobileOpen ? closeMenu() : setMobileOpen(true))}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            id="mobile-menu-toggle"
          >
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.open : ""}`} />
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.open : ""}`} />
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.open : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.3 }} className={styles.backdrop} onClick={closeMenu} />
            <motion.div
              ref={drawerRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.mobileMenu}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.5 }}
              dragMomentum={false}
              onDragStart={() => { draggedRef.current = true; }}
              onDragEnd={(_, info) => {
                setTimeout(() => { draggedRef.current = false; }, 0);
                if (info.offset.x > 80 || info.velocity.x > 500) closeMenu();
              }}
            >
              <motion.ul className={styles.mobileLinks}>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.id} variants={linkVariants}>
                    <a href={`#${link.id}`} className={`${styles.mobileLink} ${activeSection === link.id ? styles.active : ""}`}
                      onClick={(e) => { e.preventDefault(); if (draggedRef.current) return; handleNav(link.id); }}>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={linkVariants} style={{ marginTop: "2rem" }}>
                <a href="#contact" className="btn btn-primary" style={{ width: "100%" }}
                  onClick={(e) => { e.preventDefault(); if (draggedRef.current) return; handleNav("contact"); }}>
                  Let&apos;s Talk
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav active={activeSection} onNavigate={handleNav} />
    </MotionConfig>
  );
}
```

### `src/components/BottomNav.js`
```jsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./BottomNav.module.css";

const TABS = [
  { id: "about", label: "About", icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  { id: "skills", label: "Skills", icon: <><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></> },
  { id: "projects", label: "Work", icon: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/> },
  { id: "certificates", label: "Certs", icon: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></> },
  { id: "contact", label: "Contact", icon: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></> },
];

export default function BottomNav({ active, onNavigate }) {
  // Slide away while the keyboard is up (a form field has focus)
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el) => el instanceof Element && el.matches("input, textarea, select");
    const onIn = (e) => { if (isField(e.target)) setTyping(true); };
    const onOut = (e) => { if (isField(e.target)) setTyping(false); };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <nav className={styles.bar} aria-label="Sections" data-hidden={typing || undefined}>
      <ul className={styles.list}>
        {TABS.map((tab) => {
          const current = active === tab.id;
          return (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                className={styles.item}
                aria-current={current ? "location" : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate(tab.id); }}
              >
                {current && (
                  <motion.span layoutId="bottomNavIndicator" className={styles.indicator}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }} />
                )}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{tab.icon}</svg>
                <span className={styles.label}>{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```
