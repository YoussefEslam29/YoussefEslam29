"use client";
import { useState } from "react";
import { useReveal, useRevealGroup, scrollBehavior } from "@/lib/animations";
import skillsData from "@/data/skills.json";
import styles from "./Skills.module.css";

const CATEGORIES = ["All", "Languages & Web", "Databases & Cloud", "Hardware & Systems"];

// Each category burns its own neon colour; the filter buttons carry the key.
const TONE = {
  "Languages & Web": styles.toneRed,
  "Databases & Cloud": styles.tonePink,
  "Hardware & Systems": styles.toneAmber,
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  // The tile lit by a tap or the keyboard (touch screens have no hover)
  const [openId, setOpenId] = useState(null);
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
          <p className="kicker">Skills</p>
          <h2 className="section-title">What I Work With</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            The languages, frameworks, and hardware I work with, from
            frontend frameworks to embedded systems.
          </p>
          <div className="divider" />
        </div>

        {/* Filter Plaques */}
        <div className="filter-bar" role="group" aria-label="Filter skills by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${TONE[cat] ? `${styles.legend} ${TONE[cat]}` : ""}`}
              aria-pressed={activeCategory === cat}
              onClick={(e) => {
                setActiveCategory(cat);
                setOpenId(null);
                // Keep the chosen chip fully on screen in the swipeable row
                e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest", behavior: scrollBehavior() });
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className={styles.hint}>Tap a tile to light it up</p>

        {/* Skills Grid */}
        <div className={`${styles.grid} stagger-children`} ref={gridRef}>
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className={`${styles.card} ${TONE[skill.category] || styles.toneRed}`}
              data-open={openId === skill.id || undefined}
            >
              {/* The whole tile is the switch. Kept apart from the heading:
                  a <button> cannot contain an <h3>. */}
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={openId === skill.id}
                aria-controls={`skill-sign-${skill.id}`}
                aria-label={`${skill.name} details`}
                onClick={() => setOpenId((id) => (id === skill.id ? null : skill.id))}
              />
              <div className={styles.cardInner}>
                <span className={styles.ring} aria-hidden="true">
                  {skill.icon}
                </span>

                <h3 className={styles.cardTitle}>{skill.name}</h3>

                {/* Details: the tile switches on like a neon sign, on hover or tap */}
                <div className={styles.sign} id={`skill-sign-${skill.id}`}>
                  <p className={styles.signName} aria-hidden="true">{skill.name}</p>
                  <p className={styles.cardDesc}>{skill.description}</p>
                  <span className={styles.cardCategory}>{skill.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-orb glow-orb--amber" style={{ width: 460, height: 460, bottom: "6%", left: "-10%" }} />
    </section>
  );
}
