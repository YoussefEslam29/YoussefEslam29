import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function POST() {
  try {
    const collection = await getCollection("projects");

    if (!collection) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Fetch repos from GitHub
    const res = await fetch(
      "https://api.github.com/users/YoussefEslam29/repos?sort=updated&per_page=30&type=owner",
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const repos = await res.json();
    let synced = 0;

    for (const repo of repos) {
      if (repo.fork || repo.archived) continue;

      const project = {
        id: repo.name,
        title: repo.name
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || "Repository on GitHub.",
        techStack: [repo.language].filter(Boolean),
        category: "Web",
        github: repo.html_url,
        live: repo.homepage || null,
        stars: repo.stargazers_count,
        fromGitHub: true,
        updatedAt: new Date(),
      };

      await collection.updateOne(
        { id: repo.name },
        { $set: project, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      synced++;
    }

    return NextResponse.json({ success: true, synced });
  } catch (error) {
    console.error("GitHub sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
