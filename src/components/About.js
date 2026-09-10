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
          <p className={`mono ${styles.label}`}>&lt;about /&gt;</p>
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

          {/* Decorative Column */}
          <div className={styles.visual}>
            <div className={styles.card}>
              <div className={styles.cardGlow} />
              <div className={styles.cardContent}>
                <div className={styles.codeBlock}>
                  <span className={styles.codeLine}>
                    <span className={styles.codeKeyword}>const</span>{" "}
                    <span className={styles.codeVar}>developer</span> ={" "}
                    {"{"}
                  </span>
                  <span className={styles.codeLine}>
                    {"  "}name: <span className={styles.codeString}>&quot;Youssef Eslam&quot;</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"  "}role: <span className={styles.codeString}>&quot;Full-Stack Developer&quot;</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"  "}passions: [
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}<span className={styles.codeString}>&quot;Web&quot;</span>,{" "}
                    <span className={styles.codeString}>&quot;Cloud&quot;</span>,{" "}
                    <span className={styles.codeString}>&quot;Robotics&quot;</span>
                  </span>
                  <span className={styles.codeLine}>{"  "}],</span>
                  <span className={styles.codeLine}>
                    {"  "}available: <span className={styles.codeBool}>true</span>
                  </span>
                  <span className={styles.codeLine}>{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Orb */}
      <div className="glow-orb glow-orb--purple" style={{ width: 400, height: 400, top: "20%", right: "-5%" }} />
    </section>
  );
}
