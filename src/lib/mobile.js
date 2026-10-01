"use client";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { scrollBehavior, SECTION_NAVIGATE_EVENT } from "@/lib/animations";

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
 * keyboard and screen-reader users. The nav indicators move to the target
 * straight away rather than following the scroll.
 */
export function scrollToSection(id, { focusHeading = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  window.dispatchEvent(new CustomEvent(SECTION_NAVIGATE_EVENT, { detail: id }));
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
