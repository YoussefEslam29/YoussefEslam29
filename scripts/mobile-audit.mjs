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

    // 1. Anything running past the right edge (clipped or not). Items in a
    //    sideways-scrolling row (the filter chips) are meant to be swiped to.
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    const overflow = [];
    for (const sec of document.querySelectorAll("main > section, footer")) {
      for (const el of sec.querySelectorAll("p, h1, h2, h3, a, button, img, form, li, dd")) {
        const b = el.getBoundingClientRect();
        if (b.width && shown(el) && (b.right > vw + 1 || b.left < -1) && !inScroller(el)) overflow.push(`${sec.id || "footer"}: ${name(el)} right=${Math.round(b.right)}`);
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
    // 4. Hero calls to action inside the first screen, and not under the
    //    phone tab bar when it is showing
    const tabBar = document.querySelector('nav[aria-label="Sections"]');
    const fold = tabBar && shown(tabBar) ? Math.min(vh, tabBar.getBoundingClientRect().top) : vh;
    const ctas = [...document.querySelectorAll("#home .btn")].map((b) => ({
      label: b.textContent.trim(),
      bottom: Math.round(b.getBoundingClientRect().bottom),
    }));
    const sections = Object.fromEntries(
      [...document.querySelectorAll("main > section")].map((s) => [s.id, Math.round(s.getBoundingClientRect().height)])
    );
    return {
      vw, vh, fold,
      hScroll: document.documentElement.scrollWidth > vw,
      pageHeight: document.documentElement.scrollHeight,
      sections, overflow, small, tiny: [...tiny], ctas,
    };
  });

  const ctasBelowFold = r.ctas.filter((c) => c.bottom > r.fold);
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
