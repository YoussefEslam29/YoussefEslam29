"use client";
import { useEffect, useRef, useCallback, useState } from "react";

/** "smooth" is ignored for visitors who asked for reduced motion. */
export function scrollBehavior() {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/**
 * Hook to observe elements and add a 'revealed' class when they enter the viewport.
 */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nothing to animate towards if the visitor asked for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}

/**
 * Hook to observe multiple child elements for stagger animation.
 */
export function useRevealGroup(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nothing to animate towards if the visitor asked for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold]);

  return ref;
}

/**
 * Typing effect hook — returns the current displayed text. One timer per
 * step (the pause included), cleared on every change, so nothing leaks.
 */
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

/**
 * Mouse parallax hook — returns x,y offset based on cursor position.
 */
export function useMouseParallax(intensity = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setOffset({
        x: (e.clientX - centerX) * intensity,
        y: (e.clientY - centerY) * intensity,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity]);

  return offset;
}

/** Fired by scrollToSection() so the scroll-spy can jump straight to the target. */
export const SECTION_NAVIGATE_EVENT = "section:navigate";

/**
 * Scroll-spy: returns the ID of the section crossing a line 40% down the
 * screen. Sections are stacked, so exactly one crosses it however tall it is,
 * and at the very bottom of the page the last section wins (it may be too
 * short to ever reach the line).
 *
 * When a link starts a smooth scroll (SECTION_NAVIGATE_EVENT), the target is
 * shown at once and held until the scroll settles, instead of trailing
 * through every section in between. Any wheel, touch or key input releases
 * the hold early. Pass a stable array (hoisted), or the listeners rebuild on
 * every render.
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let frame = 0;
    let pinned = false;
    let settle = 0;

    const measure = () => {
      frame = 0;
      // While an overlay locks the page, scroll positions are frozen at 0.
      if (pinned || document.body.dataset.overlay) return;
      const doc = document.documentElement;
      let current = "";
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1];
      } else {
        const line = window.innerHeight * 0.4;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const release = () => {
      clearTimeout(settle);
      if (!pinned) return;
      pinned = false;
      schedule();
    };
    const onScroll = () => {
      if (!pinned) return schedule();
      // Still travelling: release once no scroll event has come for a moment
      clearTimeout(settle);
      settle = setTimeout(release, 150);
    };
    const onNavigate = (e) => {
      pinned = true;
      setActiveId(e.detail);
      // If the page is already there no scroll event comes, so release anyway
      clearTimeout(settle);
      settle = setTimeout(release, 300);
    };

    const input = ["wheel", "touchstart", "keydown"];
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener(SECTION_NAVIGATE_EVENT, onNavigate);
    input.forEach((type) => window.addEventListener(type, release, { passive: true }));
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(SECTION_NAVIGATE_EVENT, onNavigate);
      input.forEach((type) => window.removeEventListener(type, release));
    };
  }, [sectionIds]);

  return activeId;
}
