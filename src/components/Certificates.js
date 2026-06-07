"use client";
import { useState, useCallback, useEffect } from "react";
import { useReveal, useRevealGroup } from "@/lib/animations";
import credentialsData from "@/data/credentials.json";
import styles from "./Certificates.module.css";

const CATEGORIES = ["All", "Training & Courses", "IEEE & Events"];

export default function Certificates() {
  const titleRef = useReveal();
  const gridRef = useRevealGroup({ threshold: 0.05 });
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const certificates = credentialsData.certificates;

  const filtered =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  const openLightbox = useCallback((image, title) => {
    setLightboxImage(image);
    setLightboxTitle(title);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    setLightboxTitle("");
    document.body.style.overflow = "";
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox]);

  return (
    <section className={`section ${styles.certificates}`} id="certificates">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" ref={titleRef}>
          <p className={`mono ${styles.label}`}>&lt;certificates /&gt;</p>
          <h2 className="section-title">Achievements &amp; Certificates</h2>
          <p
            className="section-subtitle"
            style={{ margin: "0 auto var(--space-xl)" }}
          >
            Official recognitions from IEEE, ICTHub, and more
          </p>
          <div className="divider" />
        </div>

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
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download My CV
          </a>
        </div>

        {/* Category Filter Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Filter certificates by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ""}`}
              onClick={() => setActiveCategory(cat)}
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
          {filtered.map((cert) => (
            <div key={cert.id} className={styles.card} id={`cert-${cert.id}`}>
              {/* Image Preview */}
              <div
                className={styles.cardImage}
                onClick={() => openLightbox(cert.image, cert.title)}
                role="button"
                tabIndex={0}
                aria-label={`View ${cert.title} certificate`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(cert.image, cert.title);
                  }
                }}
              >
                <img
                  src={cert.image}
                  alt={`${cert.title} — ${cert.issuer}`}
                  loading="lazy"
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
                  <span className={styles.cardDate}>{cert.date}</span>
                </div>
                <h3 className={styles.cardTitle}>{cert.title}</h3>
                <p className={styles.cardIssuer}>{cert.issuer}</p>
                <p className={styles.cardDesc}>{cert.description}</p>
                <button
                  className={styles.viewBtn}
                  onClick={() => openLightbox(cert.image, cert.title)}
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

      {/* Glow Orb Decorations */}
      <div
        className="glow-orb glow-orb--accent"
        style={{ width: 350, height: 350, top: "20%", right: "-5%" }}
      />
      <div
        className="glow-orb glow-orb--purple"
        style={{ width: 280, height: 280, bottom: "10%", left: "-4%" }}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${lightboxTitle}`}
        >
          <button
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className={styles.lightboxImg}
            />
            <p className={styles.lightboxCaption}>{lightboxTitle}</p>
          </div>
        </div>
      )}
    </section>
  );
}
