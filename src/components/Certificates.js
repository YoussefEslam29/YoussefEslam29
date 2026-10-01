"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import { useReveal, useRevealGroup, scrollBehavior } from "@/lib/animations";
import { useBackToClose, useScrollLock, useFocusTrap } from "@/lib/mobile";
import credentialsData from "@/data/credentials.json";
import styles from "./Certificates.module.css";

const CATEGORIES = ["All", "Training & Courses", "IEEE & Events"];

const certificates = credentialsData.certificates;
const education = credentialsData.education || [];

const stop = (e) => e.stopPropagation();

export default function Certificates() {
  const titleRef = useReveal();
  const gridRef = useRevealGroup({ threshold: 0.05 });
  const [activeCategory, setActiveCategory] = useState("All");
  // The lightbox shows filtered[activeIndex]; -1 means closed
  const [activeIndex, setActiveIndex] = useState(-1);
  // +1 or -1: which side the next certificate slides in from
  const [direction, setDirection] = useState(0);
  const dialogRef = useRef(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? certificates
        : certificates.filter((c) => c.category === activeCategory),
    [activeCategory]
  );

  const open = activeIndex >= 0;
  const current = open ? filtered[activeIndex] : null;

  const openLightbox = useCallback((index) => {
    setDirection(0);
    setActiveIndex(index);
  }, []);

  // Phone Back closes the lightbox; the page behind it stays put
  const release = useBackToClose(open, () => setActiveIndex(-1));
  useScrollLock(open);
  const closeLightbox = useCallback(() => {
    release();
    setActiveIndex(-1);
  }, [release]);
  // Esc closes it, Tab stays inside it, and focus returns to the card after
  useFocusTrap(dialogRef, open, closeLightbox);

  const step = useCallback(
    (dir) => {
      setDirection(dir);
      setActiveIndex((i) => (i + dir + filtered.length) % filtered.length);
    },
    [filtered.length]
  );
  const showNext = useCallback(() => step(1), [step]);
  const showPrev = useCallback(() => step(-1), [step]);

  // Arrow keys step through the certificates
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, showNext, showPrev]);

  // Fetch the neighbours ahead of time, so a swipe lands on a loaded image
  useEffect(() => {
    if (!open || filtered.length < 2) return;
    for (const d of [1, -1]) {
      const img = new window.Image();
      img.src = filtered[(activeIndex + d + filtered.length) % filtered.length].image;
    }
  }, [open, activeIndex, filtered]);

  return (
    <section className={`section ${styles.certificates}`} id="certificates">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" ref={titleRef}>
          <p className="kicker">Certificates</p>
          <h2 className="section-title">Achievements &amp; Certificates</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Official recognitions from IEEE, ICTHub, and more
          </p>
          <div className="divider" />
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className={styles.education}>
            <h3 className={styles.educationHeading}>Education</h3>
            {education.map((item) => (
              <div key={item.id} className={styles.educationItem}>
                <div className={styles.educationTop}>
                  <span className={styles.educationDegree}>{item.degree}</span>
                  <span className={`mono ${styles.educationYear}`}>
                    {item.year}
                  </span>
                </div>
                <p className={styles.educationInstitution}>
                  {item.institution}
                </p>
                {item.description && (
                  <p className={styles.educationDescription}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Download CV Button */}
        <div className={styles.cvRow}>
          <a
            href="/resume/youssef_eslam_cv.pdf"
            download
            className={`btn btn-primary ${styles.cvBtn}`}
            id="download-cv-certificates"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download My CV
          </a>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-bar" role="tablist" aria-label="Filter certificates by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className="filter-btn"
              onClick={(e) => {
                setActiveCategory(cat);
                // Keep the chosen chip fully on screen in the swipeable row
                e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest", behavior: scrollBehavior() });
              }}
              id={`cert-tab-${cat.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Certificate Cards Grid */}
        <div
          className={`${styles.grid} stagger-children`}
          ref={gridRef}
          role="tabpanel"
        >
          {filtered.map((cert, index) => (
            <div key={cert.id} className={styles.card} id={`cert-${cert.id}`}>
              {/* Image Preview: a mouse shortcut. The View button below is
                  the one accessible control (on phones it covers the card). */}
              <div className={styles.cardImage} onClick={() => openLightbox(index)}>
                <Image
                  src={cert.image}
                  alt={`${cert.title}, issued by ${cert.issuer}`}
                  fill
                  sizes="(max-width: 767px) 112px, (max-width: 1024px) 50vw, 33vw"
                  className={styles.cardImageInner}
                />
                <div className={styles.cardImageOverlay}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>View Certificate</span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{cert.category}</span>
                  {cert.date && <span className={styles.cardDate}>{cert.date}</span>}
                </div>
                <h3 className={styles.cardTitle}>{cert.title}</h3>
                <p className={styles.cardIssuer}>{cert.issuer}</p>
                <p className={styles.cardDesc}>{cert.description}</p>
                <button
                  type="button"
                  className={styles.viewBtn}
                  onClick={() => openLightbox(index)}
                  aria-label={`View full certificate: ${cert.title}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No certificates in this category yet.</p>
          </div>
        )}
      </div>

      {/* Background haze */}
      <div
        className="glow-orb glow-orb--amber"
        style={{ width: 460, height: 460, top: "16%", right: "-10%" }}
      />
      <div
        className="glow-orb glow-orb--crimson"
        style={{ width: 420, height: 420, bottom: "6%", left: "-10%" }}
      />

      {/* Lightbox Modal. Portalled to <body>: the section is its own stacking
          context, which would otherwise trap the modal under the navbar. */}
      {current && createPortal(
        <MotionConfig reducedMotion="user">
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            ref={dialogRef}
            onClick={closeLightbox}
          >
            <div className={styles.lightboxBar} onClick={stop}>
              <span className={styles.counter} aria-live="polite">
                {activeIndex + 1} / {filtered.length}
              </span>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label="Close certificate"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <figure className={styles.lightboxContent} onClick={stop}>
              {/* Only the image takes the swipe, so the caption can still
                  scroll: left/right steps through, down closes. */}
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
                    closeLightbox();
                  }
                }}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
              <figcaption className={styles.lightboxCaption}>
                <h3 id="lightbox-title" className={styles.lightboxTitle}>
                  {current.title}
                </h3>
                <p className={styles.lightboxMeta}>
                  {current.issuer}
                  {current.date ? ` · ${current.date}` : ""}
                </p>
                <p className={styles.lightboxDesc}>{current.description}</p>
                <a
                  href={current.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.fullSize}
                >
                  Open full size
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </figcaption>
            </figure>

            <div className={styles.lightboxNav} onClick={stop}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={showPrev}
                aria-label="Previous certificate"
                disabled={filtered.length < 2}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Prev
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={showNext}
                aria-label="Next certificate"
                disabled={filtered.length < 2}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </MotionConfig>,
        document.body
      )}
    </section>
  );
}
