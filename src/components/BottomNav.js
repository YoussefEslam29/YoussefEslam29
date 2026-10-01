"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./BottomNav.module.css";

// Shared by the desktop underline and the tab bar's tube: quick to arrive,
// with no wobble at the end.
export const INDICATOR_SPRING = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 };

// Home is the logo in the top bar, so it has no tab.
const TABS = [
  {
    id: "about",
    label: "About",
    icon: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    icon: (
      <>
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
      </>
    ),
  },
  {
    id: "projects",
    label: "Work",
    icon: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  },
  {
    id: "certificates",
    label: "Certs",
    icon: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
];

/** The phone tab bar: a marquee rail along the bottom of the screen. */
export default function BottomNav({ active, onNavigate }) {
  // Slide away while the keyboard is up (a form field has focus)
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el) => el instanceof Element && el.matches("input, textarea, select");
    const onIn = (e) => {
      if (isField(e.target)) setTyping(true);
    };
    const onOut = (e) => {
      if (isField(e.target)) setTyping(false);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    // layoutRoot: fixed, like the top bar, so the tube is measured without the page scroll
    <motion.nav layoutRoot className={styles.bar} aria-label="Sections" data-hidden={typing || undefined}>
      <ul className={styles.list}>
        {TABS.map((tab) => {
          const current = active === tab.id;
          return (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                className={styles.item}
                aria-current={current ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(tab.id);
                }}
              >
                {current && (
                  <motion.span
                    layoutId="bottomNavIndicator"
                    className={styles.indicator}
                    transition={INDICATOR_SPRING}
                  />
                )}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {tab.icon}
                </svg>
                <span className={styles.label}>{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
