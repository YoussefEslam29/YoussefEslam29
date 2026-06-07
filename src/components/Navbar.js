"use client";
import { useState, useEffect, useCallback } from "react";
import { useActiveSection } from "@/lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

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
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 220,
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
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
  const activeSection = useActiveSection(NAV_LINKS.map((l) => l.id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = useCallback(
    (id) => {
      setMobileOpen(false);
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <>
      <motion.nav
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
            <span className={styles.logoIcon}>Y</span>
            <span className={styles.logoText}>
              Youssef<span className={styles.logoDot}>.</span>
            </span>
          </a>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.id} style={{ position: "relative" }}>
                <a
                  href={`#${link.id}`}
                  className={`${styles.link} ${activeSection === link.id ? styles.active : ""}`}
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
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contact"
            className={`btn btn-primary ${styles.cta} hide-tablet`}
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
          >
            Let&apos;s Talk
          </a>

          {/* Mobile Toggle */}
          <button
            className={`${styles.burger} hide-desktop`}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
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
              onClick={() => setMobileOpen(false)}
            />

            {/* Sliding Menu Panel */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={styles.mobileMenu}
            >
              <motion.ul className={styles.mobileLinks}>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.id} variants={linkVariants}>
                    <a
                      href={`#${link.id}`}
                      className={`${styles.mobileLink} ${activeSection === link.id ? styles.active : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
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
    </>
  );
}
