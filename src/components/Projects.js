"use client";
import { useState, useEffect } from "react";
import { useReveal, useRevealGroup } from "@/lib/animations";
import projectsData from "@/data/projects.json";
import styles from "./Projects.module.css";

const CATEGORIES = ["All", "Web", "Robotics", "ML", "Systems"];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [ghProjects, setGhProjects] = useState([]);
  const titleRef = useReveal();
  const gridRef = useRevealGroup({ threshold: 0.05 });

  // Fetch GitHub repos client-side
  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          "https://api.github.com/users/YoussefEslam29/repos?sort=updated&per_page=20&type=owner",
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );
        if (!res.ok) return;
        const repos = await res.json();
        const mapped = repos
          .filter((r) => !r.fork && !r.archived)
          .slice(0, 6)
          .map((r) => ({
            id: `gh-${r.name}`,
            title: r.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            description: r.description || "Repository on GitHub.",
            techStack: [r.language].filter(Boolean),
            category: "Web",
            github: r.html_url,
            live: r.homepage || null,
            featured: false,
            fromGitHub: true,
          }));
        setGhProjects(mapped);
      } catch {
        // silently fail
      }
    }
    fetchRepos();
  }, []);

  // Merge: manual projects first, then GitHub repos (no duplicates)
  const manualIds = new Set(projectsData.map((p) => p.id));
  const allProjects = [
    ...projectsData,
    ...ghProjects.filter((g) => !manualIds.has(g.id.replace("gh-", ""))),
  ];

  const filtered =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <div className="section-header" ref={titleRef}>
          <p className={`mono ${styles.label}`}>&lt;projects /&gt;</p>
          <h2 className="section-title">What I&apos;ve Built</h2>
          <p className="section-subtitle" style={{ margin: "0 auto var(--space-xl)" }}>
            A collection of projects spanning web development, robotics,
            machine learning, and low-level systems.
          </p>
          <div className="divider" />
        </div>

        {/* Filters */}
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

        {/* Grid */}
        <div className={`${styles.grid} stagger-children`} ref={gridRef}>
          {filtered.map((project) => (
            <div key={project.id} className={styles.card}>
              {/* Card Header with gradient */}
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderBg} />
                <div className={styles.cardHeaderContent}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.folderIcon}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className={styles.cardLinks}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.cardLinkIcon} aria-label="GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.cardLinkIcon} aria-label="Live Demo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.techTags}>
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.fromGitHub && (
                  <span className={styles.ghBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    Synced
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-orb glow-orb--purple" style={{ width: 450, height: 450, top: "30%", right: "-8%" }} />
    </section>
  );
}
