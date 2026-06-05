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
              I&apos;m <strong>Youssef Eslam Hussein</strong> — a 3rd-year{" "}
              <span className={styles.highlight}>Computer Engineering</span>{" "}
              student at the Arab Academy for Science, Technology &amp; Maritime
              Transport, passionate about building things that matter.
            </p>
            <p>
              From full-stack web applications to teleoperated robots, I thrive
              at the intersection of software, hardware, and cloud. I&apos;m
              currently active as a member of the{" "}
              <span className={styles.highlight}>AWS Community Core Team</span>,
              and I&apos;m always looking for the next challenge that pushes me
              to learn something new.
            </p>
            <p>
              Based between <strong>Egypt</strong> and{" "}
              <strong>Saudi Arabia</strong>, I bring a global perspective to
              every project I work on. Whether it&apos;s a motorcycle sales
              platform, a machine learning model, or a robot controlled with a
              PlayStation joystick — I build it, I ship it, and I make it count.
            </p>

            {/* Quick Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Projects Built</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>3+</span>
                <span className={styles.statLabel}>Years Coding</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>2</span>
                <span className={styles.statLabel}>Countries</span>
              </div>
            </div>
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
