"use client";
import { useReveal } from "@/lib/animations";
import credentialsData from "@/data/credentials.json";
import styles from "./Credentials.module.css";

export default function Credentials() {
  const titleRef = useReveal();
  const eduRef = useReveal({ threshold: 0.2 });
  const certRef = useReveal({ threshold: 0.2 });

  return (
    <section className={`section ${styles.credentials}`} id="credentials">
      <div className="container">
        <div className="section-header" ref={titleRef}>
          <p className={`mono ${styles.label}`}>&lt;credentials /&gt;</p>
          <h2 className="section-title">Education &amp; Credentials</h2>
          <p className="section-subtitle" style={{ margin: "0 auto var(--space-xl)" }}>
            My academic journey and professional certifications.
          </p>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {/* Education */}
          <div ref={eduRef}>
            <h3 className={styles.groupTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 6v4"/><path d="M14 10a2 2 0 1 1-4 0"/></svg>
              Education
            </h3>
            {credentialsData.education.map((edu) => (
              <div key={edu.id} className={styles.card}>
                <div className={styles.cardAccent} />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>{edu.degree}</h4>
                    <span className={styles.cardYear}>{edu.year}</span>
                  </div>
                  <p className={styles.cardInstitution}>{edu.institution}</p>
                  <p className={styles.cardDesc}>{edu.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Certificates & Activities */}
          <div ref={certRef}>
            <h3 className={styles.groupTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              Certificates &amp; Activities
            </h3>
            {credentialsData.certificates.map((cert) => (
              <div key={cert.id} className={`${styles.card} ${styles.certCard}`}>
                <div className={styles.cardAccent} />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>{cert.title}</h4>
                    <span className={styles.cardYear}>{cert.date}</span>
                  </div>
                  <p className={styles.cardInstitution}>{cert.issuer}</p>
                  <p className={styles.cardDesc}>{cert.description}</p>
                </div>
              </div>
            ))}
            {credentialsData.activities.map((act) => (
              <div key={act.id} className={styles.card}>
                <div className={styles.cardAccent} />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>{act.title}</h4>
                  </div>
                  <p className={styles.cardInstitution}>{act.organization}</p>
                  <p className={styles.cardDesc}>{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glow-orb glow-orb--accent" style={{ width: 300, height: 300, top: "50%", left: "-3%" }} />
    </section>
  );
}
