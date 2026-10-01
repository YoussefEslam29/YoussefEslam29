"use client";
import { useReveal } from "@/lib/animations";
import styles from "./About.module.css";

export default function About() {
  const titleRef = useReveal();
  const contentRef = useReveal({ threshold: 0.2 });

  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className="section-header" ref={titleRef}>
          <p className="kicker">About</p>
          <h2 className="section-title">Who I Am</h2>
          <div className="divider" />
        </div>

        <div className={styles.grid} ref={contentRef}>
          {/* Text Column */}
          <div className={styles.text}>
            <p className={styles.intro}>
              I&apos;m <strong>Youssef Eslam Hussein</strong>, a 4th-year{" "}
              <span className={styles.highlight}>Computer Engineering</span>{" "}
              student at the Arab Academy for Science, Technology &amp; Maritime
              Transport in Alexandria.
            </p>
            <p>
              My work runs from full-stack web applications to teleoperated
              robots. I am a member of the{" "}
              <span className={styles.highlight}>AWS Community Core Team</span>{" "}
              at my university.
            </p>
            <p>
              I am based between <strong>Egypt</strong> and{" "}
              <strong>Saudi Arabia</strong>. Recent projects include a
              motorcycle sales platform built on Next.js, a robot driven over
              ROS 2 from a PlayStation controller, and a two-pass SIC/XE
              assembler written from scratch.
            </p>
          </div>

          {/* Personnel file: the quick facts, typed up noir-style */}
          <div className={styles.visual}>
            <div className={styles.file}>
              <div className={styles.fileTab} aria-hidden="true">Nº 29</div>
              <div className={styles.fileHead}>
                <span>Personnel file</span>
                <span>Egypt · KSA</span>
              </div>
              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <dt>Name</dt>
                  <dd>Youssef Eslam</dd>
                </div>
                <div className={styles.fact}>
                  <dt>Role</dt>
                  <dd>Full-Stack Developer</dd>
                </div>
                <div className={styles.fact}>
                  <dt>Focus</dt>
                  <dd>Web · Cloud · Robotics</dd>
                </div>
                <div className={styles.fact}>
                  <dt>Status</dt>
                  <dd>
                    <span className={styles.stamp}>Available</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Background haze */}
      <div className="glow-orb glow-orb--crimson" style={{ width: 560, height: 560, top: "18%", right: "-10%" }} />
    </section>
  );
}
