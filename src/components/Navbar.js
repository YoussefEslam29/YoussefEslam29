"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useActiveSection } from "@/lib/animations";
import { useBackToClose, useScrollLock, useFocusTrap, scrollToSection } from "@/lib/mobile";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import BottomNav, { INDICATOR_SPRING } from "./BottomNav";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
// Hoisted: a new array each render would rebuild the scroll-spy every time
const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const menuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 26,
      stiffness: 180,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  // Leaving is quicker than arriving
  exit: { x: "100%", transition: { type: "tween", duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const linkVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.15 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const drawerRef = useRef(null);
  const draggedRef = useRef(false);
  const pendingTarget = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phone Back closes the drawer; the page behind it stays put
  const releaseHistory = useBackToClose(mobileOpen, () => setMobileOpen(false));
  useScrollLock(mobileOpen);
  const closeMenu = useCallback(() => {
    releaseHistory();
    setMobileOpen(false);
  }, [releaseHistory]);
  useFocusTrap(drawerRef, mobileOpen, closeMenu);

  const handleNav = useCallback(
    (id) => {
      if (mobileOpen) {
        // Keep the history entry; scrollToSection turns it into #id
        releaseHistory(true);
        pendingTarget.current = id;
        setMobileOpen(false);
      } else {
        scrollToSection(id);
      }
    },
    [mobileOpen, releaseHistory]
  );

  // Declared after useScrollLock: React runs every effect cleanup (the
  // unlock) before new effects, so the page is scrollable again here.
  useEffect(() => {
    if (mobileOpen || !pendingTarget.current) return;
    const id = pendingTarget.current;
    pendingTarget.current = null;
    scrollToSection(id, { focusHeading: true });
  }, [mobileOpen]);

  // Rotating to portrait shows the tab bar and widening shows the desktop
  // links, so the drawer has no reason to stay open.
  useEffect(() => {
    if (!mobileOpen) return;
    const mql = window.matchMedia("(max-width: 767px) and (orientation: portrait), (min-width: 1024px)");
    const onChange = (e) => {
      if (e.matches) closeMenu();
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mobileOpen, closeMenu]);

  return (
    <MotionConfig reducedMotion="user">
      {/* layoutRoot: the bar is fixed, so the gliding underline must be
          measured without the page scroll, or it lags and jumps while the
          page moves */}
      <motion.nav
        layoutRoot
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
        id="navbar"
      >
        <div className={`container ${styles.navInner}`}>
          {/* Logo */}
          <a
            href="#home"
            className={styles.logo}
            onClick={(e) => {
              e.preventDefault();
              handleNav("home");
            }}
          >
            <Image
              src="/logo-owl.png"
              alt=""
              width={22}
              height={32}
              className={styles.logoMark}
              priority
            />
            <span className={styles.logoText}>Youssef Eslam</span>
          </a>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.id} style={{ position: "relative" }}>
                <a
                  href={`#${link.id}`}
                  className={`${styles.link} ${activeSection === link.id ? styles.active : ""}`}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.id);
                  }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className={styles.activeBar}
                      transition={INDICATOR_SPRING}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA: an outline on the crimson sky, lacquer once the bar turns solid */}
          <a
            href="#contact"
            className={`btn ${scrolled ? "btn-primary" : "btn-ghost"} ${styles.cta}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
          >
            Let&apos;s Talk
          </a>

          {/* Phones in portrait: the tab bar has the sections, so the top bar
              keeps the CV within reach instead of a menu */}
          <a
            href="/resume/youssef_eslam_cv.pdf"
            download
            className={`btn btn-ghost ${styles.cvBtn}`}
            aria-label="Download CV"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>CV</span>
          </a>

          {/* Menu toggle (landscape phones and tablets) */}
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

      {/* Mobile Drawer (with AnimatePresence) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Fading Backdrop Overlay */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className={styles.backdrop}
              onClick={closeMenu}
            />

            {/* Sliding Menu Panel: swipe it right to close */}
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
              onDragStart={() => {
                draggedRef.current = true;
              }}
              onDragEnd={(_, info) => {
                // Let the click that ends a swipe see the flag, then clear it
                setTimeout(() => {
                  draggedRef.current = false;
                }, 0);
                if (info.offset.x > 80 || info.velocity.x > 500) closeMenu();
              }}
            >
              <motion.ul className={styles.mobileLinks}>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.id} variants={linkVariants}>
                    <a
                      href={`#${link.id}`}
                      className={`${styles.mobileLink} ${activeSection === link.id ? styles.active : ""}`}
                      aria-current={activeSection === link.id ? "location" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (draggedRef.current) return;
                        handleNav(link.id);
                      }}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={linkVariants} style={{ marginTop: "2rem" }}>
                <a
                  href="#contact"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (draggedRef.current) return;
                    handleNav("contact");
                  }}
                >
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
