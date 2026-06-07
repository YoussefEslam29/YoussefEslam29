"use client";
import { useRef, useEffect } from "react";
import { useTypingEffect } from "@/lib/animations";
import { createAvatarScene } from "@/lib/three-avatar";
import styles from "./Hero.module.css";

const TYPED_STRINGS = [
  "Software & Web Developer",
  "Cloud Architecture Enthusiast",
  "Robotics Builder",
  "Full-Stack Engineer",
];

export default function Hero() {
  const canvasRef = useRef(null);
  const displayText = useTypingEffect(TYPED_STRINGS, 70, 35, 2200);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = createAvatarScene(canvasRef.current);
    return cleanup;
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero} id="home">
      {/* Background Effects */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.gridOverlay} />

      {/* 3D Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.textBlock}>
          <p className={styles.greeting}>
            <span className={styles.wave}>👋</span> Hello, I&apos;m
          </p>

          <h1 className={styles.name}>
            Youssef
            <br />
            <span className={styles.nameLast}>Eslam Hussein</span>
          </h1>

          <div className={styles.typedWrap}>
            <span className={`mono ${styles.typedText}`}>
              {displayText}
              <span className={styles.cursor}>|</span>
            </span>
          </div>

          <p className={styles.tagline}>
            Computer Engineering student at AASTMT. Building bold web
            applications, cloud solutions, and robotic systems.
          </p>

          <div className={styles.actions}>
            <a href="#projects" className="btn btn-primary" onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}>
              View My Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
            <a href="#contact" className="btn btn-ghost" onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Get In Touch
            </a>
            <a
              href="/resume/youssef_eslam_cv.pdf"
              download
              className="btn btn-ghost"
              id="download-cv-hero"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV
            </a>
          </div>

          {/* Social Quick Links */}
          <div className={styles.socials}>
            <a href="https://github.com/YoussefEslam29" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/youssef-eslam-hussein-240142205/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/XIXYA_29" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X / Twitter" title="X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button className={styles.scrollDown} onClick={scrollToAbout} aria-label="Scroll to about section">
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span className={styles.scrollText}>Scroll</span>
      </button>
    </section>
  );
}
