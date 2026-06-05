import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import projectsData from "@/data/projects.json";

export async function GET() {
  try {
    const collection = await getCollection("projects");
    if (collection) {
      const projects = await collection.find({}).toArray();
      if (projects.length > 0) {
        return NextResponse.json(projects);
      }
    }
    // Fallback to static JSON
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(projectsData);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection("projects");

    if (!collection) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const project = {
      ...body,
      id: body.id || body.title.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(project);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
