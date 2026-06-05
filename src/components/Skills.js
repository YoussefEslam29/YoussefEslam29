"use client";
import { useState } from "react";
import { useReveal, useRevealGroup } from "@/lib/animations";
import skillsData from "@/data/skills.json";
import styles from "./Skills.module.css";

const CATEGORIES = ["All", "Languages & Web", "Databases & Cloud", "Hardware & Systems"];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const titleRef = useReveal();
  const gridRef = useRevealGroup({ threshold: 0.1 });

  const filtered =
    activeCategory === "All"
      ? skillsData
      : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section className={`section ${styles.skills}`} id="skills">
      <div className="container">
        <div className="section-header" ref={titleRef}>
          <p className={`mono ${styles.label}`}>&lt;skills /&gt;</p>
          <h2 className="section-title">What I Work With</h2>
          <p className="section-subtitle" style={{ margin: "0 auto var(--space-xl)" }}>
            Technologies and tools I use to bring ideas to life — from frontend
            frameworks to embedded systems.
          </p>
          <div className="divider" />
        </div>

        {/* Filter Tabs */}
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className={`${styles.grid} stagger-children`} ref={gridRef}>
          {filtered.map((skill) => (
            <div key={skill.id} className={styles.card}>
              <div className={styles.cardInner}>
                {/* Proficiency Ring */}
                <div className={styles.ring}>
                  <svg viewBox="0 0 100 100" className={styles.ringSvg}>
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="rgba(168,85,247,0.1)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="url(#purpleGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${skill.proficiency * 2.64} ${264 - skill.proficiency * 2.64}`}
                      strokeDashoffset="66"
                      className={styles.ringProgress}
                    />
                    <defs>
                      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6C2BD9" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className={styles.ringIcon}>{skill.icon}</span>
                </div>

                <h3 className={styles.cardTitle}>{skill.name}</h3>
                <span className={styles.cardProficiency}>{skill.proficiency}%</span>

                {/* Hover Details */}
                <div className={styles.cardOverlay}>
                  <p className={styles.cardDesc}>{skill.description}</p>
                  <span className={`tag ${styles.cardCategory}`}>{skill.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-orb glow-orb--accent" style={{ width: 350, height: 350, bottom: "10%", left: "-5%" }} />
    </section>
  );
}
