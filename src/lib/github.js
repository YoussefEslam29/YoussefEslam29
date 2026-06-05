/**
 * Fetch public repos and profile for YoussefEslam29 from GitHub API.
 */
const GITHUB_USERNAME = "YoussefEslam29";
const API_BASE = "https://api.github.com";

let cachedRepos = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchGitHubRepos() {
  if (cachedRepos && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedRepos;
  }

  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const repos = await res.json();

    cachedRepos = repos
      .filter((r) => !r.fork && !r.archived)
      .map((r) => ({
        id: r.name,
        title: formatRepoName(r.name),
        description: r.description || "No description provided.",
        techStack: [r.language].filter(Boolean),
        category: categorizeRepo(r),
        github: r.html_url,
        live: r.homepage || null,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
        fromGitHub: true,
      }));

    cacheTime = Date.now();
    return cachedRepos;
  } catch (err) {
    console.error("GitHub API error:", err);
    return [];
  }
}

export async function fetchGitHubProfile() {
  try {
    const res = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("GitHub profile error:", err);
    return null;
  }
}

function formatRepoName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function categorizeRepo(repo) {
  const desc = (repo.description || "").toLowerCase();
  const lang = (repo.language || "").toLowerCase();

  if (desc.includes("robot") || desc.includes("ros") || desc.includes("raspberry")) return "Robotics";
  if (desc.includes("ml") || desc.includes("machine learning") || desc.includes("classification")) return "ML";
  if (desc.includes("assembler") || desc.includes("compiler") || desc.includes("system")) return "Systems";
  if (["javascript", "typescript", "html", "css"].includes(lang)) return "Web";
  if (["python"].includes(lang)) return "ML";
  return "Web";
}
