"use client";
import { useState, useEffect, useCallback } from "react";
import { useActiveSection } from "@/lib/animations";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

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
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} id="navbar">
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
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`${styles.link} ${activeSection === link.id ? styles.active : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
              >
                {link.label}
                {activeSection === link.id && <span className={styles.activeBar} />}
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

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} style={{ transitionDelay: `${0.05 * i}s` }}>
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
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="btn btn-primary"
          style={{ marginTop: "1.5rem", width: "100%" }}
          onClick={(e) => {
            e.preventDefault();
            handleNav("contact");
          }}
        >
          Let&apos;s Talk
        </a>
      </div>
    </nav>
  );
}
